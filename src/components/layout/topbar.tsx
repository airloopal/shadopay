import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";
import { BusinessSwitcher } from "@/components/layout/business-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationCentre, type NotificationItem } from "@/features/notifications/notification-centre";
import type { NavLink } from "@/config/nav";

interface TopbarProps {
  userName: string;
  userEmail: string;
  merchantName?: string;
  merchantId?: string;
  notifications?: NotificationItem[];
  mobileNavItems?: NavLink[];
  mobileNavBrand?: string;
}

export function Topbar({
  userName,
  userEmail,
  merchantName,
  merchantId,
  notifications = [],
  mobileNavItems,
  mobileNavBrand = "ShadoPay",
}: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/70 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {mobileNavItems && <MobileNav items={mobileNavItems} brand={mobileNavBrand} />}

        {merchantName && merchantId && (
          <BusinessSwitcher businesses={[{ id: merchantId, name: merchantName }]} activeId={merchantId} />
        )}

        <div className="relative hidden w-72 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <Input
            placeholder="Search transactions, clients…"
            className="border-transparent bg-white/[0.03] pl-9 focus-visible:border-border focus-visible:bg-surface-raised"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <NotificationCentre notifications={notifications} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-white/[0.06]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent-muted text-accent">{initials(userName)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-normal text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/support">Support</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/sign-out">Sign out</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
