import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@prisma/client";

/**
 * Converts Prisma Decimal fields to strings for safe use outside the ORM
 * boundary, and returns an accurately-typed object (the listed keys become
 * `string | null`) rather than silently keeping the original Decimal type.
 */
function serializeDecimal<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> & Record<K, string | null> {
  const out = { ...obj } as Record<string, unknown>;
  for (const key of keys) {
    const value = obj[key];
    out[key as string] = value == null ? null : (value as { toString(): string }).toString();
  }
  return out as Omit<T, K> & Record<K, string | null>;
}

export interface PaymentFilters {
  merchantId?: string;
  status?: PaymentStatus;
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

export async function listPayments(filters: PaymentFilters = {}) {
  const { page = 1, pageSize = 20 } = filters;

  const where = {
    ...(filters.merchantId ? { merchantId: filters.merchantId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.currency ? { currency: filters.currency } : {}),
    ...(filters.reference ? { reference: { contains: filters.reference, mode: "insensitive" as const } } : {}),
    ...(filters.clientEmail ? { clientEmail: { contains: filters.clientEmail, mode: "insensitive" as const } } : {}),
    ...(filters.minAmount != null || filters.maxAmount != null
      ? {
          amount: {
            ...(filters.minAmount != null ? { gte: filters.minAmount } : {}),
            ...(filters.maxAmount != null ? { lte: filters.maxAmount } : {}),
          },
        }
      : {}),
    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: { merchant: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments: rows.map((p) => serializeDecimal(p, ["amount", "fee", "netAmount"])),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getPaymentDetail(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      merchant: true,
      paymentLink: true,
      transaction: true,
      events: { orderBy: { createdAt: "asc" } },
      ledgerEntries: { orderBy: { createdAt: "asc" } },
      receipt: true,
    },
  });

  if (!payment) return null;

  return {
    ...serializeDecimal(payment, ["amount", "fee", "netAmount"]),
    transaction: payment.transaction
      ? serializeDecimal(payment.transaction, ["amount", "fee", "netAmount"])
      : null,
    ledgerEntries: payment.ledgerEntries.map((e) => serializeDecimal(e, ["amount"])),
    receipt: payment.receipt ? serializeDecimal(payment.receipt, ["amount"]) : null,
  };
}

export async function getTransactionDetail(transactionId: string, merchantId?: string) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, ...(merchantId ? { merchantId } : {}) },
    include: {
      merchant: true,
      customer: true,
      payment: {
        include: {
          events: { orderBy: { createdAt: "asc" } },
          ledgerEntries: { orderBy: { createdAt: "asc" } },
          receipt: true,
        },
      },
    },
  });

  if (!transaction) return null;

  return {
    ...serializeDecimal(transaction, ["amount", "fee", "netAmount"]),
    payment: transaction.payment
      ? {
          ...serializeDecimal(transaction.payment, ["amount", "fee", "netAmount"]),
          ledgerEntries: transaction.payment.ledgerEntries.map((e) => serializeDecimal(e, ["amount"])),
          receipt: transaction.payment.receipt ? serializeDecimal(transaction.payment.receipt, ["amount"]) : null,
        }
      : null,
  };
}

export async function getWalletSummary(merchantId: string) {
  const wallet = await prisma.merchantWallet.findUnique({ where: { merchantId } });
  if (!wallet) {
    return {
      availableBalance: "0",
      pendingBalance: "0",
      processingBalance: "0",
      reserveBalance: "0",
      lifetimeVolume: "0",
      lifetimeFees: "0",
      currency: "USD",
    };
  }
  return serializeDecimal(wallet, [
    "availableBalance",
    "pendingBalance",
    "processingBalance",
    "reserveBalance",
    "lifetimeVolume",
    "lifetimeFees",
  ]);
}

export async function getReceiptByNumber(receiptNumber: string) {
  const receipt = await prisma.receipt.findUnique({
    where: { receiptNumber },
    include: {
      merchant: { include: { branding: true } },
      payment: { include: { transaction: true } },
    },
  });
  if (!receipt) return null;
  return serializeDecimal(receipt, ["amount"]);
}

export async function getAllLedgerEntries(limit = 100) {
  const rows = await prisma.ledgerEntry.findMany({
    include: { merchant: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((e) => serializeDecimal(e, ["amount"]));
}
