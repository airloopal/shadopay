import { prisma } from "@/lib/prisma";

export async function listInvoices(merchantId: string) {
  const rows = await prisma.invoice.findMany({
    where: { merchantId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map((i) => ({ ...i, amount: i.amount.toString() }));
}

export async function listRefunds(merchantId: string) {
  const rows = await prisma.refund.findMany({
    where: { transaction: { merchantId } },
    include: { transaction: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map((r) => ({
    ...r,
    amount: r.amount.toString(),
    transaction: { ...r.transaction, amount: r.transaction.amount.toString() },
  }));
}
