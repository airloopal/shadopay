import Link from "next/link";
import { ShieldCheck, ShieldAlert, ShieldQuestion, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { KybStatus } from "@prisma/client";

const statusCopy: Record<KybStatus | "NONE", { title: string; body: string; tone: "success" | "warning" | "danger" }> = {
  APPROVED: {
    title: "Business verified",
    body: "Your account is fully verified and cleared to accept live payments.",
    tone: "success",
  },
  PENDING: {
    title: "Verification submitted",
    body: "We're reviewing your business details. This usually takes 1–2 business days.",
    tone: "warning",
  },
  IN_REVIEW: {
    title: "Verification in progress",
    body: "Our trust & safety team is reviewing your documents now.",
    tone: "warning",
  },
  ADDITIONAL_INFO_REQUIRED: {
    title: "Action needed",
    body: "We need a bit more information to finish verifying your business.",
    tone: "warning",
  },
  REJECTED: {
    title: "Verification unsuccessful",
    body: "Your application wasn't approved. Visit the Trust Centre for details.",
    tone: "danger",
  },
  NONE: {
    title: "Get verified",
    body: "Submit your business details to start accepting live payments.",
    tone: "warning",
  },
};

const toneStyles = {
  success: { icon: ShieldCheck, wrap: "bg-success-muted text-success" },
  warning: { icon: ShieldQuestion, wrap: "bg-warning-muted text-warning" },
  danger: { icon: ShieldAlert, wrap: "bg-danger-muted text-danger" },
};

export function VerificationStatusCard({ status }: { status: KybStatus | null }) {
  const copy = statusCopy[status ?? "NONE"];
  const { icon: Icon, wrap } = toneStyles[copy.tone];

  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-6">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${wrap}`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">{copy.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{copy.body}</p>
          <Link
            href="/compliance"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            Visit Trust Centre <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
