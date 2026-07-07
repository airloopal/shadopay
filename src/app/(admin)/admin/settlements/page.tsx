import { prisma } from "@/lib/prisma";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

async function getAllSettlements() {
  const rows = await prisma.settlement.findMany({
    include: { merchant: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map((s) => ({ ...s, netAmount: s.netAmount.toString() }));
}

export default async function AdminSettlementsPage() {
  const settlements = await getAllSettlements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Payouts</h1>
        <p className="text-sm text-muted-foreground">Platform-wide payout activity across all merchants.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Merchant</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Net amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settlements.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No settlements yet.
              </TableCell>
            </TableRow>
          )}
          {settlements.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.merchant.displayName}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(s.periodStart)} – {formatDate(s.periodEnd)}
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(s.netAmount, s.currency)}</TableCell>
              <TableCell><StatusBadge status={s.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
