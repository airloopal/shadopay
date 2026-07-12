"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, Copy, Share2, FileText, Send } from "lucide-react";
import { createInvoiceAction, markInvoiceSentAction, type CreateInvoiceState } from "@/features/invoices/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: CreateInvoiceState = {};

export function CreateInvoiceForm() {
  const [state, formAction, isPending] = useActionState(createInvoiceAction, initialState);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const errors = state.errors ?? {};

  if (state.success) {
    const { invoiceId, number, paymentUrl } = state.success;

    async function handleCopy() {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }

    async function handleShare() {
      if (navigator.share) {
        try {
          await navigator.share({ title: `Invoice ${number}`, text: "Here's your invoice", url: paymentUrl });
          return;
        } catch {
          return;
        }
      }
      await handleCopy();
    }

    async function handleMarkSent() {
      await markInvoiceSentAction(invoiceId);
      setSent(true);
    }

    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-muted text-success">
            <FileText className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-xl font-light text-foreground">Invoice {number} created</h2>
            <p className="mt-1 text-sm text-muted-foreground">Send it however works best for you.</p>
          </div>

          <div className="w-full rounded-lg border border-border bg-white/[0.02] p-3">
            <p className="break-all font-mono text-xs text-foreground">{paymentUrl}</p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Button type="button" size="lg" className="w-full" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Share invoice
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy payment link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleMarkSent}
              disabled={sent}
            >
              <Send className="h-4 w-4" /> {sent ? "Marked as sent" : "Mark as sent"}
            </Button>
            <Link
              href={`/invoices/${invoiceId}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-transparent text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-raised"
            >
              View invoice
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="customerName">Customer name</Label>
            <Input id="customerName" name="customerName" placeholder="e.g. Sam Taylor" required autoFocus />
            {errors.customerName && <p className="text-xs text-danger">{errors.customerName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customerEmail">Customer email</Label>
            <Input id="customerEmail" name="customerEmail" type="email" placeholder="name@example.com" required />
            {errors.customerEmail && <p className="text-xs text-danger">{errors.customerEmail}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="e.g. Kitchen deep clean" required />
            {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
            {errors.amount && <p className="text-xs text-danger">{errors.amount}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due date (optional)</Label>
            <Input id="dueDate" name="dueDate" type="date" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" name="note" placeholder="Anything else the customer should know" />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Creating…" : "Create invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
