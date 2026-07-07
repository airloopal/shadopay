import { prisma } from "@/lib/prisma";

export async function listSettlements(merchantId: string) {
  const rows = await prisma.settlement.findMany({
    where: { merchantId },
    orderBy: { periodStart: "desc" },
    take: 50,
  });
  return rows.map((s) => ({
    ...s,
    grossAmount: s.grossAmount.toString(),
    feeAmount: s.feeAmount.toString(),
    reserveAmount: s.reserveAmount.toString(),
    netAmount: s.netAmount.toString(),
  }));
}

export async function getSettlementSummary(merchantId: string) {
  const [upcoming, lastPaid] = await Promise.all([
    prisma.settlement.aggregate({
      where: { merchantId, status: { in: ["SCHEDULED", "PROCESSING"] } },
      _sum: { netAmount: true },
    }),
    prisma.settlement.findFirst({
      where: { merchantId, status: "PAID" },
      orderBy: { paidOutAt: "desc" },
    }),
  ]);

  return {
    upcomingTotal: Number(upcoming._sum.netAmount ?? 0),
    lastPaidAmount: lastPaid ? Number(lastPaid.netAmount) : null,
    lastPaidAt: lastPaid?.paidOutAt ?? null,
  };
}
