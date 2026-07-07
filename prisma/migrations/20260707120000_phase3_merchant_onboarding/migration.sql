-- Phase 3: Merchant Onboarding & Core Payment Platform
-- Purely additive: new nullable/defaulted columns and one new enum.
-- No existing columns, tables, or constraints are modified or dropped.

-- CreateEnum
CREATE TYPE "PayoutMethod" AS ENUM ('BANK_TRANSFER', 'WIRE_TRANSFER', 'OTHER');

-- AlterTable: merchants — business profile & onboarding progress fields
ALTER TABLE "merchants"
  ADD COLUMN "tradingName" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "addressLine1" TEXT,
  ADD COLUMN "addressLine2" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "region" TEXT,
  ADD COLUMN "postalCode" TEXT,
  ADD COLUMN "contactEmail" TEXT,
  ADD COLUMN "supportEmail" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "businessDescription" TEXT,
  ADD COLUMN "payoutMethod" "PayoutMethod",
  ADD COLUMN "onboardingStep" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);

-- AlterTable: merchant_branding — receipt name shown on hosted checkout receipts
ALTER TABLE "merchant_branding"
  ADD COLUMN "receiptName" TEXT;

ALTER TABLE "merchant_branding"
  ALTER COLUMN "primaryColor" SET DEFAULT '#D4AF37';

-- AlterTable: payment_links — reference and redirect URLs for hosted checkout
ALTER TABLE "payment_links"
  ADD COLUMN "reference" TEXT,
  ADD COLUMN "successUrl" TEXT,
  ADD COLUMN "cancelUrl" TEXT;
