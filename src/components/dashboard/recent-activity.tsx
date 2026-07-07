import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Activity } from "lucide-react";

function humanizeAction(action: string) {
  return action
    .split(".")
    .join(" ")
    .split("_")
    .join(" ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

interface ActivityItem {
  id: string;
  action: string;
  targetType: string;
  createdAt: Date;
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.02]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-muted-foreground">
              <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{humanizeAction(item.action)}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
