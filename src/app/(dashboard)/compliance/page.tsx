import { ShieldCheck, ShieldAlert, FileText, Activity, FileCheck2 } from "lucide-react";
import { requireActiveMerchant } from "@/lib/session";
import { getComplianceOverview } from "@/features/compliance/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function TrustCentrePage() {
  const { merchant } = await requireActiveMerchant();
  const { kyb, openAlerts, recentAuditLogs } = await getComplianceOverview(merchant.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Trust Centre</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A clear view of your verification, monitoring, and account history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-muted text-accent">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <CardTitle className="text-base font-normal text-foreground">Business verification</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {kyb ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{kyb.registeredName}</p>
                  <p className="text-xs text-muted-foreground">{kyb.jurisdiction} · {kyb.businessType}</p>
                </div>
                <StatusBadge status={kyb.status} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t submitted your business verification yet. This is required before you
                can accept live payments — it usually takes just a few minutes.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success-muted text-success">
              <Activity className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <CardTitle className="text-base font-normal text-foreground">Monitoring status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-foreground">Active</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Transactions are continuously screened for unusual activity.
            </p>
          </CardContent>
        </Card>
      </div>

      {kyb && (
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <FileCheck2 className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            <CardTitle className="text-base font-normal text-foreground">Verification documents</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {kyb.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {kyb.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">{doc.fileName}</p>
                      <p className="text-xs capitalize text-muted-foreground">{doc.type.replaceAll("_", " ")}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <ShieldAlert className="h-5 w-5 text-warning" strokeWidth={1.75} />
          <CardTitle className="text-base font-normal text-foreground">Risk alerts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opened</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openAlerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No open alerts. Everything looks healthy.
                  </TableCell>
                </TableRow>
              )}
              {openAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="text-xs">{alert.type.replaceAll("_", " ")}</TableCell>
                  <TableCell>
                    <Badge variant={alert.severity === "CRITICAL" || alert.severity === "HIGH" ? "danger" : "warning"}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{alert.description}</TableCell>
                  <TableCell><StatusBadge status={alert.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(alert.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
          <CardTitle className="text-base font-normal text-foreground">Audit history</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAuditLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No audit events recorded yet.
                  </TableCell>
                </TableRow>
              )}
              {recentAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.targetType} · {log.targetId.slice(0, 16)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
