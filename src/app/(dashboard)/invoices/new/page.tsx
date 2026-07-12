import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateInvoiceForm } from "@/features/invoices/create-invoice-form";

export default function NewInvoicePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/invoices" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Invoices
      </Link>
      <div>
        <h1 className="text-2xl font-light tracking-tight text-foreground">Create invoice</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bill a customer in a few taps.</p>
      </div>
      <CreateInvoiceForm />
    </div>
  );
}
