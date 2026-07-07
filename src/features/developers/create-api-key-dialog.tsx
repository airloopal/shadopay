"use client";

import { useState, useTransition } from "react";
import { Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createApiKeyAction } from "@/features/developers/actions";

export function CreateApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const { plaintext } = await createApiKeyAction(formData);
        setRevealedKey(plaintext);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to create key.");
      }
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setRevealedKey(null);
      setCopied(false);
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Create API key
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!revealedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>You&apos;ll see the full key once, immediately after creation.</DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Key name</Label>
                <Input id="name" name="name" placeholder="e.g. Production backend" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mode">Mode</Label>
                <select
                  id="mode"
                  name="mode"
                  className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
                >
                  <option value="LIVE">Live</option>
                  <option value="SANDBOX">Sandbox</option>
                </select>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Generating…" : "Generate key"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Your new API key</DialogTitle>
              <DialogDescription>
                Copy this now — for your security, we won&apos;t show it again.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-raised p-3">
              <code className="flex-1 break-all font-mono text-xs text-foreground">{revealedKey}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await navigator.clipboard.writeText(revealedKey);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
