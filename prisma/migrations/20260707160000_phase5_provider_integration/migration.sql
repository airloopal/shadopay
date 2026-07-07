-- Phase 5: Pilot-Ready Working Version — real payment provider integration
-- Additive only: new nullable/defaulted columns on payments, one new unique index.

ALTER TABLE "payments"
  ADD COLUMN "providerName" TEXT,
  ADD COLUMN "providerSessionId" TEXT,
  ADD COLUMN "providerPaymentId" TEXT,
  ADD COLUMN "environment" TEXT NOT NULL DEFAULT 'sandbox',
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewedBy" TEXT;

CREATE UNIQUE INDEX "payments_providerSessionId_key" ON "payments"("providerSessionId");
