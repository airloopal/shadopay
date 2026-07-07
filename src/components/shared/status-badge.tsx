import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "@/types";

/**
 * Maps backend enum statuses (TransactionStatus, MerchantStatus, KybStatus,
 * SettlementStatus, AlertStatus...) to a consistent visual tone so every
 * feature area reads statuses the same way.
 */
const STATUS_TONE_MAP: Record<string, StatusTone> = {
  // Transactions
  CAPTURED: "success",
  SETTLED: "success",
  SUCCEEDED: "success",
  AUTHORIZED: "accent" as StatusTone,
  PENDING: "warning",
  FAILED: "danger",
  REFUNDED: "muted",
  PARTIALLY_REFUNDED: "warning",
  DISPUTED: "danger",
  CANCELLED: "muted",
  // Merchant / KYB
  APPROVED: "success",
  IN_REVIEW: "warning",
  REJECTED: "danger",
  SUSPENDED: "danger",
  ADDITIONAL_INFO_REQUIRED: "warning",
  OFFBOARDED: "muted",
  // Settlements
  SCHEDULED: "muted",
  PROCESSING: "warning",
  PAID: "success",
  HELD: "danger",
  // Compliance alerts
  OPEN: "danger",
  ESCALATED: "danger",
  RESOLVED: "success",
  DISMISSED: "muted",
  // Payment links / invoices
  ACTIVE: "success",
  PAUSED: "warning",
  EXPIRED: "muted",
  ARCHIVED: "muted",
  DRAFT: "muted",
  SENT: "accent" as StatusTone,
  OVERDUE: "danger",
  VOID: "muted",
};

const toneToVariant: Record<StatusTone, "default" | "success" | "warning" | "danger" | "accent"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "accent",
  muted: "default",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE_MAP[status] ?? "muted";
  const label = status
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

  return <Badge variant={toneToVariant[tone]}>{label}</Badge>;
}
