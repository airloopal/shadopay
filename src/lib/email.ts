import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "notifications@payflow.dev";

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your ShadoPay account",
    html: `<p>Confirm your email to activate your ShadoPay account.</p>
           <p><a href="${verifyUrl}">Verify email address</a></p>`,
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

  return resend.emails.send({
    from: FROM,
    to,
    subject: subjectMap[decision],
    html: `<p>Hi ${merchantName},</p><p>${note ?? ""}</p>`,
  });
}

export async function sendSettlementPaidEmail(
  to: string,
  amount: string,
  periodLabel: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Settlement paid: ${amount}`,
    html: `<p>Your settlement for ${periodLabel} of ${amount} has been sent to your bank account.</p>`,
  });
}
