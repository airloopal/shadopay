"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActiveMerchant } from "@/lib/session";
import { createPaymentLink, setPaymentLinkStatus } from "@/features/payment-links/queries";
import { prisma } from "@/lib/prisma";

export interface PaymentLinkActionState {
  errors?: Record<string, string>;
  success?: boolean;
}

const createLinkSchema = z.object({
  title: z.string().min(2, "Give this link a title"),
  description: z.string().optional().or(z.literal("")),
  reference: z.string().optional().or(z.literal("")),
  amount: z.string().optional().or(z.literal("")),
  currency: z.enum(["USD", "EUR", "GBP"]),
  expiresAt: z.string().optional().or(z.literal("")),
  successUrl: z.string().url("Enter a full URL, e.g. https://example.com/success").optional().or(z.literal("")),
  cancelUrl: z.string().url("Enter a full URL, e.g. https://example.com/cancel").optional().or(z.literal("")),
});

export async function createPaymentLinkAction(
  _prev: PaymentLinkActionState,
  formData: FormData
): Promise<PaymentLinkActionState> {
  const { merchant } = await requireActiveMerchant();

  const parsed = createLinkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { errors };
  }

  const data = parsed.data;
  const amount = data.amount ? Number(data.amount) : undefined;
  if (data.amount && (Number.isNaN(amount) || (amount ?? 0) <= 0)) {
    return { errors: { amount: "Amount must be a positive number" } };
  }

  await createPaymentLink({
    merchantId: merchant.id,
    title: data.title,
    description: data.description || undefined,
    reference: data.reference || undefined,
    amount,
    currency: data.currency,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    successUrl: data.successUrl || undefined,
    cancelUrl: data.cancelUrl || undefined,
  });

  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      action: "payment_link.created",
      targetType: "PaymentLink",
      targetId: data.title,
    },
  });

  revalidatePath("/payment-links");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function togglePaymentLinkAction(id: string, nextStatus: "ACTIVE" | "PAUSED" | "ARCHIVED") {
  const { merchant } = await requireActiveMerchant();
  await setPaymentLinkStatus(id, merchant.id, nextStatus);
  revalidatePath("/payment-links");
  revalidatePath("/dashboard");
}
