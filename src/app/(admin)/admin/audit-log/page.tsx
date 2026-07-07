import { getAuditLog } from "@/features/admin/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export default async function AdminAuditLogPage() {
  const logs = await getAuditLog();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Audit log</h1>
        <p className="text-sm text-muted-foreground">Platform-wide record of sensitive actions.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                No audit events recorded yet.
              </TableCell>
            </TableRow>
          )}
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-muted-foreground">{log.actor?.name ?? "System"}</TableCell>
              <TableCell className="font-mono text-xs">{log.action}</TableCell>
              <TableCell className="text-muted-foreground">{log.merchant?.displayName ?? "—"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {log.targetType} · {log.targetId.slice(0, 16)}
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
