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
    title: link.title,
    description: link.description,
    amount: link.amount?.toString() ?? null,
    currency: link.currency,
    status: link.status,
    merchant: {
      displayName: link.merchant.displayName,
      primaryColor: link.merchant.branding?.primaryColor ?? "#D4AF37",
      supportEmail: link.merchant.branding?.supportEmail ?? null,
    },
  };
}
