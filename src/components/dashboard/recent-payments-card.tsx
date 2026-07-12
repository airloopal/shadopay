import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFriendlyStatus, TONE_TO_BADGE_VARIANT } from "@/features/dashboard/friendly-status";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

export function RecentPaymentsCard({ transactions }: { transactions: TransactionDTO[] }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-light text-foreground">Recent payments</h2>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No payments yet. Once someone pays you, it&apos;ll show up here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const status = getFriendlyStatus(tx.status);
            return (
              <Card key={tx.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0">
                    <p className="text-lg font-medium text-foreground">
                      {formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                  </div>
                  <Badge variant={TONE_TO_BADGE_VARIANT[status.tone]}>{status.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
