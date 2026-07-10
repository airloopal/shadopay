"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, XCircle, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, initials } from "@/lib/utils";
import { startProviderCheckoutAction, cancelPaymentAction } from "@/features/payments-engine/actions";
import type { PaymentEnvironment } from "@/features/payment-provider";

interface CheckoutFormProps {
  paymentId: string;
  merchantName: string;
  title: string;
  description: string | null;
  reference: string | null;
  amount: string | null;
  currency: string;
  primaryColor: string;
  environment: PaymentEnvironment;
  isPilotMode: boolean;
}

type Step = "form" | "redirecting" | "cancelled" | "error";

export function CheckoutFlow({
  paymentId,
  merchantName,
  title,
  description,
  reference,
  amount,
  currency,
  primaryColor,
  environment,
  isPilotMode,
}: CheckoutFormProps) {
  const [step, setStep] = useState<Step>("form");
  const [customerAmount, setCustomerAmount] = useState(amount ?? "");
  const [clientEmail, setClientEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setStep("redirecting");

    const result = await startProviderCheckoutAction(
      paymentId,
      amount ? undefined : Number(customerAmount),
      clientEmail || undefined
    );

    if (result.error || !result.redirectUrl) {
      setErrorMessage(result.error ?? "Something went wrong starting the payment.");
      setStep("error");
      return;
    }

    window.location.href = result.redirectUrl;
  }

  async function handleCancel() {
    setStep("cancelled");
    await cancelPaymentAction(paymentId);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border border-border bg-card/90 p-8 shadow-glass"
            >
              {isPilotMode ? (
                <div className="mb-6 flex items-center justify-center gap-1.5 rounded-full border border-warning/30 bg-warning-muted px-3 py-1 text-xs text-warning">
                  <FlaskConical className="h-3 w-3" /> Demo — no real money is involved
                </div>
              ) : (
                environment === "sandbox" && (
                  <div className="mb-6 flex items-center justify-center gap-1.5 rounded-full border border-warning/30 bg-warning-muted px-3 py-1 text-xs text-warning">
                    <FlaskConical className="h-3 w-3" /> Test mode — no real charge will be made
                  </div>
                )
              )}

              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
                >
                  {initials(merchantName)}
                </div>
                <p className="text-sm text-muted-foreground">{merchantName}</p>
                <h1 className="text-2xl font-light text-foreground">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
                {reference && <p className="font-mono text-xs text-muted-foreground">Ref: {reference}</p>}
              </div>

              <form onSubmit={handleContinue} className="mt-8 space-y-4">
                {amount ? (
                  <div className="rounded-md border border-border bg-white/[0.02] p-4 text-center">
                    <p className="text-xs text-muted-foreground">Amount due</p>
                    <p className="mt-1 text-3xl font-light text-foreground">{formatCurrency(amount, currency)}</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Enter amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={customerAmount}
                      onChange={(e) => setCustomerAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="clientEmail">Email for receipt (optional)</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {isPilotMode ? "Simulate demo payment" : "Continue to secure payment"}
                </Button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel and go back
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Secure private payment
                </p>
              </form>
            </motion.div>
          )}

          {step === "redirecting" && (
            <motion.div
              key="redirecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card/90 p-16 shadow-glass"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-8 w-8 rounded-full border-2 border-border border-t-accent"
              />
              <p className="text-sm text-muted-foreground">
                {isPilotMode ? "Simulating demo payment…" : "Redirecting to secure payment…"}
              </p>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card/90 p-10 text-center shadow-glass"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-muted text-danger">
                <XCircle className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light text-foreground">Unable to start payment</h1>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <Button variant="outline" className="w-full" onClick={() => setStep("form")}>
                Try again
              </Button>
            </motion.div>
          )}

          {step === "cancelled" && (
            <motion.div
              key="cancelled"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card/90 p-10 text-center shadow-glass"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <XCircle className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light text-foreground">Payment cancelled</h1>
              <p className="text-sm text-muted-foreground">No charge was made.</p>
              <Button variant="outline" className="w-full" onClick={() => setStep("form")}>
                Try again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
