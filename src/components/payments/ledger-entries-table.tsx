import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface LedgerEntry {
  id: string;
  type: string;
  balanceType: string;
  amount: string | null;
  currency: string;
  description: string;
  createdAt: string | Date;
}

export function LedgerEntriesTable({ entries }: { entries: LedgerEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ledger entries</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No ledger entries yet.
                </TableCell>
              </TableRow>
            )}
            {entries.map((entry) => {
              const amountNum = Number(entry.amount ?? 0);
              return (
                <TableRow key={entry.id}>
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
      </CardContent>
    </Card>
  );
}
