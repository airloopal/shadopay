import type { TransactionStatus } from "@prisma/client";

export type FriendlyStatusTone = "success" | "pending" | "info" | "warning" | "danger" | "muted";

export interface FriendlyStatus {
  label: string;
  tone: FriendlyStatusTone;
}

/**
 * Single shared mapping from a FriendlyStatusTone to a Badge variant.
 * Every screen that renders a friendly status (Home's Recent Payments,
 * Activity, Invoices list, Invoice detail, ...) imports this instead of
 * defining its own copy, so the color mapping can never drift between
 * screens.
 */
export const TONE_TO_BADGE_VARIANT: Record<
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

const FRIENDLY_STATUS_MAP: Record<TransactionStatus, FriendlyStatus> = {
  PENDING: { label: "Pending", tone: "warning" },
  AUTHORIZED: { label: "Pending", tone: "warning" },
  CAPTURED: { label: "Received", tone: "success" },
  SETTLED: { label: "Received", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  REFUNDED: { label: "Refunded", tone: "muted" },
  PARTIALLY_REFUNDED: { label: "Refunded", tone: "warning" },
  DISPUTED: { label: "Disputed", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "muted" },
};

/** Turns a backend TransactionStatus into a plain word a sole trader would actually use. */
export function getFriendlyStatus(status: TransactionStatus): FriendlyStatus {
  return FRIENDLY_STATUS_MAP[status] ?? { label: "Pending", tone: "warning" };
}
