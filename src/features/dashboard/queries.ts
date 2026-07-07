import { prisma } from "@/lib/prisma";
import type { DashboardStats, RevenuePoint, TransactionDTO } from "@/types";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export async function getDashboardStats(merchantId: string): Promise<DashboardStats> {
  const todayStart = startOfToday();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [
    todaysAgg,
    monthAgg,
    availablePayoutAgg,
    pendingPayoutAgg,
    capturedCount,
    totalCount,
    capturedAmountAgg,
    refundsAgg,
    settlementsBalanceAgg,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { merchantId, createdAt: { gte: todayStart }, status: { in: ["CAPTURED", "SETTLED"] } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { merchantId, createdAt: { gte: monthStart }, status: { in: ["CAPTURED", "SETTLED"] } },
      _sum: { amount: true },
    }),
    prisma.settlement.aggregate({
      where: { merchantId, status: "SCHEDULED" },
      _sum: { netAmount: true },
    }),
    prisma.settlement.aggregate({
      where: { merchantId, status: "PROCESSING" },
      _sum: { netAmount: true },
    }),
    prisma.transaction.count({
      where: { merchantId, status: { in: ["CAPTURED", "SETTLED"] } },
    }),
    prisma.transaction.count({ where: { merchantId } }),
    prisma.transaction.aggregate({
      where: { merchantId, status: { in: ["CAPTURED", "SETTLED"] } },
      _sum: { amount: true },
    }),
    prisma.refund.aggregate({
      where: { transaction: { merchantId }, status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.settlement.aggregate({
      where: { merchantId, status: "PAID" },
      _sum: { netAmount: true },
    }),
  ]);

  const successRate = totalCount === 0 ? 0 : Math.round((capturedCount / totalCount) * 1000) / 10;
  const refundsTotal = Number(refundsAgg._sum.amount ?? 0);
  const capturedAmount = Number(capturedAmountAgg._sum.amount ?? 0);
  const refundRate = capturedAmount === 0 ? 0 : Math.round((refundsTotal / capturedAmount) * 1000) / 10;

  return {
    todaysVolume: Number(todaysAgg._sum.amount ?? 0),
    revenueThisMonth: Number(monthAgg._sum.amount ?? 0),
    pendingSettlement: Number(availablePayoutAgg._sum.netAmount ?? 0) + Number(pendingPayoutAgg._sum.netAmount ?? 0),
    availablePayout: Number(availablePayoutAgg._sum.netAmount ?? 0),
    pendingPayout: Number(pendingPayoutAgg._sum.netAmount ?? 0),
    successfulPayments: capturedCount,
    refundsTotal,
    refundRate,
    settlementBalance: Number(settlementsBalanceAgg._sum.netAmount ?? 0),
    successRate,
  };
}

export async function getRecentTransactions(merchantId: string, limit = 8): Promise<TransactionDTO[]> {
  const rows = await prisma.transaction.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((tx) => ({ ...tx, amount: tx.amount.toString() }));
}

/** Builds a 6-month revenue series for the dashboard chart from captured/settled transactions. */
export async function getMonthlyRevenueSeries(merchantId: string): Promise<RevenuePoint[]> {
  const now = new Date();
  const months: { start: Date; end: Date; label: string }[] = [];

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({
      start,
      end,
      label: start.toLocaleString("en-US", { month: "short" }),
    });
  }

  const results = await Promise.all(
    months.map(({ start, end }) =>
      prisma.transaction.aggregate({
        where: {
          merchantId,
          status: { in: ["CAPTURED", "SETTLED"] },
          createdAt: { gte: start, lt: end },
        },
        _sum: { amount: true },
      })
    )
  );

  return months.map((m, i) => ({
    label: m.label,
    amount: Number(results[i]?._sum.amount ?? 0),
  }));
}

export async function getUnreadNotifications(merchantId: string, limit = 5) {
  return prisma.notification.findMany({
    where: { merchantId, readAt: null },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Merchant-scoped activity feed drawn from the audit log — a human-readable trail of what's happened. */
export async function getRecentActivity(merchantId: string, limit = 6) {
  return prisma.auditLog.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
