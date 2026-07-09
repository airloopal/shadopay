import { requireActiveMerchant } from "@/lib/session";
import { listPaymentLinks } from "@/features/payment-links/queries";
import { togglePaymentLinkAction } from "@/features/payment-links/actions";
import { CreatePaymentLinkForm } from "@/features/payment-links/create-link-form";
import { CopyLinkButton } from "@/features/payment-links/copy-link-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGINATION_LINK_CLASS =
  "inline-flex h-8 items-center justify-center rounded-sm border border-border px-3 text-xs text-foreground";
const PAGINATION_LINK_DISABLED_CLASS = "pointer-events-none opacity-50";

export default async function PaymentLinksPage({ searchParams }: PageProps) {
  const { merchant } = await requireActiveMerchant();
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const result = await listPaymentLinks(merchant.id, { page });
  const links = result.links;
  const total = result.total;
  const totalPages = result.totalPages;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://pay.shadopay.dev";
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;
  const prevHref = "?page=" + (page - 1);
  const nextHref = "?page=" + (page + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Payment links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} shareable checkout links
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create payment link</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CreatePaymentLinkForm defaultCurrency={merchant.settlementCurrency} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your links</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No payment links yet.
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => {
                  const nextStatus = link.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
                  const toggleAction = togglePaymentLinkAction.bind(null, link.id, nextStatus);
                  const linkUrl = appUrl + "/pay/" + link.slug;
                  const amountLabel = link.amount
                    ? formatCurrency(link.amount, link.currency)
                    : "Customer-entered";

                  return (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="text-foreground">{link.title}</div>
                        <CopyLinkButton url={linkUrl} />
                      </TableCell>
                      <TableCell>{amountLabel}</TableCell>
                      <TableCell>
                        <StatusBadge status={link.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(link.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={toggleAction}>
                          <Button variant="outline" size="sm" type="submit">
                            {link.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              
                href={prevHref}
                className={
                  isPrevDisabled
                    ? PAGINATION_LINK_CLASS + " " + PAGINATION_LINK_DISABLED_CLASS
                    : PAGINATION_LINK_CLASS
                }
              >
                Previous
              </a>
              
                href={nextHref}
                className={
                  isNextDisabled
                    ? PAGINATION_LINK_CLASS + " " + PAGINATION_LINK_DISABLED_CLASS
                    : PAGINATION_LINK_CLASS
                }
              >
                Next
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
