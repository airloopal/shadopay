export type FriendlyStatusTone =
  | "success"
  | "pending"
  | "info"
  | "danger"
  | "muted"
  | "warning";

export interface FriendlyStatus {
  label: string;
  tone: FriendlyStatusTone;
}

const FRIENDLY_STATUS_MAP: Record<string, FriendlyStatus> = {
  SUCCEEDED: {
    label: "Received",
    tone: "success",
  },
  RECEIVED: {
    label: "Received",
    tone: "success",
  },
  PAID: {
    label: "Received",
    tone: "success",
  },

  PENDING: {
    label: "Pending",
    tone: "pending",
  },
  PROCESSING: {
    label: "Pending",
    tone: "pending",
  },
  REQUIRES_ACTION: {
    label: "Pending",
    tone: "pending",
  },

  REFUNDED: {
    label: "Refunded",
    tone: "info",
  },
  PARTIALLY_REFUNDED: {
    label: "Refunded",
    tone: "info",
  },

  FAILED: {
    label: "Failed",
    tone: "danger",
  },
  EXPIRED: {
    label: "Failed",
    tone: "danger",
  },

  CANCELLED: {
    label: "Cancelled",
    tone: "muted",
  },
  CANCELED: {
    label: "Cancelled",
    tone: "muted",
  },

  DISPUTED: {
    label: "Disputed",
    tone: "warning",
  },
  CHARGEBACK: {
    label: "Disputed",
    tone: "warning",
  },
};

const DEFAULT_STATUS: FriendlyStatus = {
  label: "Pending",
  tone: "pending",
};

export function getFriendlyStatus(
  status: string | null | undefined
): FriendlyStatus {
  if (!status) {
    return DEFAULT_STATUS;
  }

  return FRIENDLY_STATUS_MAP[status.toUpperCase()] ?? DEFAULT_STATUS;
}

export function getFriendlyStatusClass(
  status: string | null | undefined
): string {
  const { tone } = getFriendlyStatus(status);

  switch (tone) {
    case "success":
      return "bg-emerald-500/10 text-emerald-400";
    case "pending":
      return "bg-amber-500/10 text-amber-400";
    case "info":
      return "bg-sky-500/10 text-sky-400";
    case "danger":
      return "bg-red-500/10 text-red-400";
    case "muted":
      return "bg-zinc-500/10 text-zinc-400";
    case "warning":
      return "bg-orange-500/10 text-orange-400";
    default:
      return "bg-zinc-500/10 text-zinc-400";
  }
}
