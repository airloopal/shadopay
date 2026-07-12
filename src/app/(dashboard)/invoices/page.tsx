import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { requireActiveMerchant } from "@/lib/session";
import { listInvoices } from "@/features/payments/queries";
import { getFriendlyInvoiceStatus } from "@/features/invoices/friendly-invoice-status";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { FriendlyStatusTone } from "@/features/dashboard/friendly-status";

const TONE_TO_BADGE_VARIANT: Record<FriendlyStatusTone, "default" | "success" | "warning" | "danger"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  muted: "default",
};

export default async function InvoicesPage() {
  const { merchant } = await requireActiveMerchant();
  const invoices = await listInvoices(merchant.id);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">{invoices.length} invoices</p>
        </div>
      </div>

      <Link
        href="/invoices/new"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-accent-foreground shadow-soft transition-all duration-200 hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0"
      >
        <Plus className="h-4 w-4" /> Create invoice
      </Link>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              No invoices yet. Create your first one to get paid.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {invoices.map((invoice) => {
            const status = getFriendlyInvoiceStatus(invoice.status, invoice.dueDate);
            const lineItem = Array.isArray(invoice.lineItems) ? (invoice.lineItems[0] as { description?: string }) : null;

            return (
              <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">{invoice.customer.name ?? invoice.customer.email}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {lineItem?.description ?? invoice.number}
                        </p>
                      </div>
                      <Badge variant={TONE_TO_BADGE_VARIANT[status.tone]}>{status.label}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-lg font-medium text-foreground">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.dueDate ? `Due ${formatDate(invoice.dueDate)}` : `Created ${formatDate(invoice.createdAt)}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
