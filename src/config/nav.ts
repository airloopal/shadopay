import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Link2,
  Users,
  Wallet,
  Code2,
  ShieldCheck,
  Settings,
  LifeBuoy,
  BookOpenText,
  Receipt,
} from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Primary merchant-facing navigation. Labels reflect ShadoPay's premium
 * product language (Phase 1.1); hrefs are unchanged from the original
 * scaffold so no routes break.
 */
export const merchantNav: NavLink[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Payment Links", href: "/payment-links", icon: Link2 },
  { label: "Receipts", href: "/receipts", icon: Receipt },
  { label: "Clients", href: "/customers", icon: Users },
  { label: "Payouts", href: "/settlements", icon: Wallet },
  { label: "Developers", href: "/developers", icon: Code2 },
  { label: "Trust Centre", href: "/compliance", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: LifeBuoy },
];

export const adminNav: NavLink[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Businesses", href: "/admin/merchants", icon: Users },
  { label: "Verification Queue", href: "/admin/kyb", icon: ShieldCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Receipts", href: "/admin/receipts", icon: Receipt },
  { label: "Flagged Transactions", href: "/admin/flagged", icon: ArrowLeftRight },
  { label: "Ledger", href: "/admin/ledger", icon: BookOpenText },
  { label: "Payouts", href: "/admin/settlements", icon: Wallet },
  { label: "Audit Log", href: "/admin/audit-log", icon: Code2 },
];
