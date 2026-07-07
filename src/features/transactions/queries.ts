import { prisma } from "@/lib/prisma";
import type { TransactionStatus } from "@prisma/client";

export interface TransactionFilters {
  status?: TransactionStatus;
  query?: string; // matches id or customer email
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}

export async function listTransactions(merchantId: string, filters: TransactionFilters = {}) {
  const { status, query, from, to, page = 1, pageSize = 20 } = filters;

  const where = {
    merchantId,
    ...(status ? { status } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
    ...(query
      ? {
          OR: [
            { id: { contains: query, mode: "insensitive" as const } },
            { customer: { email: { contains: query, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions: rows.map((tx) => ({ ...tx, amount: tx.amount.toString() })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Builds CSV text for the current filtered transaction set (used by the export action). */
export async function transactionsToCsv(merchantId: string, filters: TransactionFilters = {}) {
  const { transactions } = await listTransactions(merchantId, { ...filters, page: 1, pageSize: 5000 });

  const header = ["id", "amount", "currency", "status", "payment_method", "created_at"];
  const rows = transactions.map((tx) =>
    [tx.id, tx.amount, tx.currency, tx.status, tx.paymentMethod, tx.createdAt.toISOString()].join(",")
  );

  return [header.join(","), ...rows].join("\n");
}
