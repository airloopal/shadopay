"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { transitionPayment, recordPaymentEvent } from "@/features/payments-engine/engine";
import type { PaymentStatus } from "@prisma/client";

export interface SubmitPaymentResult {
  paymentId: string;
  transactionId: string | null;
  receiptNumber: string | null;
  amount: string;
  currency: string;
}

/**
 * Called when the customer clicks "Pay" on hosted checkout. Runs the full
 * PENDING -> PROCESSING -> SUCCEEDED sequence through the engine. There is
 * no real card collection or processing here — this simulates a payment
 * always succeeding so the rest of the platform (wallet, ledger, receipts,
 * dashboard) can be exercised end-to-end.
 */
export async function submitPaymentAction(
  paymentId: string,
  customerAmount?: number,
  clientEmail?: string
): Promise<SubmitPaymentResult> {
  if (customerAmount != null || clientEmail) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...(customerAmount != null ? { amount: customerAmount } : {}),
        ...(clientEmail ? { clientEmail } : {}),
      },
    });
  }

  await recordPaymentEvent(paymentId, "submitted", "Payment submitted by customer");
  await transitionPayment(paymentId, "PROCESSING");
  const succeeded = await transitionPayment(paymentId, "SUCCEEDED", { clientEmail });

  const [transaction, receipt] = await Promise.all([
    prisma.transaction.findUnique({ where: { paymentId } }),
    prisma.receipt.findUnique({ where: { paymentId } }),
  ]);

  return {
    paymentId: succeeded.id,
    transactionId: transaction?.id ?? null,
    receiptNumber: receipt?.receiptNumber ?? null,
    amount: succeeded.amount.toString(),
    currency: succeeded.currency,
  };
}

/** Called when the customer cancels out of checkout. */
export async function cancelPaymentAction(paymentId: string) {
  await transitionPayment(paymentId, "CANCELLED");
}

/**
 * Admin-only manual status override, for sandbox/testing so every lifecycle
 * state (failed, expired, refunded, ...) can be exercised without waiting
 * for a real payment rail. Never exposed to merchants or customers.
 */
export async function adminUpdatePaymentStatusAction(formData: FormData) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  const paymentId = String(formData.get("paymentId") ?? "");
  const nextStatus = String(formData.get("status") ?? "") as PaymentStatus;
  const reason = String(formData.get("reason") ?? "").trim() || undefined;

  if (!paymentId || !nextStatus) {
    throw new Error("Missing payment or target status.");
  }

  await transitionPayment(paymentId, nextStatus, { reason, actorId: session.user.id });
  revalidatePath(`/admin/payments/${paymentId}`);
  revalidatePath("/admin/payments");
}
