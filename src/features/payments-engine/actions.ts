"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { transitionPayment, recordPaymentEvent } from "@/features/payments-engine/engine";
import { getPaymentProvider, isPaymentProviderConfigured, getPaymentEnvironment } from "@/features/payment-provider";
import type { PaymentStatus } from "@prisma/client";

export interface StartProviderCheckoutResult {
  redirectUrl?: string;
  error?: string;
}

/**
 * Called when the customer clicks "Continue to secure payment" on hosted
 * checkout. Creates a real Stripe Checkout Session for the payment and
 * returns the URL to redirect the browser to. The actual status transition
 * (PENDING -> PROCESSING -> SUCCEEDED/FAILED) happens later, driven by the
 * Stripe webhook — never assumed client-side.
 */
export async function startProviderCheckoutAction(
  paymentId: string,
  customerAmount?: number,
  clientEmail?: string
): Promise<StartProviderCheckoutResult> {
  if (!isPaymentProviderConfigured()) {
    return { error: "Payment provider is not configured yet. Please contact the merchant." };
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { merchant: true, paymentLink: true },
  });
  if (!payment) return { error: "Payment not found." };

  // Live mode requires the merchant to be approved before payment links work.
  const environment = getPaymentEnvironment();
  if (environment === "live" && payment.merchant.status !== "APPROVED") {
    return { error: "This business is not yet approved to accept live payments." };
  }

  if (customerAmount != null || clientEmail) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...(customerAmount != null ? { amount: customerAmount } : {}),
        ...(clientEmail ? { clientEmail } : {}),
      },
    });
  }

  const finalAmount = customerAmount ?? Number(payment.amount);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const slug = payment.paymentLink?.slug ?? "";

  try {
    const session = await getPaymentProvider().createCheckoutSession({
      paymentId: payment.id,
      amount: finalAmount,
      currency: payment.currency,
      title: payment.paymentLink?.title ?? "Payment",
      description: payment.description,
      clientEmail: clientEmail ?? payment.clientEmail,
      successUrl: `${appUrl}/pay/${slug}/return?payment=${payment.id}&result=success`,
      cancelUrl: `${appUrl}/pay/${slug}/return?payment=${payment.id}&result=cancel`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerName: getPaymentProvider().name,
        providerSessionId: session.providerSessionId,
        environment,
      },
    });
    await recordPaymentEvent(payment.id, "submitted", "Redirected to secure payment provider");

    return { redirectUrl: session.redirectUrl };
  } catch (error) {
    console.error("Failed to create provider checkout session:", error);
    return { error: "We couldn't start the secure payment. Please try again." };
  }
}

/** Called when the customer cancels out of checkout before reaching the provider. */
export async function cancelPaymentAction(paymentId: string) {
  await transitionPayment(paymentId, "CANCELLED");
}

/**
 * Admin-only manual status override, for sandbox/testing so every lifecycle
 * state (failed, expired, refunded, ...) can be exercised without waiting
 * for a real payment rail. Never exposed to merchants or customers.
 *
 * For REFUNDED specifically: if the payment has a real provider payment id,
 * this calls the provider's actual refund API first — it does not just
 * fake the reversal internally.
 */
export async function adminUpdatePaymentStatusAction(formData: FormData) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  const paymentId = String(formData.get("paymentId") ?? "");
  const nextStatus = String(formData.get("status") ?? "") as PaymentStatus;
  const reason = String(formData.get("reason") ?? "").trim() || undefined;

  if (!paymentId || !nextStatus) {
    throw new Error("Missing payment or target status.");
  }

  if (nextStatus === "REFUNDED") {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (payment?.providerPaymentId && isPaymentProviderConfigured()) {
      const refund = await getPaymentProvider().refundPayment(payment.providerPaymentId, Number(payment.amount));
      if (!refund.success) {
        throw new Error(refund.failureReason ?? "Refund failed at the payment provider.");
      }
    }
  }

  await transitionPayment(paymentId, nextStatus, { reason, actorId: session.user.id });
  revalidatePath(`/admin/payments/${paymentId}`);
  revalidatePath("/admin/payments");
}

/** Admin-only: mark a payment as manually reviewed (does not change its status). */
export async function markPaymentReviewedAction(formData: FormData) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  const paymentId = String(formData.get("paymentId") ?? "");
  if (!paymentId) throw new Error("Missing payment id.");

  await prisma.payment.update({
    where: { id: paymentId },
    data: { reviewedAt: new Date(), reviewedBy: session.user.id },
  });
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "payment.reviewed",
      targetType: "Payment",
      targetId: paymentId,
    },
  });
  revalidatePath(`/admin/payments/${paymentId}`);
}
