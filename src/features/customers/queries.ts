import { prisma } from "@/lib/prisma";

export async function listCustomers(merchantId: string, search?: string) {
  const rows = await prisma.customer.findMany({
    where: {
      merchantId,
      ...(search
        ? { OR: [{ email: { contains: search, mode: "insensitive" } }, { name: { contains: search, mode: "insensitive" } }] }
        : {}),
    },
    include: {
      _count: { select: { transactions: true } },
      transactions: {
        where: { status: { in: ["CAPTURED", "SETTLED"] } },
        select: { amount: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return rows.map((c) => ({
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    createdAt: c.createdAt,
    transactionCount: c._count.transactions,
    lifetimeValue: c.transactions.reduce((sum, t) => sum + Number(t.amount), 0),
  }));
}
