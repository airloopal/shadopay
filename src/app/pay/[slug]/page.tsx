import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPaymentLinkForCheckout } from "@/features/checkout/queries";
import { CheckoutFlow } from "@/features/checkout/checkout-flow";
import { createPaymentForCheckout } from "@/features/payments-engine/engine";
import { isPaymentProviderConfigured, getPaymentEnvironment } from "@/features/payment-provider";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function NoticeCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-sm rounded-lg border border-border bg-card/90 p-8 shadow-glass">
        <h1 className="text-xl font-light text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

export default async function PayPage({ params }: PageProps) {
  const { slug } = await params;
  const link = await getPaymentLinkForCheckout(slug);

  if (!link || link.status === "ARCHIVED") {
    notFound();
  }

  const isExpired = link.expiresAt ? new Date(link.expiresAt) < new Date() : false;
  const isInactive = link.status !== "ACTIVE" || isExpired;

  if (isInactive) {
    return (
      <NoticeCard
        title="This payment link is no longer available"
        body={isExpired ? `It expired on ${new Date(link.expiresAt!).toLocaleDateString()}.` : "Contact the merchant for an updated link."}
      />
    );
  }

  const environment = getPaymentEnvironment();

  if (!isPaymentProviderConfigured()) {
    return (
      <NoticeCard
        title="Payments aren't set up yet"
        body="This merchant hasn't finished connecting a payment provider. Please check back soon."
      />
    );
  }

  if (environment === "live" && link.merchantStatus !== "APPROVED") {
    return (
      <NoticeCard
        title="This business isn't approved for live payments yet"
        body="Live payments open once the business completes verification. Please check back soon."
      />
    );
  }

  const headerList = await headers();
  const { payment } = await createPaymentForCheckout({
    merchantId: link.merchantId,
    paymentLinkId: link.id,
    amount: Number(link.amount ?? 0),
    currency: link.currency,
    reference: link.reference,
    description: link.description,
    clientIp: headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: headerList.get("user-agent"),
    expiresAt: link.expiresAt,
  });

  return (
    <CheckoutFlow
      paymentId={payment.id}
      merchantName={link.merchant.displayName}
      title={link.title}
      description={link.description}
      reference={link.reference}
      amount={link.amount}
      currency={link.currency}
      primaryColor={link.merchant.primaryColor}
      environment={environment}
    />
  );
}
