import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireActiveMerchant } from "@/lib/session";
import { getInvoice } from "@/features/invoices/queries";
import { getFriendlyInvoiceStatus } from "@/features/invoices/friendly-invoice-status";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { markInvoiceSentAction } from "@/features/invoices/actions";
import type { FriendlyStatusTone } from "@/features/dashboard/friendly-status";

const TONE_TO_BADGE_VARIANT: Record<FriendlyStatusTone, "default" | "success" | "warning" | "danger"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  muted: "default",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { merchant } = await requireActiveMerchant();
  const { id } = await params;
  const invoice = await getInvoice(id, merchant.id);

  if (!invoice) notFound();

  const status = getFriendlyInvoiceStatus(invoice.status, invoice.dueDate);
  const lineItem = Array.isArray(invoice.lineItems)
    ? (invoice.lineItems[0] as { description?: string; note?: string | null; paymentLinkSlug?: string })
    : null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://pay.shadopay.dev";
  const paymentUrl = lineItem?.paymentLinkSlug ? `${appUrl}/pay/${lineItem.paymentLinkSlug}` : null;

  const markSent = invoice.status === "DRAFT" ? markInvoiceSentAction.bind(null, invoice.id) : null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/invoices" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Invoices
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{invoice.number}</p>
              <h1 className="mt-1 text-2xl font-light text-foreground">
                {formatCurrency(invoice.amount, invoice.currency)}
              </h1>
            </div>
            <Badge variant={TONE_TO_BADGE_VARIANT[status.tone]}>{status.label}</Badge>
          </div>

          <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-foreground">{invoice.customer.name ?? invoice.customer.email}</span>
            </div>
            {lineItem?.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">For</span>
                <span className="text-foreground">{lineItem.description}</span>
              </div>
            )}
            {lineItem?.note && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Note</span>
                <span className="text-foreground">{lineItem.note}</span>
              </div>
            )}
            {invoice.dueDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due date</span>
                <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="text-foreground">{formatDate(invoice.createdAt)}</span>
            </div>
          </div>

          {paymentUrl && (
            <div className="mt-6 rounded-lg border border-border bg-white/[0.02] p-3">
              <p className="break-all font-mono text-xs text-foreground">{paymentUrl}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {paymentUrl && (
              <Link
                href={paymentUrl}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-accent-foreground shadow-soft transition-all duration-200 hover:shadow-glow-accent"
              >
                Open payment link
              </Link>
            )}
            {markSent && (
              <form action={markSent}>
                <Button type="submit" variant="outline" size="lg" className="w-full">
                  Mark as sent
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
