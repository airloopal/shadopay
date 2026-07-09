export default function PaymentLinksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Payment links
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage hosted checkout links for your clients.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Your payment links
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Payment link management will appear here.
            </p>
          </div>

          <a
            href="/payment-links/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Create payment link
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-border p-6 text-sm text-muted-foreground">
          No payment links found yet.
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Page 1 of 1</span>

          <div className="flex gap-2">
            <a
              href="#"
              aria-disabled="true"
              className="pointer-events-none inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium opacity-50"
            >
              Previous
            </a>

            <a
              href="#"
              aria-disabled="true"
              className="pointer-events-none inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium opacity-50"
            >
              Next
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
