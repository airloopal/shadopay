import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireActiveMerchant } from "@/lib/session";
import { getTransactionDetail } from "@/features/payments-engine/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { PaymentTimeline } from "@/components/payments/payment-timeline";
import { LedgerEntriesTable } from "@/components/payments/ledger-entries-table";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export default async function TransactionDetailPage({ params }: PageProps) {
  const { merchant } = await requireActiveMerchant();
  const { id } = await params;
  const transaction = await getTransactionDetail(id, merchant.id);

  if (!transaction) notFound();

  return (
    <div className="space-y-6">
      <Link href="/transactions" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Transactions
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Transaction detail</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{transaction.id}</p>
        </div>
        <StatusBadge status={transaction.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DetailRow label="Transaction ID" value={<span className="font-mono text-xs">{transaction.id}</span>} />
              {transaction.paymentId && (
                <DetailRow label="Payment ID" value={<span className="font-mono text-xs">{transaction.paymentId}</span>} />
              )}
              <DetailRow label="Merchant" value={merchant.displayName} />
              <DetailRow label="Amount" value={formatCurrency(transaction.amount, transaction.currency)} />
              <DetailRow label="Fee" value={transaction.fee ? formatCurrency(transaction.fee, transaction.currency) : "—"} />
              <DetailRow label="Net amount" value={transaction.netAmount ? formatCurrency(transaction.netAmount, transaction.currency) : "—"} />
              <DetailRow label="Currency" value={transaction.currency} />
              <DetailRow label="Reference" value={transaction.descriptor ?? "—"} />
              <DetailRow
                label="Client email"
                value={transaction.payment?.clientEmail ?? transaction.customer?.email ?? "Not provided"}
              />
              <DetailRow
                label="Risk score"
                value={
                  transaction.riskScore != null ? (
                    <Badge variant={transaction.riskScore > 70 ? "danger" : transaction.riskScore > 40 ? "warning" : "success"}>
                      {transaction.riskScore}
                    </Badge>
                  ) : (
                    "Not scored"
                  )
                }
              />
              <DetailRow label="Created" value={formatDateTime(transaction.createdAt)} />
            </CardContent>
          </Card>

          {transaction.payment && (
            <LedgerEntriesTable entries={transaction.payment.ledgerEntries} />
          )}
        </div>

        <div className="space-y-6">
          {transaction.payment && <PaymentTimeline events={transaction.payment.events} />}

          {transaction.payment?.receipt && (
            <Card>
              <CardHeader>
                <CardTitle>Receipt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-sm">
                <DetailRow label="Number" value={<span className="font-mono text-xs">{transaction.payment.receipt.receiptNumber}</span>} />
                <DetailRow label="Status" value={<Badge variant={transaction.payment.receipt.status === "refunded" ? "warning" : "success"}>{transaction.payment.receipt.status}</Badge>} />
                <Link
                  href={`/receipts/${transaction.payment.receipt.receiptNumber}`}
                  className="mt-2 inline-block text-xs text-accent hover:underline"
                >
                  View hosted receipt page
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
