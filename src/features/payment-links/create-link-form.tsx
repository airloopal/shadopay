"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createPaymentLinkAction, type PaymentLinkActionState } from "@/features/payment-links/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: PaymentLinkActionState = {};

export function CreatePaymentLinkForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [state, formAction, isPending] = useActionState(createPaymentLinkAction, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="e.g. Consulting retainer" required />
        {errors.title && <p className="text-xs text-danger">{errors.title}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" name="description" placeholder="Shown to the customer at checkout" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reference">Reference (optional)</Label>
        <Input id="reference" name="reference" placeholder="Internal order or invoice number" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" />
          {errors.amount && <p className="text-xs text-danger">{errors.amount}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            defaultValue={defaultCurrency}
            className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Leave amount blank to let the customer enter one.</p>

      <div className="space-y-1.5">
        <Label htmlFor="expiresAt">Expiry date (optional)</Label>
        <Input id="expiresAt" name="expiresAt" type="date" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="successUrl">Success URL (optional)</Label>
        <Input id="successUrl" name="successUrl" type="url" placeholder="https://example.com/thank-you" />
        {errors.successUrl && <p className="text-xs text-danger">{errors.successUrl}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cancelUrl">Cancel URL (optional)</Label>
        <Input id="cancelUrl" name="cancelUrl" type="url" placeholder="https://example.com/cart" />
        {errors.cancelUrl && <p className="text-xs text-danger">{errors.cancelUrl}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        <Plus className="h-4 w-4" /> {isPending ? "Creating…" : "Create link"}
      </Button>
    </form>
  );
}
