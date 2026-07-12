import { prisma } from "@/lib/prisma";

export async function getInvoice(invoiceId: string, merchantId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, merchantId },
    include: { customer: true },
  });
  if (!invoice) return null;
  return { ...invoice, amount: invoice.amount.toString() };
}
