import { getFlaggedTransactions } from "@/features/admin/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminFlaggedTransactionsPage() {
  const transactions = await getFlaggedTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Flagged transactions</h1>
        <p className="text-sm text-muted-foreground">
          Transactions surfaced by monitoring rules for manual review.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Risk score</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No flagged transactions right now.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{tx.id.slice(0, 14)}</TableCell>
              <TableCell>{tx.merchant.displayName}</TableCell>
              <TableCell className="font-medium">{formatCurrency(tx.amount, tx.currency)}</TableCell>
              <TableCell>{tx.riskScore ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{tx.flagReason ?? "—"}</TableCell>
              <TableCell><StatusBadge status={tx.status} /></TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(tx.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
