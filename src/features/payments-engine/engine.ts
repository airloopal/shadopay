import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { calculateFee, calculateNetAmount, splitReserve } from "@/features/payments-engine/fees";
import { sendPaymentReceivedEmail, sendReceiptEmail } from "@/lib/email";
import type { Prisma, PaymentStatus, TransactionStatus } from "@prisma/client";

type Tx = Prisma.TransactionClient;

const TRANSACTION_STATUS_BY_PAYMENT_STATUS: Record<PaymentStatus, TransactionStatus> = {
  DRAFT: "PENDING",
  PENDING: "PENDING",
  PROCESSING: "AUTHORIZED",
  SUCCEEDED: "CAPTURED",
  FAILED: "FAILED",
  EXPIRED: "CANCELLED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

/** Allowed forward transitions. Anything not listed here is rejected. */
const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  DRAFT: ["PENDING", "CANCELLED", "EXPIRED"],
  PENDING: ["PROCESSING", "FAILED", "CANCELLED", "EXPIRED"],
  PROCESSING: ["SUCCEEDED", "FAILED", "CANCELLED"],
  SUCCEEDED: ["REFUNDED"],
  FAILED: [],
  EXPIRED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export async function getOrCreateWallet(tx: Tx, merchantId: string, currency = "USD") {
  const existing = await tx.merchantWallet.findUnique({ where: { merchantId } });
  if (existing) return existing;
  return tx.merchantWallet.create({ data: { merchantId, currency } });
}

async function logPaymentEvent(
  tx: Tx,
  paymentId: string,
  type: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  return tx.paymentEvent.create({
    data: { paymentId, type, message, metadata: metadata as Prisma.InputJsonValue },
  });
}

export interface CreatePaymentForCheckoutInput {
  merchantId: string;
  paymentLinkId: string;
  amount: number;
  currency: string;
  reference?: string | null;
  description?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  expiresAt?: Date | null;
}

/**
 * Every hosted checkout page load creates a fresh CheckoutSession + Payment
 * pair (DRAFT -> PENDING) with a Transaction attached from the start, so the
 * merchant's Transactions list reflects in-flight attempts, not just
 * completed ones.
 */
export async function createPaymentForCheckout(input: CreatePaymentForCheckoutInput) {
  return prisma.$transaction(async (tx) => {
    const checkoutSession = await tx.checkoutSession.create({
      data: {
        merchantId: input.merchantId,
        paymentLinkId: input.paymentLinkId,
        clientIp: input.clientIp,
        userAgent: input.userAgent,
        expiresAt: input.expiresAt,
      },
    });

    const payment = await tx.payment.create({
      data: {
        merchantId: input.merchantId,
        paymentLinkId: input.paymentLinkId,
        checkoutSessionId: checkoutSession.id,
        amount: input.amount,
        currency: input.currency,
        reference: input.reference,
        description: input.description,
        clientIp: input.clientIp,
        status: "DRAFT",
      },
    });

    await tx.transaction.create({
      data: {
        merchantId: input.merchantId,
        paymentLinkId: input.paymentLinkId,
        paymentId: payment.id,
        amount: input.amount,
        currency: input.currency,
        status: "PENDING",
        descriptor: input.reference ?? undefined,
      },
    });

    await logPaymentEvent(tx, payment.id, "created", "Payment created");
    await logPaymentEvent(tx, payment.id, "checkout_opened", "Checkout opened");

    const pending = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PENDING" },
    });
    await logPaymentEvent(tx, payment.id, "pending", "Awaiting customer payment");

    await tx.auditLog.create({
      data: {
        merchantId: input.merchantId,
        action: "payment.created",
        targetType: "Payment",
        targetId: payment.id,
      },
    });

    return { payment: pending, checkoutSession };
  });
}

export interface TransitionOptions {
  reason?: string;
  clientEmail?: string;
  clientName?: string;
  riskScore?: number;
  actorId?: string;
}

/**
 * The single entry point for moving a Payment forward. Every call updates
 * Payment.status, writes a PaymentEvent, writes an AuditLog entry, updates
 * the MerchantWallet, writes LedgerEntry rows (where money actually moves),
 * and keeps the attached Transaction's status in sync.
 */
