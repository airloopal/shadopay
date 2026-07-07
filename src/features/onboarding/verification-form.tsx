"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Upload, FileCheck2, Globe } from "lucide-react";
import { saveVerificationAction, type ActionState } from "@/features/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ActionState = {};

function FileField({ id, name, label }: { id: string; name: string; label: string }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-white/[0.02] p-4 text-sm text-muted-foreground transition-colors hover:border-white/20"
      >
        <Upload className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        {fileName ?? "Click to upload a file"}
        <input
          id={id}
          name={name}
          type="file"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
    </div>
  );
}

export function VerificationForm({ website, registrationNumber }: { website: string | null; registrationNumber: string | null }) {
  const [state, formAction, isPending] = useActionState(saveVerificationAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="registrationNumber">Business registration number (if applicable)</Label>
        <Input
          id="registrationNumber"
          name="registrationNumber"
          placeholder="e.g. company or tax registration number"
          defaultValue={registrationNumber ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Optional in jurisdictions that don&apos;t issue a formal business registration number.
        </p>
      </div>

      <FileField id="governmentId" name="governmentId" label="Government-issued ID" />
      <FileField id="proofOfAddress" name="proofOfAddress" label="Proof of address" />

      <div className="flex items-start gap-3 rounded-md border border-border bg-white/[0.02] p-4">
        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <div className="text-sm">
          <p className="text-foreground">Business website review</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {website
              ? <>Our team will review <span className="text-foreground">{website}</span> as part of verification.</>
              : "Add a website in Business Information so we can review it as part of verification."}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-border bg-white/[0.02] p-4 text-xs text-muted-foreground">
        <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <p>
          You can submit verification now or come back to it later — it won&apos;t block the rest of
          setup. Live payments require approved verification.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
