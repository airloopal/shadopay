import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists safely (handles conflicting utility classes). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Decimal/number as currency, defaulting to the merchant's settlement currency. */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "USD"
): string {
  if (amount == null) return formatCurrency(0, currency);
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, { hour: "numeric", minute: "2-digit" });
}

/** Truncates an id/key for display, e.g. "pk_live_8f2a...c91d". */
export function truncateMiddle(value: string, headLen = 8, tailLen = 4): string {
  if (value.length <= headLen + tailLen) return value;
  return `${value.slice(0, headLen)}…${value.slice(-tailLen)}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
