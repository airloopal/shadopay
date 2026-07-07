"use server";

import { revalidatePath } from "next/cache";
import { requireActiveMerchant } from "@/lib/session";
import { createPaymentLink, setPaymentLinkStatus } from "@/features/payment-links/queries";
import { prisma } from "@/lib/prisma";

export async function createPaymentLinkAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || undefined;
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const amount = amountRaw ? Number(amountRaw) : undefined;
  const currency = String(formData.get("currency") ?? merchant.settlementCurrency);

  if (!title) {
    throw new Error("A title is required to create a payment link.");
  }
  if (amountRaw && (Number.isNaN(amount) || (amount ?? 0) <= 0)) {
    throw new Error("Amount must be a positive number.");
  }

  await createPaymentLink({
    merchantId: merchant.id,
    title,
    description,
    amount,
    currency,
  });

  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      action: "payment_link.created",
      targetType: "PaymentLink",
      targetId: title,
    },
  });

  revalidatePath("/payment-links");
}

export async function togglePaymentLinkAction(id: string, nextStatus: "ACTIVE" | "PAUSED" | "ARCHIVED") {
  const { merchant } = await requireActiveMerchant();
  await setPaymentLinkStatus(id, merchant.id, nextStatus);
  revalidatePath("/payment-links");
}
