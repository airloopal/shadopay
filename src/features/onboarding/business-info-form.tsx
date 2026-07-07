"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { saveBusinessInfoAction, type ActionState } from "@/features/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/features/onboarding/countries";
import type { Merchant } from "@prisma/client";

const initialState: ActionState = {};

export function BusinessInfoForm({ merchant }: { merchant: Merchant }) {
  const [state, formAction, isPending] = useActionState(saveBusinessInfoAction, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Business name" name="legalName" error={errors.legalName} defaultValue={merchant.legalName === "Untitled business" ? "" : merchant.legalName} required />
        <Field label="Trading name" name="tradingName" error={errors.tradingName} defaultValue={merchant.tradingName ?? ""} required />
      </div>

      <Field label="Website" name="website" type="url" placeholder="https://example.com" error={errors.website} defaultValue={merchant.website ?? ""} />

      <div className="space-y-1.5">
        <Label htmlFor="country">Country</Label>
        <select
          id="country"
          name="country"
          defaultValue={merchant.country ?? ""}
          className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
          required
        >
          <option value="" disabled>Select a country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <p className="text-xs text-danger">{errors.country}</p>}
      </div>

      <Field label="Address line 1" name="addressLine1" error={errors.addressLine1} defaultValue={merchant.addressLine1 ?? ""} required />
      <Field label="Address line 2 (optional)" name="addressLine2" error={errors.addressLine2} defaultValue={merchant.addressLine2 ?? ""} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="City" name="city" error={errors.city} defaultValue={merchant.city ?? ""} required />
        <Field label="Region / State" name="region" error={errors.region} defaultValue={merchant.region ?? ""} required />
        <Field label="Postal code" name="postalCode" error={errors.postalCode} defaultValue={merchant.postalCode ?? ""} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Contact email" name="contactEmail" type="email" error={errors.contactEmail} defaultValue={merchant.contactEmail ?? ""} required />
        <Field label="Support email" name="supportEmail" type="email" error={errors.supportEmail} defaultValue={merchant.supportEmail ?? ""} required />
      </div>

      <Field label="Phone" name="phone" type="tel" error={errors.phone} defaultValue={merchant.phone ?? ""} required />

      <div className="space-y-1.5">
        <Label htmlFor="businessDescription">Business description</Label>
        <textarea
          id="businessDescription"
          name="businessDescription"
          rows={4}
          defaultValue={merchant.businessDescription ?? ""}
          placeholder="What does your business sell, and to whom?"
          className="w-full rounded-sm border border-border bg-surface-raised p-3 text-sm text-foreground placeholder:text-muted-foreground"
          required
        />
        {errors.businessDescription && <p className="text-xs text-danger">{errors.businessDescription}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
