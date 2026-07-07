import { requireActiveMerchant } from "@/lib/session";
import { listSettlements, getSettlementSummary } from "@/features/settlements/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, CheckCircle2, CalendarClock } from "lucide-react";

export default async function SettlementsPage() {
  const { merchant } = await requireActiveMerchant();
  const [settlements, summary] = await Promise.all([
    listSettlements(merchant.id),
    getSettlementSummary(merchant.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Payouts follow your {merchant.settlementSchedule.toLowerCase()} schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Upcoming payout"
          value={formatCurrency(summary.upcomingTotal, merchant.settlementCurrency)}
          icon={Wallet}
        />
        <StatCard
          label="Last payout"
          value={summary.lastPaidAmount != null ? formatCurrency(summary.lastPaidAmount, merchant.settlementCurrency) : "—"}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Reserve held"
          value={`${merchant.reservePercentage}%`}
          icon={CalendarClock}
          tone="warning"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>Fees</TableHead>
            <TableHead>Reserve</TableHead>
            <TableHead>Net</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settlements.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No settlements have been generated yet.
              </TableCell>
            </TableRow>
          )}
          {settlements.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="text-muted-foreground">
                {formatDate(s.periodStart)} – {formatDate(s.periodEnd)}
              </TableCell>
              <TableCell>{formatCurrency(s.grossAmount, s.currency)}</TableCell>
              <TableCell className="text-danger">-{formatCurrency(s.feeAmount, s.currency)}</TableCell>
              <TableCell className="text-warning">-{formatCurrency(s.reserveAmount, s.currency)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(s.netAmount, s.currency)}</TableCell>
              <TableCell><StatusBadge status={s.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
