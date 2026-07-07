"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { sendPayoutPendingEmail, sendPayoutCompletedEmail } from "@/lib/email";
import { formatCurrency, formatDate } from "@/lib/utils";

/** Moves a settlement from SCHEDULED to PROCESSING and emails the merchant that a payout is on its way. */
export async function markSettlementProcessingAction(formData: FormData) {
  await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  const settlementId = String(formData.get("settlementId") ?? "");
  const settlement = await prisma.settlement.update({
    where: { id: settlementId },
    data: { status: "PROCESSING" },
    include: { merchant: true },
  });

  if (settlement.merchant.contactEmail) {
    const periodLabel = `${formatDate(settlement.periodStart)} – ${formatDate(settlement.periodEnd)}`;
    await sendPayoutPendingEmail(
      settlement.merchant.contactEmail,
      formatCurrency(settlement.netAmount.toString(), settlement.currency),
      periodLabel
    );
  }

  revalidatePath("/admin/settlements");
}

/** Marks a settlement as paid and emails the merchant confirmation. */
export async function markSettlementPaidAction(formData: FormData) {
  await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  const settlementId = String(formData.get("settlementId") ?? "");
  const settlement = await prisma.settlement.update({
    where: { id: settlementId },
    data: { status: "PAID", paidOutAt: new Date() },
    include: { merchant: true },
  });

  if (settlement.merchant.contactEmail) {
    const periodLabel = `${formatDate(settlement.periodStart)} – ${formatDate(settlement.periodEnd)}`;
    await sendPayoutCompletedEmail(
      settlement.merchant.contactEmail,
      formatCurrency(settlement.netAmount.toString(), settlement.currency),
      periodLabel
    );
  }

  await prisma.auditLog.create({
    data: {
      merchantId: settlement.merchantId,
      action: "settlement.paid",
      targetType: "Settlement",
      targetId: settlement.id,
    },
  });

  revalidatePath("/admin/settlements");
}
