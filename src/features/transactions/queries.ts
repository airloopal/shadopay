import { prisma } from "@/lib/prisma";
import type { TransactionStatus } from "@prisma/client";

export interface TransactionFilters {
  status?: TransactionStatus;
  query?: string; // matches id or customer email
  currency?: string;
  reference?: string;
  clientEmail?: string;
  minAmount?: number;
  maxAmount?: number;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}

export async function listTransactions(merchantId: string, filters: TransactionFilters = {}) {
  const { status, query, currency, reference, clientEmail, minAmount, maxAmount, from, to, page = 1, pageSize = 20 } = filters;

  const where = {
    merchantId,
    ...(status ? { status } : {}),
    ...(currency ? { currency } : {}),
    ...(reference ? { descriptor: { contains: reference, mode: "insensitive" as const } } : {}),
    ...(clientEmail
      ? { payment: { clientEmail: { contains: clientEmail, mode: "insensitive" as const } } }
      : {}),
    ...(minAmount != null || maxAmount != null
      ? {
          amount: {
            ...(minAmount != null ? { gte: minAmount } : {}),
            ...(maxAmount != null ? { lte: maxAmount } : {}),
          },
        }
      : {}),
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
            { descriptor: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { customer: true, payment: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions: rows.map((tx) => ({
      ...tx,
      amount: tx.amount.toString(),
      fee: tx.fee?.toString() ?? null,
      netAmount: tx.netAmount?.toString() ?? null,
      clientEmail: tx.payment?.clientEmail ?? null,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Builds CSV text for the current filtered transaction set (used by the export action). */
export async function transactionsToCsv(merchantId: string, filters: TransactionFilters = {}) {
  const { transactions } = await listTransactions(merchantId, { ...filters, page: 1, pageSize: 5000 });

  const header = ["id", "amount", "fee", "net_amount", "currency", "status", "reference", "created_at"];
  const rows = transactions.map((tx) =>
    [tx.id, tx.amount, tx.fee ?? "", tx.netAmount ?? "", tx.currency, tx.status, tx.descriptor ?? "", tx.createdAt.toISOString()].join(",")
  );

  return [header.join(","), ...rows].join("\n");
}
