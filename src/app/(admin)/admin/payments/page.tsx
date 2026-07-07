import Link from "next/link";
import { listPayments } from "@/features/payments-engine/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { PaymentStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    currency?: string;
    reference?: string;
    clientEmail?: string;
    minAmount?: string;
    maxAmount?: string;
    page?: string;
  }>;
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { payments, total, totalPages } = await listPayments({
    status: params.status as PaymentStatus | undefined,
    currency: params.currency || undefined,
    reference: params.reference || undefined,
    clientEmail: params.clientEmail || undefined,
    minAmount: params.minAmount ? Number(params.minAmount) : undefined,
    maxAmount: params.maxAmount ? Number(params.maxAmount) : undefined,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground">{total.toLocaleString()} payments across all merchants</p>
      </div>

      <form className="flex flex-wrap items-center gap-3" method="GET">
        <Input name="reference" placeholder="Reference" defaultValue={params.reference} className="max-w-[10rem]" />
        <Input name="clientEmail" placeholder="Client email" defaultValue={params.clientEmail} className="max-w-[12rem]" />
        <Input name="minAmount" type="number" placeholder="Min amount" defaultValue={params.minAmount} className="max-w-[8rem]" />
        <Input name="maxAmount" type="number" placeholder="Max amount" defaultValue={params.maxAmount} className="max-w-[8rem]" />
        <select
          name="currency"
          defaultValue={params.currency ?? ""}
          className="h-10 rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
        >
          <option value="">All currencies</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-10 rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="FAILED">Failed</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <Button type="submit" variant="outline">Filter</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No payments match these filters.
              </TableCell>
            </TableRow>
          )}
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                <Link href={`/admin/payments/${p.id}`} className="hover:text-accent hover:underline">
                  {p.id.slice(0, 14)}
                </Link>
              </TableCell>
              <TableCell>{p.merchant.displayName}</TableCell>
              <TableCell className="text-muted-foreground">{p.clientEmail ?? "—"}</TableCell>
              <TableCell className="font-medium">{formatCurrency(p.amount as string, p.currency)}</TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(p.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <a href={`?page=${page - 1}`}>Previous</a>
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <a href={`?page=${page + 1}`}>Next</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
