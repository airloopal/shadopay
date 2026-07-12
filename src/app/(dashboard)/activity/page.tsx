import { requireActiveMerchant } from "@/lib/session";
import { listTransactions } from "@/features/transactions/queries";
import { getFriendlyStatus, type FriendlyStatusTone } from "@/features/dashboard/friendly-status";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const TONE_TO_BADGE_VARIANT: Record<
  FriendlyStatusTone,
  "default" | "success" | "warning" | "danger"
> = {
  success: "success",
  pending: "default",
  info: "default",
  warning: "warning",
  danger: "danger",
  muted: "default",
};

export default async function ActivityPage() {
  const { merchant } = await requireActiveMerchant();
  const { transactions, total } = await listTransactions(merchant.id, { pageSize: 30 });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-tight text-foreground">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">{total} payments</p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Nothing here yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const status = getFriendlyStatus(tx.status);
            return (
              <Link key={tx.id} href={`/transactions/${tx.id}`}>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="text-lg font-medium text-foreground">
                        {formatCurrency(tx.amount, tx.currency)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tx.clientEmail ?? tx.customer?.email ?? "Guest"} · {formatDateTime(tx.createdAt)}
                      </p>
                    </div>
                    <Badge variant={TONE_TO_BADGE_VARIANT[status.tone]}>{status.label}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
