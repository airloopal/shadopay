import { Plus } from "lucide-react";
import { requireActiveMerchant } from "@/lib/session";
import { listPaymentLinks } from "@/features/payment-links/queries";
import { createPaymentLinkAction, togglePaymentLinkAction } from "@/features/payment-links/actions";
import { CopyLinkButton } from "@/features/payment-links/copy-link-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentLinkStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

export default async function PaymentLinksPage({ searchParams }: PageProps) {
  const { merchant } = await requireActiveMerchant();
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { links, total, totalPages } = await listPaymentLinks(merchant.id, {
    query: params.q,
    status: params.status as PaymentLinkStatus | undefined,
    page,
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://pay.shadopay.dev";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Payment links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total.toLocaleString()} shareable checkout links — no code required.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New payment link</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form action={createPaymentLinkAction} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="e.g. Consulting retainer" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <Input id="description" name="description" placeholder="Shown to the customer at checkout" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    defaultValue={merchant.settlementCurrency}
                    className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Leave amount blank to let the customer enter one.</p>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4" /> Create link
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <form className="flex items-center gap-3" method="GET">
              <Input name="q" placeholder="Search by title or description" defaultValue={params.q} className="max-w-xs" />
              <select
                name="status"
                defaultValue={params.status ?? ""}
                className="h-10 rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Deactivated</option>
                <option value="EXPIRED">Expired</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <Button type="submit" variant="outline">Filter</Button>
            </form>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No payment links match these filters.
                    </TableCell>
                  </TableRow>
                )}
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="text-foreground">{link.title}</div>
                      <CopyLinkButton url={`${appUrl}/pay/${link.slug}`} />
                    </TableCell>
                    <TableCell>
                      {link.amount ? formatCurrency(link.amount, link.currency) : "Customer-entered"}
                    </TableCell>
                    <TableCell>{link.usageCount}{link.usageLimit ? ` / ${link.usageLimit}` : ""}</TableCell>
                    <TableCell>
                      <StatusBadge status={link.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(link.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <form
                        action={togglePaymentLinkAction.bind(
                          null,
                          link.id,
                          link.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
                        )}
                      >
                        <Button variant="outline" size="sm" type="submit">
                          {link.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                  <a href={`?page=${page - 1}`}>Previous</a>
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                  <a href={`?page=${page + 1}`}>Next</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
