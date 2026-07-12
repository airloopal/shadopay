export type FriendlyPaymentStatus =
  | "Received"
  | "Pending"
  | "Refunded"
  | "Failed"
  | "Cancelled"
  | "Disputed";

const FRIENDLY_STATUS_MAP: Record<string, FriendlyPaymentStatus> = {
  SUCCEEDED: "Received",
  RECEIVED: "Received",
  PAID: "Received",

  PENDING: "Pending",
  PROCESSING: "Pending",
  REQUIRES_ACTION: "Pending",

  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Refunded",

  FAILED: "Failed",
  EXPIRED: "Failed",

  CANCELLED: "Cancelled",
  CANCELED: "Cancelled",

  DISPUTED: "Disputed",
  CHARGEBACK: "Disputed",
};

export function getFriendlyStatus(
  status: string | null | undefined
): FriendlyPaymentStatus {
  if (!status) {
    return "Pending";
  }

  return FRIENDLY_STATUS_MAP[status.toUpperCase()] ?? "Pending";
}

export function getFriendlyStatusClass(
  status: string | null | undefined
): string {
  const friendlyStatus = getFriendlyStatus(status);

  switch (friendlyStatus) {
    case "Received":
      return "bg-emerald-500/10 text-emerald-400";
    case "Pending":
      return "bg-amber-500/10 text-amber-400";
    case "Refunded":
      return "bg-sky-500/10 text-sky-400";
    case "Failed":
      return "bg-red-500/10 text-red-400";
    case "Cancelled":
      return "bg-zinc-500/10 text-zinc-400";
    case "Disputed":
      return "bg-orange-500/10 text-orange-400";
    default:
      return "bg-zinc-500/10 text-zinc-400";
  }
}
