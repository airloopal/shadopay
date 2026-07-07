import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardValue, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  tone?: "default" | "success" | "danger" | "warning";
  /** When provided (with `format`), the value animates on mount/update instead of rendering `value` statically. */
  numericValue?: number;
  format?: (n: number) => string;
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-accent bg-accent-muted",
  success: "text-success bg-success-muted",
  danger: "text-danger bg-danger-muted",
  warning: "text-warning bg-warning-muted",
};

export function StatCard({ label, value, icon: Icon, trend, tone = "default", numericValue, format }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle>{label}</CardTitle>
        <div className={cn("rounded-sm p-1.5", toneClasses[tone])}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardValue>
          {numericValue != null ? <AnimatedCounter value={numericValue} format={format} /> : value}
        </CardValue>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              trend.direction === "up" ? "text-success" : "text-danger"
            )}
          >
            {trend.direction === "up" ? "▲" : "▼"} {trend.value} vs last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
