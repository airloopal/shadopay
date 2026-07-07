"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { saveBrandingAction, type ActionState } from "@/features/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ActionState = {};

interface BrandingFormProps {
  receiptName: string;
  primaryColor: string;
  supportEmail: string;
  supportUrl: string;
}

export function BrandingForm({ receiptName, primaryColor, supportEmail, supportUrl }: BrandingFormProps) {
  const [state, formAction, isPending] = useActionState(saveBrandingAction, initialState);
  const [color, setColor] = useState(primaryColor);
  const [logoName, setLogoName] = useState<string | null>(null);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="logo">Merchant logo</Label>
        <label
          htmlFor="logo"
          className="flex items-center gap-4 rounded-md border border-dashed border-border bg-white/[0.02] p-4 transition-colors hover:border-white/20"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {logoName ? logoName.slice(0, 1).toUpperCase() : <Upload className="h-4 w-4" strokeWidth={1.75} />}
          </div>
          <span className="text-sm text-muted-foreground">{logoName ?? "Click to upload a logo"}</span>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setLogoName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="primaryColor">Brand color</Label>
        <div className="flex items-center gap-3">
          <input
            id="primaryColor"
            name="primaryColor"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded-sm border border-border bg-surface-raised p-1"
          />
          <span className="font-mono text-xs text-muted-foreground">{color}</span>
        </div>
        {errors.primaryColor && <p className="text-xs text-danger">{errors.primaryColor}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="receiptName">Receipt name</Label>
        <Input id="receiptName" name="receiptName" defaultValue={receiptName} placeholder="Shown on customer receipts" required />
        {errors.receiptName && <p className="text-xs text-danger">{errors.receiptName}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="supportEmail">Support email</Label>
          <Input id="supportEmail" name="supportEmail" type="email" defaultValue={supportEmail} required />
          {errors.supportEmail && <p className="text-xs text-danger">{errors.supportEmail}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="supportUrl">Support URL</Label>
          <Input id="supportUrl" name="supportUrl" type="url" placeholder="https://" defaultValue={supportUrl} />
          {errors.supportUrl && <p className="text-xs text-danger">{errors.supportUrl}</p>}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        These details will automatically appear on your hosted checkout pages and receipts.
      </p>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