export async function transitionPayment(paymentId: string, to: PaymentStatus, opts: TransitionOptions = {}) {
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: { merchant: true, transaction: true },
    });

    const from = payment.status;
    if (!ALLOWED_TRANSITIONS[from].includes(to)) {
      throw new Error(`Cannot move payment from ${from} to ${to}`);
    }

    const amount = Number(payment.amount);
    await getOrCreateWallet(tx, payment.merchantId, payment.currency);

    let fee: number | undefined;
    let netAmount: number | undefined;
    let eventMessage = `Payment moved from ${from} to ${to}`;

    if (to === "PROCESSING") {
      await tx.merchantWallet.update({
        where: { merchantId: payment.merchantId },
        data: { processingBalance: { increment: amount } },
      });
      await tx.ledgerEntry.create({
        data: {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          transactionId: payment.transaction?.id,
          type: "CHARGE",
          balanceType: "PROCESSING",
          amount,
          currency: payment.currency,
          description: "Funds held while payment is processed",
        },
      });
      eventMessage = "Payment is being processed";
    }

    if (to === "SUCCEEDED") {
      fee = calculateFee(amount);
      netAmount = calculateNetAmount(amount, fee);
      const { reserveAmount, pendingAmount } = splitReserve(netAmount, Number(payment.merchant.reservePercentage));

      await tx.merchantWallet.update({
        where: { merchantId: payment.merchantId },
        data: {
          processingBalance: { decrement: amount },
          pendingBalance: { increment: pendingAmount },
          reserveBalance: { increment: reserveAmount },
          lifetimeVolume: { increment: amount },
          lifetimeFees: { increment: fee },
        },
      });

      const entries: Prisma.LedgerEntryCreateManyInput[] = [
        {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          transactionId: payment.transaction?.id,
          type: "CHARGE",
          balanceType: "PROCESSING",
          amount: -amount,
          currency: payment.currency,
          description: "Processing hold released",
        },
        {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          transactionId: payment.transaction?.id,
          type: "FEE",
          balanceType: "PENDING",
          amount: -fee,
          currency: payment.currency,
          description: "Platform fee (2.9% + $0.30)",
        },
      ];
      if (reserveAmount > 0) {
        entries.push({
          merchantId: payment.merchantId,
          paymentId: payment.id,
          transactionId: payment.transaction?.id,
          type: "RESERVE_HOLD",
          balanceType: "RESERVE",
          amount: reserveAmount,
          currency: payment.currency,
          description: `Reserve held (${payment.merchant.reservePercentage}%)`,
        });
      }
      entries.push({
        merchantId: payment.merchantId,
        paymentId: payment.id,
        transactionId: payment.transaction?.id,
        type: "CHARGE",
        balanceType: "PENDING",
        amount: pendingAmount,
        currency: payment.currency,
        description: "Net proceeds credited to pending balance",
      });

      await tx.ledgerEntry.createMany({ data: entries });

      eventMessage = "Payment succeeded";
    }

    if (to === "FAILED" || to === "CANCELLED" || to === "EXPIRED") {
      if (from === "PROCESSING") {
        await tx.merchantWallet.update({
          where: { merchantId: payment.merchantId },
          data: { processingBalance: { decrement: amount } },
        });
        await tx.ledgerEntry.create({
          data: {
            merchantId: payment.merchantId,
            paymentId: payment.id,
            transactionId: payment.transaction?.id,
            type: "REVERSAL",
            balanceType: "PROCESSING",
            amount: -amount,
            currency: payment.currency,
            description: `Processing hold reversed (payment ${to.toLowerCase()})`,
          },
        });
      }
      eventMessage =
        to === "FAILED"
          ? (opts.reason ?? "Payment failed")
          : to === "CANCELLED"
            ? "Payment cancelled"
            : "Payment link expired before completion";
    }

    if (to === "REFUNDED") {
      const paymentNet = Number(payment.netAmount ?? 0);
      const { reserveAmount, pendingAmount } = splitReserve(paymentNet, Number(payment.merchant.reservePercentage));

      await tx.merchantWallet.update({
        where: { merchantId: payment.merchantId },
        data: {
          pendingBalance: { decrement: pendingAmount },
          reserveBalance: { decrement: reserveAmount },
        },
      });

      const refundEntries: Prisma.LedgerEntryCreateManyInput[] = [
        {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          transactionId: payment.transaction?.id,
          type: "REFUND",
          balanceType: "PENDING",
          amount: -pendingAmount,
          currency: payment.currency,
          description: "Refund debited from pending balance",
        },
      ];
      if (reserveAmount > 0) {
        refundEntries.push({
          merchantId: payment.merchantId,
          paymentId: payment.id,
          transactionId: payment.transaction?.id,
          type: "REFUND",
          balanceType: "RESERVE",
          amount: -reserveAmount,
          currency: payment.currency,
          description: "Refund debited from reserve balance",
        });
      }
      await tx.ledgerEntry.createMany({ data: refundEntries });
      await tx.receipt.updateMany({ where: { paymentId: payment.id }, data: { status: "refunded" } });
      eventMessage = "Payment refunded";
    }

    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: to,
        fee: fee ?? payment.fee,
        netAmount: netAmount ?? payment.netAmount,
        failureReason: to === "FAILED" ? (opts.reason ?? "Payment failed") : payment.failureReason,
        clientEmail: opts.clientEmail ?? payment.clientEmail,
        clientName: opts.clientName ?? payment.clientName,
        riskScore: opts.riskScore ?? payment.riskScore,
      },
    });

    if (payment.transaction) {
      await tx.transaction.update({
        where: { id: payment.transaction.id },
        data: {
          status: TRANSACTION_STATUS_BY_PAYMENT_STATUS[to],
          fee: fee ?? payment.fee ?? undefined,
          netAmount: netAmount ?? payment.netAmount ?? undefined,
          riskScore: opts.riskScore ?? payment.riskScore ?? undefined,
        },
      });
    }

    if (payment.checkoutSessionId && checkoutSessionShouldClose(to)) {
      await tx.checkoutSession.update({
        where: { id: payment.checkoutSessionId },
        data: {
          status: to === "SUCCEEDED" ? "COMPLETED" : to === "CANCELLED" ? "CANCELLED" : "EXPIRED",
          completedAt: new Date(),
        },
      });
    }

    await logPaymentEvent(tx, payment.id, to.toLowerCase(), eventMessage, opts.reason ? { reason: opts.reason } : undefined);

    await tx.auditLog.create({
      data: {
        actorId: opts.actorId,
        merchantId: payment.merchantId,
        action: `payment.${to.toLowerCase()}`,
        targetType: "Payment",
        targetId: payment.id,
        metadata: { from, to } as Prisma.InputJsonValue,
      },
    });

    let receiptNumber: string | null = null;
    if (to === "SUCCEEDED") {
      receiptNumber = `RCPT-${new Date().getFullYear()}-${nanoid(8).toUpperCase()}`;
      await tx.receipt.create({
        data: {
          paymentId: payment.id,
          merchantId: payment.merchantId,
          receiptNumber,
          clientEmail: updated.clientEmail,
          amount: payment.amount,
          currency: payment.currency,
        },
      });
      await logPaymentEvent(tx, payment.id, "receipt_generated", `Receipt ${receiptNumber} generated`);
    }

    return { updated, merchant: payment.merchant, receiptNumber };
  });

  // Transactional emails are external I/O — sent after the DB transaction
  // has committed, never from inside it. A failed send never blocks or
  // rolls back the payment update (see safeSend in lib/email.ts).
  if (to === "SUCCEEDED") {
    const { updated, merchant, receiptNumber } = result;
    const amountLabel = `${updated.currency} ${Number(updated.amount).toFixed(2)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (merchant.contactEmail) {
      await sendPaymentReceivedEmail(
        merchant.contactEmail,
        merchant.tradingName ?? merchant.displayName,
        amountLabel,
        updated.reference
      );
    }
    if (updated.clientEmail && receiptNumber) {
      await sendReceiptEmail(
        updated.clientEmail,
        merchant.tradingName ?? merchant.displayName,
        amountLabel,
        `${appUrl}/receipts/${receiptNumber}`
      );
    }
  }

  return result.updated;
}

function checkoutSessionShouldClose(status: PaymentStatus) {
  return status === "SUCCEEDED" || status === "CANCELLED" || status === "EXPIRED";
}

/** Standalone event log for moments that don't change status (e.g. "submitted" happens while still PENDING). */
export async function recordPaymentEvent(paymentId: string, type: string, message: string) {
  return prisma.paymentEvent.create({ data: { paymentId, type, message } });
}
