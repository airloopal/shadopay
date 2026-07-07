import { Users, ShieldCheck, ShieldAlert, DollarSign, Activity } from "lucide-react";
import { getAdminOverview } from "@/features/admin/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Platform overview</h1>
        <p className="text-sm text-muted-foreground">{overview.merchantCount} merchants on the platform</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Merchant approvals" value={String(overview.pendingMerchants)} icon={Users} tone="warning" />
        <StatCard label="KYB queue" value={String(overview.kybQueue)} icon={ShieldCheck} tone="warning" />
        <StatCard label="Flagged transactions" value={String(overview.flaggedCount)} icon={ShieldAlert} tone="danger" />
        <StatCard label="Total processed revenue" value={formatCurrency(overview.totalRevenue)} icon={DollarSign} tone="success" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Recent settlements</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Net amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overview.recentSettlements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No settlements generated yet.
                  </TableCell>
                </TableRow>
              )}
              {overview.recentSettlements.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(s.periodStart)} – {formatDate(s.periodEnd)}
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(s.netAmount, s.currency)}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>System health</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-0 sm:grid-cols-3 text-sm">
          <div className="rounded-md border border-border p-3">
            <p className="text-muted-foreground">API</p>
            <p className="font-medium text-success">Operational</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-muted-foreground">Webhooks</p>
            <p className="font-medium text-success">Operational</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-muted-foreground">Settlement engine</p>
            <p className="font-medium text-success">Operational</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
