import { requireActiveMerchant } from "@/lib/session";
import { listInvoices, listRefunds } from "@/features/payments/queries";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PaymentsPage() {
  const { merchant } = await requireActiveMerchant();
  const [invoices, refunds] = await Promise.all([
    listInvoices(merchant.id),
    listRefunds(merchant.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground">Hosted checkout, invoices, and refunds in one place.</p>
      </div>

      <Tabs defaultValue="checkout">
        <TabsList>
          <TabsTrigger value="checkout">Hosted checkout</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="checkout">
          <Card>
            <CardHeader>
              <CardTitle>Hosted checkout page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
              <p>
                Every merchant gets a hosted checkout URL that renders your branding, accepts card
                and alternative payment methods, and posts back a signed webhook on completion.
              </p>
              <div className="rounded-md border border-border bg-surface-raised p-3 font-mono text-xs text-foreground">
                {process.env.NEXT_PUBLIC_APP_URL ?? "https://pay.example.com"}/checkout/{merchant.slug}
              </div>
              <p>
                Customize the look and feel from <span className="text-foreground">Settings → Branding</span>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No invoices yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                      <TableCell>{inv.customer.email}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(inv.amount, inv.currency)}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-muted-foreground">
                        {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>Refunds</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No refunds issued yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {refunds.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {r.transactionId.slice(0, 14)}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(r.amount, r.transaction.currency)}</TableCell>
                      <TableCell className="text-muted-foreground">{r.reason ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
