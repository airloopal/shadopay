import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import type { PaymentLinkStatus } from "@prisma/client";

export interface PaymentLinkFilters {
  query?: string;
  status?: PaymentLinkStatus;
  page?: number;
  pageSize?: number;
}

export async function listPaymentLinks(merchantId: string, filters: PaymentLinkFilters = {}) {
  const { query, status, page = 1, pageSize = 8 } = filters;

  const where = {
    merchantId,
    ...(status ? { status } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.paymentLink.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.paymentLink.count({ where }),
  ]);

  return {
    links: rows.map((l) => ({ ...l, amount: l.amount?.toString() ?? null })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export interface CreatePaymentLinkInput {
  merchantId: string;
  title: string;
  description?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  usageLimit?: number;
  expiresAt?: Date;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createPaymentLink(input: CreatePaymentLinkInput) {
  const slug = nanoid(10);
  return prisma.paymentLink.create({
    data: {
      merchantId: input.merchantId,
      title: input.title,
      description: input.description,
      reference: input.reference,
      amount: input.amount,
      currency: input.currency ?? "USD",
      usageLimit: input.usageLimit,
      expiresAt: input.expiresAt,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      slug,
    },
  });
}

export async function setPaymentLinkStatus(id: string, merchantId: string, status: "ACTIVE" | "PAUSED" | "ARCHIVED") {
  return prisma.paymentLink.update({
    where: { id, merchantId },
    data: { status },
  });
}
