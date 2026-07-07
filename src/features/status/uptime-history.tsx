import type { ServiceHistoryDay } from "@/features/status/data";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  operational: "bg-success/70",
  degraded: "bg-warning/70",
  outage: "bg-danger/70",
};

export function UptimeHistory({ history }: { history: ServiceHistoryDay[] }) {
  return (
    <div className="flex items-end gap-[2px]">
      {history.map((day) => (
        <div
          key={day.date}
          title={new Date(day.date).toLocaleDateString()}
          className={cn("h-6 w-[3px] rounded-full sm:w-1", statusColor[day.status])}
        />
      ))}
    </div>
  );
}
