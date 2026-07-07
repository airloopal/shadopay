import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  const [pendingMerchants, kybQueue, flaggedCount, recentSettlements, totalRevenueAgg, merchantCount] =
    await Promise.all([
      prisma.merchant.count({ where: { status: { in: ["PENDING", "IN_REVIEW"] } } }),
      prisma.kybProfile.count({ where: { status: { in: ["PENDING", "IN_REVIEW"] } } }),
      prisma.transaction.count({ where: { flagged: true } }),
      prisma.settlement.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.transaction.aggregate({
        where: { status: { in: ["CAPTURED", "SETTLED"] } },
        _sum: { amount: true },
      }),
      prisma.merchant.count(),
    ]);

  return {
    pendingMerchants,
    kybQueue,
    flaggedCount,
    recentSettlements: recentSettlements.map((s) => ({ ...s, netAmount: s.netAmount.toString() })),
    totalRevenue: Number(totalRevenueAgg._sum.amount ?? 0),
    merchantCount,
  };
}

export async function searchMerchants(query?: string) {
  const rows = await prisma.merchant.findMany({
    where: query
      ? {
          OR: [
            { displayName: { contains: query, mode: "insensitive" } },
            { legalName: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows;
}

export async function getKybQueue() {
  return prisma.kybProfile.findMany({
    where: { status: { in: ["PENDING", "IN_REVIEW", "ADDITIONAL_INFO_REQUIRED"] } },
    include: { merchant: true },
    orderBy: { submittedAt: "asc" },
  });
}

export async function getFlaggedTransactions() {
  const rows = await prisma.transaction.findMany({
    where: { flagged: true },
    include: { merchant: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map((t) => ({ ...t, amount: t.amount.toString() }));
}

export async function getAuditLog(limit = 100) {
  return prisma.auditLog.findMany({
    include: { actor: true, merchant: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function decideMerchant(merchantId: string, status: "APPROVED" | "REJECTED" | "SUSPENDED", reviewerId: string) {
  await prisma.$transaction([
    prisma.merchant.update({ where: { id: merchantId }, data: { status } }),
    prisma.auditLog.create({
      data: {
        actorId: reviewerId,
        merchantId,
        action: `merchant.${status.toLowerCase()}`,
        targetType: "Merchant",
        targetId: merchantId,
      },
    }),
  ]);
}

export async function decideKyb(
  kybProfileId: string,
  status: "APPROVED" | "REJECTED" | "ADDITIONAL_INFO_REQUIRED",
  reviewerId: string,
  rejectionReason?: string
) {
  await prisma.kybProfile.update({
    where: { id: kybProfileId },
    data: { status, reviewerId, reviewedAt: new Date(), rejectionReason },
  });
}
