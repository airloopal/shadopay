import type { InvoiceStatus } from "@prisma/client";
import type { FriendlyStatusTone } from "@/features/dashboard/friendly-status";

export interface FriendlyInvoiceStatus {
  label: string;
  tone: FriendlyStatusTone;
}

const MAP: Record<InvoiceStatus, FriendlyInvoiceStatus> = {
  DRAFT: { label: "Draft", tone: "muted" },
  SENT: { label: "Sent", tone: "warning" },
  PAID: { label: "Paid", tone: "success" },
  OVERDUE: { label: "Overdue", tone: "danger" },
  VOID: { label: "Cancelled", tone: "muted" },
};

/**
 * Maps the stored status to a plain word, and treats a SENT invoice whose
 * due date has passed as "Overdue" for display only — it doesn't rewrite
 * the stored status, since nothing in this pivot adds a background job to
 * do that automatically.
 */
export function getFriendlyInvoiceStatus(status: InvoiceStatus, dueDate: Date | string | null): FriendlyInvoiceStatus {
  if (status === "SENT" && dueDate && new Date(dueDate) < new Date()) {
    return MAP.OVERDUE;
  }
  return MAP[status] ?? MAP.DRAFT;
}
