import { Resend } from "resend";
import { renderEmailLayout } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "notifications@shadopay.dev";

/** Wraps every send in a try/catch so a missing/invalid RESEND_API_KEY never breaks the calling flow (payment engine, onboarding, etc). */
async function safeSend(params: Parameters<typeof resend.emails.send>[0]) {
  try {
    return await resend.emails.send(params);
  } catch (error) {
    console.error("Email send failed:", error);
    return null;
  }
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  return safeSend({
    from: FROM,
    to,
    subject: "Verify your ShadoPay account",
    html: renderEmailLayout({
      heading: "Confirm your email",
      bodyHtml: `<p>Confirm your email address to activate your ShadoPay account.</p>`,
      ctaLabel: "Verify email address",
      ctaUrl: verifyUrl,
    }),
  });
}

/** Sent right after a merchant creates their account, before onboarding is complete. */
export async function sendMerchantWelcomeEmail(to: string, merchantName: string, dashboardUrl: string) {
  return safeSend({
    from: FROM,
    to,
    subject: "Welcome to ShadoPay",
    html: renderEmailLayout({
      heading: `Welcome, ${merchantName}`,
      bodyHtml: `<p>Your ShadoPay account has been created. Next, complete onboarding to verify your business and create your first payment link.</p>`,
      ctaLabel: "Continue onboarding",
      ctaUrl: dashboardUrl,
    }),
  });
}

/** Sent when a merchant submits KYB verification documents. */
export async function sendVerificationSubmittedEmail(to: string, merchantName: string) {
  return safeSend({
    from: FROM,
    to,
    subject: "Verification submitted",
    html: renderEmailLayout({
      heading: "We've received your verification",
      bodyHtml: `<p>Hi ${merchantName},</p><p>Your business verification documents have been submitted and are under review. This usually takes one to two business days — we'll email you as soon as there's a decision.</p>`,
    }),
  });
}

export async function sendKybDecisionEmail(
  to: string,
  merchantName: string,
  decision: "APPROVED" | "REJECTED" | "ADDITIONAL_INFO_REQUIRED",
  note?: string
) {
  const subjectMap: Record<typeof decision, string> = {
    APPROVED: "Your merchant account has been approved",
    REJECTED: "Update on your merchant application",
    ADDITIONAL_INFO_REQUIRED: "Action needed on your merchant application",
  };
  const headingMap: Record<typeof decision, string> = {
    APPROVED: "You're verified",
    REJECTED: "Application update",
    ADDITIONAL_INFO_REQUIRED: "We need a bit more information",
  };

  return safeSend({
    from: FROM,
    to,
    subject: subjectMap[decision],
    html: renderEmailLayout({
      heading: headingMap[decision],
      bodyHtml: `<p>Hi ${merchantName},</p><p>${note ?? ""}</p>`,
    }),
  });
}

/** Sent to the merchant when a payment succeeds. */
export async function sendPaymentReceivedEmail(
  to: string,
  merchantName: string,
  amountLabel: string,
  reference?: string | null
) {
  return safeSend({
    from: FROM,
    to,
    subject: `Payment received: ${amountLabel}`,
    html: renderEmailLayout({
      heading: "You've been paid",
      bodyHtml: `<p>Hi ${merchantName},</p><p>You received a payment of <strong>${amountLabel}</strong>${reference ? ` (reference: ${reference})` : ""}. It's now reflected in your available balance.</p>`,
    }),
  });
}

/** Sent to the customer when a receipt is generated. */
export async function sendReceiptEmail(
  to: string,
  merchantName: string,
  amountLabel: string,
  receiptUrl: string
) {
  return safeSend({
    from: FROM,
    to,
    subject: `Your receipt from ${merchantName}`,
    html: renderEmailLayout({
      heading: "Payment receipt",
      bodyHtml: `<p>Thank you for your payment of <strong>${amountLabel}</strong> to ${merchantName}.</p>`,
      ctaLabel: "View receipt",
      ctaUrl: receiptUrl,
    }),
  });
}

export async function sendPayoutPendingEmail(to: string, amountLabel: string, periodLabel: string) {
  return safeSend({
    from: FROM,
    to,
    subject: `Payout scheduled: ${amountLabel}`,
    html: renderEmailLayout({
      heading: "Payout scheduled",
      bodyHtml: `<p>A payout of <strong>${amountLabel}</strong> for ${periodLabel} has been scheduled and is being processed.</p>`,
    }),
  });
}

export async function sendPayoutCompletedEmail(to: string, amountLabel: string, periodLabel: string) {
  return safeSend({
    from: FROM,
    to,
    subject: `Payout sent: ${amountLabel}`,
    html: renderEmailLayout({
      heading: "Payout sent",
      bodyHtml: `<p>Your payout of <strong>${amountLabel}</strong> for ${periodLabel} has been sent to your bank account.</p>`,
    }),
  });
}
