import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mirrors features/payments-engine/fees.ts — duplicated here since this
// script runs standalone via tsx and can't use the app's `@/` path aliases.
function calculateFee(amount: number) {
  return Math.round((amount * 0.029 + 0.3) * 100) / 100;
}

interface SeedPaymentSpec {
  amount: number;
  outcome: "succeeded" | "failed" | "cancelled" | "processing" | "refunded";
  daysAgo: number;
  clientEmail?: string;
  reference?: string;
}

async function seedPayment(
  merchantId: string,
  paymentLinkId: string,
  reservePercentage: number,
  spec: SeedPaymentSpec
) {
  const createdAt = new Date(Date.now() - spec.daysAgo * 24 * 60 * 60 * 1000);

  const checkoutSession = await prisma.checkoutSession.create({
    data: {
      merchantId,
      paymentLinkId,
      status: spec.outcome === "cancelled" ? "CANCELLED" : "COMPLETED",
      createdAt,
      completedAt: createdAt,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      merchantId,
      paymentLinkId,
      checkoutSessionId: checkoutSession.id,
      amount: spec.amount,
      currency: "USD",
      reference: spec.reference,
      clientEmail: spec.clientEmail,
      status: "DRAFT",
      createdAt,
      updatedAt: createdAt,
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      merchantId,
      paymentLinkId,
      paymentId: payment.id,
      amount: spec.amount,
      currency: "USD",
      status: "PENDING",
      descriptor: spec.reference,
      createdAt,
      updatedAt: createdAt,
    },
  });

  const events: { type: string; message: string }[] = [
    { type: "created", message: "Payment created" },
    { type: "checkout_opened", message: "Checkout opened" },
    { type: "pending", message: "Awaiting customer payment" },
    { type: "submitted", message: "Payment submitted by customer" },
  ];

  if (spec.outcome === "cancelled") {
    events.push({ type: "cancelled", message: "Payment cancelled" });
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELLED" } });
    await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "CANCELLED" } });
  } else {
    events.push({ type: "processing", message: "Payment is being processed" });
    await prisma.merchantWallet.update({
      where: { merchantId },
      data: { processingBalance: { increment: spec.amount } },
    });
    await prisma.ledgerEntry.create({
      data: {
        merchantId,
        paymentId: payment.id,
        transactionId: transaction.id,
        type: "CHARGE",
        balanceType: "PROCESSING",
        amount: spec.amount,
        currency: "USD",
        description: "Funds held while payment is processed",
        createdAt,
      },
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "PROCESSING" } });
    await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "AUTHORIZED" } });

    if (spec.outcome === "failed") {
      events.push({ type: "failed", message: "Card declined" });
      await prisma.merchantWallet.update({
        where: { merchantId },
        data: { processingBalance: { decrement: spec.amount } },
      });
      await prisma.ledgerEntry.create({
        data: {
          merchantId,
          paymentId: payment.id,
          transactionId: transaction.id,
          type: "REVERSAL",
          balanceType: "PROCESSING",
          amount: -spec.amount,
          currency: "USD",
          description: "Processing hold reversed (payment failed)",
          createdAt,
        },
      });
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", failureReason: "Card declined" },
      });
      await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "FAILED" } });
    } else {
      // succeeded, processing (left in-flight), or refunded (succeeds first, then refunds)
      const fee = calculateFee(spec.amount);
      const netAmount = Math.round((spec.amount - fee) * 100) / 100;
      const reserveAmount = Math.round(netAmount * (reservePercentage / 100) * 100) / 100;
      const pendingAmount = Math.round((netAmount - reserveAmount) * 100) / 100;

      if (spec.outcome === "processing") {
        // Leave it sitting in PROCESSING — no further wallet movement.
      } else {
        events.push({ type: "succeeded", message: "Payment succeeded" });
        await prisma.merchantWallet.update({
          where: { merchantId },
          data: {
            processingBalance: { decrement: spec.amount },
            pendingBalance: { increment: pendingAmount },
            reserveBalance: { increment: reserveAmount },
            lifetimeVolume: { increment: spec.amount },
            lifetimeFees: { increment: fee },
          },
        });
        await prisma.ledgerEntry.createMany({
          data: [
            {
              merchantId,
              paymentId: payment.id,
              transactionId: transaction.id,
              type: "CHARGE",
              balanceType: "PROCESSING",
              amount: -spec.amount,
              currency: "USD",
              description: "Processing hold released",
              createdAt,
            },
            {
              merchantId,
              paymentId: payment.id,
              transactionId: transaction.id,
              type: "FEE",
              balanceType: "PENDING",
              amount: -fee,
              currency: "USD",
              description: "Platform fee (2.9% + $0.30)",
              createdAt,
            },
            {
              merchantId,
              paymentId: payment.id,
              transactionId: transaction.id,
              type: "RESERVE_HOLD",
              balanceType: "RESERVE",
              amount: reserveAmount,
              currency: "USD",
              description: `Reserve held (${reservePercentage}%)`,
              createdAt,
            },
            {
              merchantId,
              paymentId: payment.id,
              transactionId: transaction.id,
              type: "CHARGE",
              balanceType: "PENDING",
              amount: pendingAmount,
              currency: "USD",
              description: "Net proceeds credited to pending balance",
              createdAt,
            },
          ],
        });

        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCEEDED", fee, netAmount },
        });
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "CAPTURED", fee, netAmount },
        });

        const receiptNumber = `RCPT-${createdAt.getFullYear()}-${payment.id.slice(0, 8).toUpperCase()}`;
        await prisma.receipt.create({
          data: {
            paymentId: payment.id,
            merchantId,
            receiptNumber,
            clientEmail: spec.clientEmail,
            amount: spec.amount,
            currency: "USD",
            issuedAt: createdAt,
          },
        });
        events.push({ type: "receipt_generated", message: `Receipt ${receiptNumber} generated` });

        if (spec.outcome === "refunded") {
          await prisma.merchantWallet.update({
            where: { merchantId },
            data: {
              pendingBalance: { decrement: pendingAmount },
              reserveBalance: { decrement: reserveAmount },
            },
          });
          await prisma.ledgerEntry.createMany({
            data: [
              {
                merchantId,
                paymentId: payment.id,
                transactionId: transaction.id,
                type: "REFUND",
                balanceType: "PENDING",
                amount: -pendingAmount,
                currency: "USD",
                description: "Refund debited from pending balance",
                createdAt,
              },
              {
                merchantId,
                paymentId: payment.id,
                transactionId: transaction.id,
                type: "REFUND",
                balanceType: "RESERVE",
                amount: -reserveAmount,
                currency: "USD",
                description: "Refund debited from reserve balance",
                createdAt,
              },
            ],
          });
          await prisma.receipt.update({ where: { paymentId: payment.id }, data: { status: "refunded" } });
          await prisma.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED" } });
          await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "REFUNDED" } });
          events.push({ type: "refunded", message: "Payment refunded" });
        }
      }
    }
  }

  await prisma.paymentEvent.createMany({
    data: events.map((e) => ({ paymentId: payment.id, type: e.type, message: e.message, createdAt })),
  });

  return payment;
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@shadopay.dev" },
    create: {
      email: "admin@shadopay.dev",
      name: "Platform Admin",
      role: "PLATFORM_ADMIN",
      emailVerified: true,
    },
    update: {},
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@acmehighrisk.com" },
    create: {
      email: "owner@acmehighrisk.com",
      name: "Jordan Lee",
      role: "MERCHANT_OWNER",
      emailVerified: true,
    },
    update: {},
  });

  const merchant = await prisma.merchant.upsert({
    where: { slug: "acme-high-risk" },
    create: {
      legalName: "Acme High Risk Ventures LLC",
      displayName: "Acme Ventures",
      tradingName: "Acme Ventures",
      slug: "acme-high-risk",
      category: "Nutraceuticals & Supplements",
      status: "APPROVED",
      country: "United States",
      addressLine1: "500 Market Street",
      city: "San Francisco",
      region: "CA",
      postalCode: "94105",
      contactEmail: "owner@acmehighrisk.com",
      supportEmail: "support@acmeventures.dev",
      phone: "+1 415 555 0134",
      businessDescription: "Direct-to-consumer nutraceutical brand selling subscription supplements.",
      payoutMethod: "BANK_TRANSFER",
      settlementCurrency: "USD",
      settlementSchedule: "WEEKLY",
      reservePercentage: 5,
      onboardingStep: 7,
      onboardingCompletedAt: new Date(),
      members: { create: { userId: owner.id, role: "OWNER" } },
    },
    update: {},
  });

  await prisma.merchantBranding.upsert({
    where: { merchantId: merchant.id },
    create: {
      merchantId: merchant.id,
      receiptName: "Acme Ventures",
      primaryColor: "#D4AF37",
      supportEmail: "support@acmeventures.dev",
      supportUrl: "https://acmeventures.dev/support",
    },
    update: {},
  });

  await prisma.kybProfile.upsert({
    where: { merchantId: merchant.id },
    create: {
      merchantId: merchant.id,
      registeredName: "Acme High Risk Ventures LLC",
      registrationNumber: "DE-2024-0198273",
      jurisdiction: "United States",
      businessType: "Nutraceuticals & Supplements",
      beneficialOwners: [{ name: "Jordan Lee", ownershipPct: 100, country: "United States" }],
      status: "APPROVED",
      reviewedAt: new Date(),
    },
    update: {},
  });

  await prisma.merchantWallet.upsert({
    where: { merchantId: merchant.id },
    create: { merchantId: merchant.id, currency: "USD" },
    update: {},
  });

  const paymentLink = await prisma.paymentLink.upsert({
    where: { slug: "acme-starter-kit" },
    create: {
      merchantId: merchant.id,
      title: "Starter supplement kit",
      description: "One-time purchase of the Acme starter kit.",
      reference: "ORDER-1042",
      amount: 89,
      currency: "USD",
      slug: "acme-starter-kit",
      successUrl: "https://acmeventures.dev/thank-you",
      cancelUrl: "https://acmeventures.dev/cart",
    },
    update: {},
  });

  const secondLink = await prisma.paymentLink.upsert({
    where: { slug: "acme-monthly-subscription" },
    create: {
      merchantId: merchant.id,
      title: "Monthly subscription",
      description: "Recurring monthly supplement subscription.",
      reference: "SUB-2201",
      amount: 45,
      currency: "USD",
      slug: "acme-monthly-subscription",
    },
    update: {},
  });

  // Only seed demo payments once (skip if this merchant already has some).
  const existingPaymentCount = await prisma.payment.count({ where: { merchantId: merchant.id } });
  if (existingPaymentCount === 0) {
    const specs: SeedPaymentSpec[] = [
      { amount: 89, outcome: "succeeded", daysAgo: 12, clientEmail: "priya@example.com", reference: "ORDER-1042" },
      { amount: 45, outcome: "succeeded", daysAgo: 10, clientEmail: "marco@example.com", reference: "SUB-2201" },
      { amount: 129, outcome: "succeeded", daysAgo: 8, clientEmail: "sam@example.com", reference: "ORDER-1051" },
      { amount: 45, outcome: "succeeded", daysAgo: 6, clientEmail: "ana@example.com", reference: "SUB-2202" },
      { amount: 89, outcome: "succeeded", daysAgo: 4, clientEmail: "lee@example.com", reference: "ORDER-1067" },
      { amount: 210, outcome: "succeeded", daysAgo: 2, clientEmail: "vip@example.com", reference: "ORDER-1080" },
      { amount: 60, outcome: "refunded", daysAgo: 9, clientEmail: "refund@example.com", reference: "ORDER-1049" },
      { amount: 75, outcome: "failed", daysAgo: 3, clientEmail: "declined@example.com", reference: "ORDER-1071" },
      { amount: 45, outcome: "cancelled", daysAgo: 1, clientEmail: "abandoned@example.com", reference: "SUB-2210" },
      { amount: 89, outcome: "processing", daysAgo: 0, clientEmail: "pending@example.com", reference: "ORDER-1091" },
    ];

    for (const spec of specs) {
      await seedPayment(merchant.id, spec.reference?.startsWith("SUB") ? secondLink.id : paymentLink.id, 5, spec);
    }
  }

  await prisma.notification.createMany({
    data: [
      { merchantId: merchant.id, title: "Business approved", body: "Your business verification was approved.", type: "success" },
      { merchantId: merchant.id, title: "Payment received", body: "You received a payment of $89.00.", type: "success" },
      { merchantId: merchant.id, title: "Payout completed", body: "A scheduled payout was completed.", type: "success" },
    ],
    skipDuplicates: true,
  });

  console.log({ admin: admin.email, owner: owner.email, merchant: merchant.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
