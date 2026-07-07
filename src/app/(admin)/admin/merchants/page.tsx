import { searchMerchants } from "@/features/admin/queries";
import { approveMerchantAction, rejectMerchantAction, suspendMerchantAction } from "@/features/admin/actions";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminMerchantsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const merchants = await searchMerchants(q);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Businesses</h1>
        <p className="text-sm text-muted-foreground">{merchants.length} results</p>
      </div>

      <form className="flex items-center gap-3" method="GET">
        <Input name="q" placeholder="Search by name or slug" defaultValue={q} className="max-w-sm" />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Merchant</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <div className="font-medium">{m.displayName}</div>
                <div className="text-xs text-muted-foreground">{m.legalName}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{m.category}</TableCell>
              <TableCell><StatusBadge status={m.status} /></TableCell>
              <TableCell className="text-muted-foreground">{formatDate(m.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {(m.status === "PENDING" || m.status === "IN_REVIEW") && (
                    <>
                      <form action={approveMerchantAction.bind(null, m.id)}>
                        <Button size="sm" type="submit">Approve</Button>
                      </form>
                      <form action={rejectMerchantAction.bind(null, m.id)}>
                        <Button size="sm" variant="danger" type="submit">Reject</Button>
                      </form>
                    </>
                  )}
                  {m.status === "APPROVED" && (
                    <form action={suspendMerchantAction.bind(null, m.id)}>
                      <Button size="sm" variant="outline" type="submit">Suspend</Button>
                    </form>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
