import {
  FilePlus2,
  ExternalLink,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  RotateCcw,
  Receipt as ReceiptIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: string;
  message: string;
  createdAt: string | Date;
}

const iconByType: Record<string, LucideIcon> = {
  created: FilePlus2,
  checkout_opened: ExternalLink,
  pending: Clock,
  submitted: Send,
  processing: Loader2,
  succeeded: CheckCircle2,
  failed: XCircle,
  expired: Clock,
  cancelled: Ban,
  refunded: RotateCcw,
  receipt_generated: ReceiptIcon,
};

const colorByType: Record<string, string> = {
  succeeded: "text-success bg-success-muted",
  failed: "text-danger bg-danger-muted",
  cancelled: "text-muted-foreground bg-muted",
  expired: "text-muted-foreground bg-muted",
  refunded: "text-warning bg-warning-muted",
  processing: "text-accent bg-accent-muted",
};

export function PaymentTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-0">
          {events.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No events recorded yet.</p>
          )}
          {events.map((event, i) => {
            const Icon = iconByType[event.type] ?? Clock;
            const tone = colorByType[event.type] ?? "text-muted-foreground bg-white/[0.04]";
            return (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tone}`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </div>
                  {i < events.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-5">
                  <p className="text-sm text-foreground">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(event.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
