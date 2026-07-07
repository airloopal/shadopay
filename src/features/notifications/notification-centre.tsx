"use client";

import { CheckCircle2, AlertTriangle, XCircle, Info, Bell, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import { markAllNotificationsReadAction } from "@/features/notifications/actions";
import { useTransition } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  readAt: Date | null;
  createdAt: Date;
}

const toneIcon: Record<string, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  danger: { icon: XCircle, className: "text-danger" },
  info: { icon: Info, className: "text-accent" },
};

export function NotificationCentre({ notifications }: { notifications: NotificationItem[] }) {
  const unread = notifications.filter((n) => !n.readAt).length;
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-white/[0.06]">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-1 p-0"
      >
        <div className="flex items-center justify-between px-3 py-2.5">
          <DropdownMenuLabel className="p-0 text-sm font-normal text-foreground">Notifications</DropdownMenuLabel>
          {unread > 0 && (
            <button
              disabled={isPending}
              onClick={() => startTransition(() => markAllNotificationsReadAction())}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
          )}
          {notifications.map((n) => {
            const tone = toneIcon[n.type] ?? toneIcon.info;
            const Icon = tone.icon;
            return (
              <div
                key={n.id}
                className="flex gap-3 border-b border-border/60 px-3 py-3 last:border-0 hover:bg-white/[0.02]"
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.className}`} strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">{formatDateTime(n.createdAt)}</p>
                </div>
                {!n.readAt && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
