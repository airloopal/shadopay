"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDateTime, initials } from "@/lib/utils";
import { submitPaymentAction, cancelPaymentAction } from "@/features/payments-engine/actions";

interface CheckoutFormProps {
  paymentId: string;
  merchantName: string;
  title: string;
  description: string | null;
  reference: string | null;
  amount: string | null;
  currency: string;
  primaryColor: string;
  supportEmail: string | null;
  successUrl: string | null;
  cancelUrl: string | null;
}

type Step = "form" | "processing" | "success" | "receipt" | "cancelled";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function CheckoutFlow({
  paymentId,
  merchantName,
  title,
  description,
  reference,
  amount,
  currency,
  primaryColor,
  supportEmail,
  successUrl,
  cancelUrl,
}: CheckoutFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [customerAmount, setCustomerAmount] = useState(amount ?? "");
  const [clientEmail, setClientEmail] = useState("");
  const [result, setResult] = useState<{ receiptNumber: string | null; amount: string; paidAt: Date } | null>(null);

  const finalAmount = result?.amount ?? amount ?? customerAmount;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");

    const [response] = await Promise.all([
      submitPaymentAction(paymentId, amount ? undefined : Number(customerAmount), clientEmail || undefined),
      wait(1100),
    ]);

    setResult({ receiptNumber: response.receiptNumber, amount: response.amount, paidAt: new Date() });
    setStep("success");
  }

  async function handleCancel() {
    setStep("cancelled");
    await cancelPaymentAction(paymentId);
  }

  function handleTryAgain() {
    setCustomerAmount(amount ?? "");
    setStep("form");
    router.refresh();
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

              <form onSubmit={handlePay} className="mt-8 space-y-4">
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

                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Pay {amount ? formatCurrency(amount, currency) : ""}
                </Button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel and go back
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Secured by ShadoPay
                </p>
              </form>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
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
              <p className="text-sm text-muted-foreground">Processing payment…</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card/90 p-10 text-center shadow-glass"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckCircle2 className="h-14 w-14 text-success" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-2xl font-light text-foreground">Payment successful</h1>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(finalAmount || "0", currency)} paid to {merchantName}
              </p>
              <div className="mt-2 flex w-full flex-col gap-2">
                <Button className="w-full" onClick={() => setStep("receipt")}>
                  View receipt
                </Button>
                {successUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={successUrl}>Return to {merchantName}</a>
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {step === "receipt" && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border border-border bg-card/90 p-8 shadow-glass"
            >
              <button
                onClick={() => setStep("success")}
                className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <p className="text-xs text-muted-foreground">Receipt</p>
              <p className="mt-1 text-3xl font-light text-foreground">{formatCurrency(finalAmount || "0", currency)}</p>

              <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid to</span>
                  <span className="text-foreground">{merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description</span>
                  <span className="text-foreground">{title}</span>
                </div>
                {reference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Merchant reference</span>
                    <span className="font-mono text-xs text-foreground">{reference}</span>
                  </div>
                )}
                {result?.receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receipt number</span>
                    <span className="font-mono text-xs text-foreground">{result.receiptNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">{formatDateTime(result?.paidAt ?? new Date())}</span>
                </div>
              </div>

              {result?.receiptNumber && (
                <a
                  href={`/receipts/${result.receiptNumber}`}
                  className="mt-4 block text-center text-xs text-accent hover:underline"
                >
                  View hosted receipt page
                </a>
              )}

              {supportEmail && (
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Questions? Contact{" "}
                  <a href={`mailto:${supportEmail}`} className="text-accent hover:underline">{supportEmail}</a>
                </p>
              )}
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
              <p className="text-sm text-muted-foreground">No charge was made to your card.</p>
              <div className="mt-2 flex w-full flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={handleTryAgain}>
                  Try again
                </Button>
                {cancelUrl && (
                  <Button variant="ghost" className="w-full" asChild>
                    <a href={cancelUrl}>Return to {merchantName}</a>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
