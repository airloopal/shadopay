import { FlaskConical, ShieldCheck, AlertTriangle } from "lucide-react";
import { getPaymentEnvironment, isPilotMode } from "@/features/payment-provider";

export function EnvironmentBadge() {
  if (isPilotMode()) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-muted px-2.5 py-1 text-xs text-warning">
        <FlaskConical className="h-3 w-3" /> Demo — no real money
      </span>
    );
  }

  const environment = getPaymentEnvironment();

  if (environment === "unconfigured") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger-muted px-2.5 py-1 text-xs text-danger">
        <AlertTriangle className="h-3 w-3" /> No payment provider
      </span>
    );
  }

  if (environment === "sandbox") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-muted px-2.5 py-1 text-xs text-warning">
        <FlaskConical className="h-3 w-3" /> Sandbox
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success-muted px-2.5 py-1 text-xs text-success">
      <ShieldCheck className="h-3 w-3" /> Live
    </span>
  );
}
