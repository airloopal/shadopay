import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyLinkButton } from "@/features/payment-links/copy-link-button";
import { formatCurrency } from "@/lib/utils";

export interface RecentPaymentLink {
  id: string;
  title: string;
  slug: string;
  amount: string | null;
  currency: string;
  status: string;
}

export function RecentPaymentLinks({ links, appUrl }: { links: RecentPaymentLink[]; appUrl: string }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent payment links</CardTitle>
        <Link href="/payment-links" className="text-xs font-medium text-accent hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {links.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">You haven&apos;t created a payment link yet.</p>
            <Link href="/payment-links" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
              Create your first link <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.02]">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{link.title}</p>
              <CopyLinkButton url={`${appUrl}/pay/${link.slug}`} />
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {link.amount ? formatCurrency(link.amount, link.currency) : "Flexible"}
              </span>
              <StatusBadge status={link.status} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
