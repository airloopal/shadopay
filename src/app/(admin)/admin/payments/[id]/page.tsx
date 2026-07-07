import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, CheckCircle2 } from "lucide-react";
import { getPaymentDetail } from "@/features/payments-engine/queries";
import { adminUpdatePaymentStatusAction, markPaymentReviewedAction } from "@/features/payments-engine/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const NEXT_STATUS_OPTIONS: Record<string, string[]> = {
  DRAFT: ["PENDING", "CANCELLED", "EXPIRED"],
  PENDING: ["PROCESSING", "FAILED", "CANCELLED", "EXPIRED"],
  PROCESSING: ["SUCCEEDED", "FAILED", "CANCELLED"],
  SUCCEEDED: ["REFUNDED"],
  FAILED: [],
  EXPIRED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export default async function AdminPaymentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const payment = await getPaymentDetail(id);

  if (!payment) notFound();

  const nextOptions = NEXT_STATUS_OPTIONS[payment.status] ?? [];

  return (
    <div className="space-y-6">
      <Link href="/admin/payments" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All payments
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Payment detail</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{payment.id}</p>
        </div>
        <StatusBadge status={payment.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DetailRow label="Payment ID" value={<span className="font-mono text-xs">{payment.id}</span>} />
              {payment.transaction && (
                <DetailRow
                  label="Transaction ID"
                  value={<span className="font-mono text-xs">{payment.transaction.id}</span>}
                />
              )}
              <DetailRow label="Merchant" value={payment.merchant.displayName} />
              <DetailRow label="Amount" value={formatCurrency(payment.amount as string, payment.currency)} />
              <DetailRow label="Fee" value={payment.fee ? formatCurrency(payment.fee as string, payment.currency) : "—"} />
              <DetailRow label="Net amount" value={payment.netAmount ? formatCurrency(payment.netAmount as string, payment.currency) : "—"} />
              <DetailRow label="Currency" value={payment.currency} />
              <DetailRow label="Reference" value={payment.reference ?? "—"} />
              <DetailRow label="Client email" value={payment.clientEmail ?? "Not provided"} />
              <DetailRow label="Client name" value={payment.clientName ?? "Not provided"} />
              <DetailRow
                label="Risk score"
                value={
                  payment.riskScore != null ? (
                    <Badge variant={payment.riskScore > 70 ? "danger" : payment.riskScore > 40 ? "warning" : "success"}>
                      {payment.riskScore}
                    </Badge>
                  ) : (
                    "Not scored"
                  )
                }
              />
              {payment.failureReason && <DetailRow label="Failure reason" value={payment.failureReason} />}
              <DetailRow label="Created" value={formatDateTime(payment.createdAt)} />
              <DetailRow
                label="Reviewed"
                value={
                  payment.reviewedAt ? (
                    <span className="flex items-center gap-1.5 text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {formatDateTime(payment.reviewedAt)}
                    </span>
                  ) : (
                    "Not reviewed"
                  )
                }
              />
            </CardContent>
          </Card>

          <LedgerEntriesTable entries={payment.ledgerEntries} />
        </div>

        <div className="space-y-6">
          {!payment.reviewedAt && (
            <Card>
              <CardContent className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-sm text-foreground">Not yet reviewed</p>
                  <p className="text-xs text-muted-foreground">Mark this payment as manually reviewed.</p>
                </div>
                <form action={markPaymentReviewedAction}>
                  <input type="hidden" name="paymentId" value={payment.id} />
                  <Button type="submit" size="sm" variant="outline">
                    Mark reviewed
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-warning/30">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <FlaskConical className="h-4 w-4 text-warning" strokeWidth={1.75} />
              <CardTitle>Manual status update (sandbox only)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {nextOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">This payment is in a terminal state.</p>
              ) : (
                <form action={adminUpdatePaymentStatusAction} className="space-y-3">
                  <input type="hidden" name="paymentId" value={payment.id} />
                  <div className="space-y-1.5">
                    <Label htmlFor="status">New status</Label>
                    <select
                      id="status"
                      name="status"
                      className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
                    >
                      {nextOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reason">Reason (optional)</Label>
                    <Input id="reason" name="reason" placeholder="Simulated for testing" />
                  </div>
                  <Button type="submit" className="w-full" variant="outline">
                    Apply status change
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This directly drives the payments engine — it updates the wallet, ledger, transaction,
                    and audit log exactly as a real status change would.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          <PaymentTimeline events={payment.events} />

          {payment.receipt && (
            <Card>
              <CardHeader>
                <CardTitle>Receipt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <DetailRow label="Number" value={<span className="font-mono text-xs">{payment.receipt.receiptNumber}</span>} />
                <DetailRow
                  label="Status"
                  value={<Badge variant={payment.receipt.status === "refunded" ? "warning" : "success"}>{payment.receipt.status}</Badge>}
                />
                <Link
                  href={`/receipts/${payment.receipt.receiptNumber}`}
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
