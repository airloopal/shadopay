import { Download } from "lucide-react";
import Link from "next/link";
import { requireActiveMerchant } from "@/lib/session";
import { listTransactions } from "@/features/transactions/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { TransactionStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string; reference?: string; clientEmail?: string; page?: string }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const { merchant } = await requireActiveMerchant();
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { transactions, total, totalPages } = await listTransactions(merchant.id, {
    status: params.status as TransactionStatus | undefined,
    query: params.q,
    reference: params.reference,
    clientEmail: params.clientEmail,
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">{total.toLocaleString()} total transactions</p>
        </div>
        <form action="/api/transactions/export" method="GET">
          <Button variant="secondary" type="submit">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </form>
      </div>

      <form className="flex flex-wrap items-center gap-3" method="GET">
        <Input name="q" placeholder="Search by transaction ID or customer email" defaultValue={params.q} className="max-w-sm" />
        <Input name="reference" placeholder="Reference" defaultValue={params.reference} className="max-w-[10rem]" />
        <Input name="clientEmail" placeholder="Client email" defaultValue={params.clientEmail} className="max-w-[12rem]" />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-10 rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="AUTHORIZED">Authorized</option>
          <option value="CAPTURED">Captured</option>
          <option value="SETTLED">Settled</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="DISPUTED">Disputed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <Button type="submit" variant="outline">Filter</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Net</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No transactions match these filters.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                <Link href={`/transactions/${tx.id}`} className="hover:text-accent hover:underline">
                  {tx.id.slice(0, 14)}
                </Link>
              </TableCell>
              <TableCell>{tx.clientEmail ?? tx.customer?.email ?? "Guest"}</TableCell>
              <TableCell className="font-medium">{formatCurrency(tx.amount, tx.currency)}</TableCell>
              <TableCell className="text-muted-foreground">{tx.fee ? formatCurrency(tx.fee, tx.currency) : "—"}</TableCell>
              <TableCell className="text-muted-foreground">{tx.netAmount ? formatCurrency(tx.netAmount, tx.currency) : "—"}</TableCell>
              <TableCell>
                <StatusBadge status={tx.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(tx.createdAt)}</TableCell>
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
