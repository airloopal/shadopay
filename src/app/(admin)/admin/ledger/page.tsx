import Link from "next/link";
import { getAllLedgerEntries } from "@/features/payments-engine/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminLedgerPage() {
  const entries = await getAllLedgerEntries(150);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Ledger</h1>
        <p className="text-sm text-muted-foreground">Most recent 150 ledger entries across all merchants</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Merchant</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No ledger entries yet.
              </TableCell>
            </TableRow>
          )}
          {entries.map((entry) => {
            const amountNum = Number(entry.amount);
            return (
              <TableRow key={entry.id}>
                <TableCell>{entry.merchant.displayName}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  <Link href={`/admin/payments/${entry.paymentId}`} className="hover:text-accent hover:underline">
                    {entry.paymentId.slice(0, 12)}
                  </Link>
                </TableCell>
                <TableCell className="text-xs">{entry.type.replaceAll("_", " ")}</TableCell>
                <TableCell>
                  <Badge variant="default">{entry.balanceType.toLowerCase()}</Badge>
                </TableCell>
                <TableCell className={amountNum < 0 ? "text-danger" : "text-success"}>
                  {amountNum < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(amountNum), entry.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(entry.createdAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
