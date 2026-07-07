import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ProfileCompletionItem } from "@/features/onboarding/queries";
import { cn } from "@/lib/utils";

interface OnboardingProgressCardProps {
  percentage: number;
  items: ProfileCompletionItem[];
  isComplete: boolean;
}

export function OnboardingProgressCard({ percentage, items, isComplete }: OnboardingProgressCardProps) {
  if (isComplete) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Profile completion</CardTitle>
        <span className="text-sm text-foreground">{percentage}%</span>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percentage}%` }} />
        </div>

        <div className="space-y-1.5">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/[0.03]"
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full",
                    item.complete ? "bg-success text-background" : "border border-border"
                  )}
                >
                  {item.complete && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                <span className={item.complete ? "text-muted-foreground line-through" : "text-foreground"}>
                  {item.label}
                </span>
              </span>
              {!item.complete && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
