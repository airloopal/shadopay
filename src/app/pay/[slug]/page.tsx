import { notFound } from "next/navigation";
import { getPaymentLinkForCheckout } from "@/features/checkout/queries";
import { CheckoutFlow } from "@/features/checkout/checkout-flow";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PayPage({ params }: PageProps) {
  const { slug } = await params;
  const link = await getPaymentLinkForCheckout(slug);

  if (!link || link.status !== "ACTIVE") {
    notFound();
  }

  return (
    <CheckoutFlow
      merchantName={link.merchant.displayName}
      title={link.title}
      description={link.description}
      amount={link.amount}
      currency={link.currency}
    />
  );
}
