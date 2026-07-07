import { Badge } from "@/components/ui/badge";
import type { KybStatus } from "@prisma/client";

const map: Record<KybStatus | "NOT_STARTED", { label: string; variant: "default" | "success" | "warning" | "danger" | "accent" }> = {
  NOT_STARTED: { label: "Not started", variant: "default" },
  PENDING: { label: "Submitted", variant: "warning" },
  IN_REVIEW: { label: "Under review", variant: "warning" },
  ADDITIONAL_INFO_REQUIRED: { label: "Additional info needed", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
};

export function VerificationStatusPill({ status }: { status: KybStatus | null }) {
  const entry = map[status ?? "NOT_STARTED"];
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
