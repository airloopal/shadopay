import Link from "next/link";
import { Link2, FileText, Wallet, KeyRound, type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

const actions: QuickAction[] = [
  { label: "Create payment link", href: "/payment-links", icon: Link2 },
  { label: "Create invoice", href: "/payments", icon: FileText },
  { label: "View payouts", href: "/settlements", icon: Wallet },
  { label: "Generate API key", href: "/developers", icon: KeyRound },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-0">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col gap-3 rounded-md border border-border bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-px hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-muted text-accent transition-transform duration-200 group-hover:scale-105">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className="text-sm text-foreground">{action.label}</span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
