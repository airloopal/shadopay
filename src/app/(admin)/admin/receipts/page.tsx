import Link from "next/link";
import { listReceipts } from "@/features/payments-engine/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminReceiptsPage() {
  const { receipts, total } = await listReceipts({ pageSize: 100 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Receipts</h1>
        <p className="text-sm text-muted-foreground">{total.toLocaleString()} receipts issued across all merchants</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issued</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No receipts issued yet.
              </TableCell>
            </TableRow>
          )}
          {receipts.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                <Link href={`/receipts/${r.receiptNumber}`} className="hover:text-accent hover:underline">
                  {r.receiptNumber}
                </Link>
              </TableCell>
              <TableCell>{r.merchant.displayName}</TableCell>
              <TableCell className="text-muted-foreground">{r.clientEmail ?? "—"}</TableCell>
              <TableCell className="font-medium">{formatCurrency(r.amount, r.currency)}</TableCell>
              <TableCell>
                <Badge variant={r.status === "refunded" ? "warning" : "success"}>{r.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(r.issuedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
