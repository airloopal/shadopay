"use server";

import { z } from "zod";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { requireActiveMerchant } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createPaymentLink } from "@/features/payment-links/queries";

export interface CreateInvoiceState {
  errors?: Record<string, string>;
  success?: {
    invoiceId: string;
    number: string;
    paymentUrl: string;
  };
}

const createInvoiceSchema = z.object({
  customerName: z.string().min(1, "Enter the customer's name"),
  customerEmail: z.string().email("Enter a valid email address"),
  description: z.string().min(1, "Add a short description"),
  amount: z.string().min(1, "Enter an amount"),
  dueDate: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

async function generateInvoiceNumber(merchantId: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `INV-${nanoid(6).toUpperCase()}`;
    const existing = await prisma.invoice.findUnique({
      where: { merchantId_number: { merchantId, number: candidate } },
    });
    if (!existing) return candidate;
  }
  // Extremely unlikely fallback — timestamp guarantees uniqueness.
  return `INV-${Date.now()}`;
}

/**
 * Creates a simple invoice. Reuses the exact same PaymentLink mechanism as
 * Request Payment for the actual payable link — an "invoice" here is an
 * Invoice record (for the friendly list/status view) paired with a real
 * PaymentLink (for the "pay this" link), with no schema change: the
 * PaymentLink's slug is stored inside Invoice.lineItems, which already
 * existed as a flexible Json field.
 */
export async function createInvoiceAction(
  _prev: CreateInvoiceState,
  formData: FormData
): Promise<CreateInvoiceState> {
  const { merchant } = await requireActiveMerchant();

  const parsed = createInvoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { errors };
  }

  const data = parsed.data;
  const amount = Number(data.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    return { errors: { amount: "Enter a valid amount greater than zero" } };
  }

  const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;

  const customer = await prisma.customer.upsert({
    where: { merchantId_email: { merchantId: merchant.id, email: data.customerEmail } },
    create: { merchantId: merchant.id, email: data.customerEmail, name: data.customerName },
    update: { name: data.customerName },
  });

  const number = await generateInvoiceNumber(merchant.id);

  const link = await createPaymentLink({
    merchantId: merchant.id,
    title: data.description,
    description: data.note || data.description,
    reference: `Invoice ${number}`,
    amount,
    currency: merchant.settlementCurrency,
    expiresAt: dueDate,
  });

  const invoice = await prisma.invoice.create({
    data: {
      merchantId: merchant.id,
      customerId: customer.id,
      number,
      amount,
      currency: merchant.settlementCurrency,
      status: "DRAFT",
      dueDate,
      lineItems: [
        {
          description: data.description,
          quantity: 1,
          unitAmount: amount,
          note: data.note || null,
          paymentLinkSlug: link.slug,
        },
      ],
    },
  });

  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      action: "invoice.created",
      targetType: "Invoice",
      targetId: invoice.id,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://pay.shadopay.dev";
  revalidatePath("/invoices");

  return {
    success: {
      invoiceId: invoice.id,
      number,
      paymentUrl: `${appUrl}/pay/${link.slug}`,
    },
  };
}

/** Marks an invoice as sent. Sending itself is simulated in this batch — no real email/SMS dispatch is wired up. */
export async function markInvoiceSentAction(invoiceId: string) {
  const { merchant } = await requireActiveMerchant();

  await prisma.invoice.updateMany({
    where: { id: invoiceId, merchantId: merchant.id, status: "DRAFT" },
    data: { status: "SENT" },
  });

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}
