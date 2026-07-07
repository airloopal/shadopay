-- Phase 4: Core Payments Engine
-- Adds the internal payment lifecycle/orchestration layer: Payment,
-- CheckoutSession, PaymentEvent, LedgerEntry, MerchantWallet, Receipt.
-- Additive only — existing tables gain nullable columns; no drops or renames.

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('DRAFT', 'PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('OPEN', 'COMPLETED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "LedgerEntryType" AS ENUM ('CHARGE', 'FEE', 'RESERVE_HOLD', 'RESERVE_RELEASE', 'REFUND', 'REVERSAL', 'PAYOUT', 'ADJUSTMENT');
CREATE TYPE "WalletBalanceType" AS ENUM ('AVAILABLE', 'PENDING', 'PROCESSING', 'RESERVE');

-- AlterTable: transactions — attach to the new Payment lifecycle object
ALTER TABLE "transactions"
  ADD COLUMN "paymentId" TEXT,
  ADD COLUMN "fee" DECIMAL(14,2),
  ADD COLUMN "netAmount" DECIMAL(14,2);

CREATE UNIQUE INDEX "transactions_paymentId_key" ON "transactions"("paymentId");

-- CreateTable: payments
CREATE TABLE "payments" (
  "id" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "paymentLinkId" TEXT,
  "checkoutSessionId" TEXT,
  "status" "PaymentStatus" NOT NULL DEFAULT 'DRAFT',
  "amount" DECIMAL(14,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "fee" DECIMAL(14,2),
  "netAmount" DECIMAL(14,2),
  "reference" TEXT,
  "description" TEXT,
  "clientEmail" TEXT,
  "clientName" TEXT,
  "clientIp" TEXT,
  "riskScore" INTEGER,
  "failureReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3),
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payments_checkoutSessionId_key" ON "payments"("checkoutSessionId");
CREATE INDEX "payments_merchantId_status_idx" ON "payments"("merchantId", "status");
CREATE INDEX "payments_merchantId_createdAt_idx" ON "payments"("merchantId", "createdAt");

-- CreateTable: checkout_sessions
CREATE TABLE "checkout_sessions" (
  "id" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "paymentLinkId" TEXT NOT NULL,
  "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'OPEN',
  "clientIp" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "checkout_sessions_merchantId_status_idx" ON "checkout_sessions"("merchantId", "status");

-- CreateTable: payment_events
CREATE TABLE "payment_events" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payment_events_paymentId_createdAt_idx" ON "payment_events"("paymentId", "createdAt");

-- CreateTable: ledger_entries
CREATE TABLE "ledger_entries" (
  "id" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "transactionId" TEXT,
  "type" "LedgerEntryType" NOT NULL,
  "balanceType" "WalletBalanceType" NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ledger_entries_merchantId_createdAt_idx" ON "ledger_entries"("merchantId", "createdAt");
CREATE INDEX "ledger_entries_paymentId_idx" ON "ledger_entries"("paymentId");

-- CreateTable: merchant_wallets
CREATE TABLE "merchant_wallets" (
  "id" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "availableBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "pendingBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "processingBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "reserveBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "lifetimeVolume" DECIMAL(16,2) NOT NULL DEFAULT 0,
  "lifetimeFees" DECIMAL(16,2) NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "merchant_wallets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "merchant_wallets_merchantId_key" ON "merchant_wallets"("merchantId");

-- CreateTable: receipts
CREATE TABLE "receipts" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "receiptNumber" TEXT NOT NULL,
  "clientEmail" TEXT,
  "amount" DECIMAL(14,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL DEFAULT 'issued',
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "receipts_paymentId_key" ON "receipts"("paymentId");
CREATE UNIQUE INDEX "receipts_receiptNumber_key" ON "receipts"("receiptNumber");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_paymentLinkId_fkey" FOREIGN KEY ("paymentLinkId") REFERENCES "payment_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkout_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_paymentLinkId_fkey" FOREIGN KEY ("paymentLinkId") REFERENCES "payment_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "merchant_wallets" ADD CONSTRAINT "merchant_wallets_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
