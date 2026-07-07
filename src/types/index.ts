import type {
  Merchant,
  Transaction,
  PaymentLink,
  Settlement,
  KybProfile,
  ComplianceAlert,
  UserRole,
  MerchantStatus,
  TransactionStatus,
  KybStatus,
} from "@prisma/client";

export type {
  Merchant,
  Transaction,
  PaymentLink,
  Settlement,
  KybProfile,
  ComplianceAlert,
  UserRole,
  MerchantStatus,
  TransactionStatus,
  KybStatus,
};

/** Serialized transaction shape after Decimal -> string conversion for client components. */
export type TransactionDTO = Omit<Transaction, "amount"> & { amount: string };

export type SettlementDTO = Omit<Settlement, "grossAmount" | "feeAmount" | "reserveAmount" | "netAmount"> & {
  grossAmount: string;
  feeAmount: string;
  reserveAmount: string;
  netAmount: string;
};

export interface DashboardStats {
  todaysVolume: number;
  revenueThisMonth: number;
  pendingSettlement: number;
  availablePayout: number;
  pendingPayout: number;
  successfulPayments: number;
  refundsTotal: number;
  refundRate: number; // 0-100
  settlementBalance: number;
  successRate: number; // 0-100
}

export interface RevenuePoint {
  label: string; // e.g. "Jan", "Week 1"
  amount: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name, resolved in nav-items.tsx
}

export type StatusTone = "success" | "warning" | "danger" | "info" | "muted";
