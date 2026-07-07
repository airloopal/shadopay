import { prisma } from "@/lib/prisma";

export async function getPaymentLinkForCheckout(slug: string) {
  const link = await prisma.paymentLink.findUnique({
    where: { slug },
    include: {
      merchant: {
        include: { branding: true },
      },
    },
  });

  if (!link) return null;

  return {
    id: link.id,
    merchantId: link.merchantId,
    title: link.title,
    description: link.description,
    reference: link.reference,
    amount: link.amount?.toString() ?? null,
    currency: link.currency,
    status: link.status,
    expiresAt: link.expiresAt,
    successUrl: link.successUrl,
    cancelUrl: link.cancelUrl,
    merchant: {
      displayName: link.merchant.branding?.receiptName || link.merchant.tradingName || link.merchant.displayName,
      primaryColor: link.merchant.branding?.primaryColor ?? "#D4AF37",
      supportEmail: link.merchant.branding?.supportEmail ?? link.merchant.supportEmail ?? null,
      supportUrl: link.merchant.branding?.supportUrl ?? null,
      hasLogo: Boolean(link.merchant.branding?.logoKey),
    },
  };
}
