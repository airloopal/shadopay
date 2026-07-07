"use client";

import { ChevronsUpDown, Check, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface BusinessOption {
  id: string;
  name: string;
}

/**
 * Renders the active business plus a switcher affordance. Today a user has
 * exactly one membership (see getActiveMerchant), so this renders a single
 * option — the UI is ready for multi-business accounts without a redesign.
 */
export function BusinessSwitcher({ businesses, activeId }: { businesses: BusinessOption[]; activeId: string }) {
  const active = businesses.find((b) => b.id === activeId) ?? businesses[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-normal text-foreground transition-colors hover:border-white/20">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="max-w-[10rem] truncate">{active?.name}</span>
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Businesses</DropdownMenuLabel>
        {businesses.map((b) => (
          <DropdownMenuItem key={b.id} className="justify-between">
            {b.name}
            {b.id === activeId && <Check className="h-3.5 w-3.5 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
