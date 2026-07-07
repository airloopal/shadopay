"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { savePayoutAction, type ActionState } from "@/features/onboarding/actions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { SettlementSchedule, PayoutMethod } from "@prisma/client";

const initialState: ActionState = {};

interface PayoutFormProps {
  settlementCurrency: string;
  settlementSchedule: SettlementSchedule;
  payoutMethod: PayoutMethod | null;
}

export function PayoutForm({ settlementCurrency, settlementSchedule, payoutMethod }: PayoutFormProps) {
  const [state, formAction, isPending] = useActionState(savePayoutAction, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="settlementCurrency">Settlement currency</Label>
        <select
          id="settlementCurrency"
          name="settlementCurrency"
          defaultValue={settlementCurrency}
          className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
        >
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
          <option value="GBP">GBP — British Pound</option>
        </select>
        {errors.settlementCurrency && <p className="text-xs text-danger">{errors.settlementCurrency}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="settlementSchedule">Settlement frequency</Label>
        <select
          id="settlementSchedule"
          name="settlementSchedule"
          defaultValue={["DAILY", "WEEKLY", "MONTHLY"].includes(settlementSchedule) ? settlementSchedule : "WEEKLY"}
          className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
        {errors.settlementSchedule && <p className="text-xs text-danger">{errors.settlementSchedule}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="payoutMethod">Preferred payout method</Label>
        <select
          id="payoutMethod"
          name="payoutMethod"
          defaultValue={payoutMethod ?? "BANK_TRANSFER"}
          className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
        >
          <option value="BANK_TRANSFER">Bank transfer (ACH/SEPA)</option>
          <option value="WIRE_TRANSFER">Wire transfer</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.payoutMethod && <p className="text-xs text-danger">{errors.payoutMethod}</p>}
        <p className="text-xs text-muted-foreground">
          This is stored as a preference only — bank account details and payout integrations come later.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
