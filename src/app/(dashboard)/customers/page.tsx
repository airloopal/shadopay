import { requireActiveMerchant } from "@/lib/session";
import { listCustomers } from "@/features/customers/queries";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const { merchant } = await requireActiveMerchant();
  const { q } = await searchParams;
  const customers = await listCustomers(merchant.id, q);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground">{customers.length} customers on file</p>
      </div>

      <form className="flex items-center gap-3" method="GET">
        <Input name="q" placeholder="Search by name or email" defaultValue={q} className="max-w-sm" />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Lifetime value</TableHead>
            <TableHead>Since</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                No customers match your search.
              </TableCell>
            </TableRow>
          )}
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="font-medium">{c.name ?? "Unnamed customer"}</div>
                <div className="text-xs text-muted-foreground">{c.email}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{c.phone ?? "—"}</TableCell>
              <TableCell>{c.transactionCount}</TableCell>
              <TableCell className="font-medium">{formatCurrency(c.lifetimeValue, merchant.settlementCurrency)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
