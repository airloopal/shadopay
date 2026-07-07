"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

export function LiveTransactionFeed({ transactions }: { transactions: TransactionDTO[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Live transaction feed</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-success">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Live
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {transactions.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Transactions will appear here in real time once you start taking payments.
              </p>
            )}
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center justify-between rounded-md px-2 py-2.5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{formatCurrency(tx.amount, tx.currency)}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</p>
                </div>
                <StatusBadge status={tx.status} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
