import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { transitionPayment } from "@/features/payments-engine/engine";
import { AutoRefresh } from "@/features/checkout/auto-refresh";
import { formatCurrency, formatDateTime, initials } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ payment?: string; result?: string }>;
}

export default async function CheckoutReturnPage({ searchParams }: PageProps) {
  const { payment: paymentId, result } = await searchParams;
  if (!paymentId) notFound();

  let payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      merchant: { include: { branding: true } },
      paymentLink: true,
      receipt: true,
    },
  });
  if (!payment) notFound();

  // If the customer bailed out on the provider's page and the webhook
  // hasn't (and won't) tell us otherwise, reflect that immediately.
  if (result === "cancel" && (payment.status === "PENDING" || payment.status === "DRAFT")) {
    await transitionPayment(payment.id, "CANCELLED");
    payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { merchant: { include: { branding: true } }, paymentLink: true, receipt: true },
    });
    if (!payment) notFound();
  }

  const merchantName =
    payment.merchant.branding?.receiptName || payment.merchant.tradingName || payment.merchant.displayName;
  const primaryColor = payment.merchant.branding?.primaryColor ?? "#D4AF37";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card/90 p-8 text-center shadow-glass">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium"
          style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
        >
          {initials(merchantName)}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{merchantName}</p>

        {(payment.status === "PENDING" || payment.status === "PROCESSING") && (
          <>
            <AutoRefresh seconds={3} />
            <Loader2 className="mx-auto mt-4 h-10 w-10 animate-spin text-accent" strokeWidth={1.5} />
            <h1 className="mt-4 text-2xl font-light text-foreground">Confirming your payment…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This page will update automatically. You can also refresh it in a few seconds.
            </p>
          </>
        )}

        {payment.status === "SUCCEEDED" && (
          <>
            <CheckCircle2 className="mx-auto mt-4 h-12 w-12 text-success" strokeWidth={1.5} />
            <h1 className="mt-4 text-2xl font-light text-foreground">Payment successful</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatCurrency(payment.amount.toString(), payment.currency)} paid to {merchantName}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {payment.receipt && (
                <a
                  href={`/receipts/${payment.receipt.receiptNumber}`}
                  className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 bg-accent text-accent-foreground shadow-soft hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0"
                >
                  View receipt
                </a>
              )}
              {payment.paymentLink?.successUrl && (
                <a
                  href={payment.paymentLink.successUrl}
                  className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
                >
                  Return to {merchantName}
                </a>
              )}
            </div>
          </>
        )}

        {payment.status === "FAILED" && (
          <>
            <XCircle className="mx-auto mt-4 h-12 w-12 text-danger" strokeWidth={1.5} />
            <h1 className="mt-4 text-2xl font-light text-foreground">Payment failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">{payment.failureReason ?? "Your payment could not be completed."}</p>
            <a
              href={payment.paymentLink ? `/pay/${payment.paymentLink.slug}` : "/"}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
            >
              Try again
            </a>
          </>
        )}

        {payment.status === "CANCELLED" && (
          <>
            <XCircle className="mx-auto mt-4 h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
            <h1 className="mt-4 text-2xl font-light text-foreground">Payment cancelled</h1>
            <p className="mt-2 text-sm text-muted-foreground">No charge was made.</p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={payment.paymentLink ? `/pay/${payment.paymentLink.slug}` : "/"}
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
              >
                Try again
              </a>
              {payment.paymentLink?.cancelUrl && (
                <a
                  href={payment.paymentLink.cancelUrl}
                  className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 hover:bg-surface-raised text-foreground"
                >
                  Return to {merchantName}
                </a>
              )}
            </div>
          </>
        )}

        {payment.status === "REFUNDED" && (
          <>
            <RotateCcw className="mx-auto mt-4 h-12 w-12 text-warning" strokeWidth={1.5} />
            <h1 className="mt-4 text-2xl font-light text-foreground">Payment refunded</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatCurrency(payment.amount.toString(), payment.currency)} was refunded.
            </p>
          </>
        )}

        <p className="mt-8 text-xs text-muted-foreground">{formatDateTime(payment.updatedAt)}</p>
      </div>
    </div>
  );
}
