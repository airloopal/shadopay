import { BookOpen, KeyRound, Webhook, Link2, CreditCard, AlertTriangle, Terminal } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Documentation — ShadoPay" };

const guides = [
  { icon: BookOpen, title: "Quickstart", body: "Create your first charge in under five minutes." },
  { icon: KeyRound, title: "Authentication", body: "How API keys, live mode, and sandbox mode work together." },
  { icon: CreditCard, title: "Charges", body: "Create, capture, and refund charges via the API." },
  { icon: Link2, title: "Payment links", body: "Generate shareable checkout links programmatically." },
  { icon: Webhook, title: "Webhooks", body: "Subscribe to events and verify webhook signatures." },
  { icon: AlertTriangle, title: "Errors", body: "Understand error codes and how to handle them gracefully." },
];

const apiReference = [
  { method: "POST", path: "/v1/charges", desc: "Create a new charge" },
  { method: "GET", path: "/v1/charges/:id", desc: "Retrieve a charge" },
  { method: "POST", path: "/v1/refunds", desc: "Issue a refund" },
  { method: "POST", path: "/v1/payment_links", desc: "Create a payment link" },
  { method: "GET", path: "/v1/payouts", desc: "List payouts" },
  { method: "POST", path: "/v1/webhook_endpoints", desc: "Register a webhook endpoint" },
];

export default function DocsPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Documentation"
        title="Guides and reference for building on ShadoPay."
        description="Everything you need to integrate — from your first API call to production webhooks."
      />

      <div className="container py-20">
        <h2 className="text-xl font-light text-foreground">Guides</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Card key={g.title}>
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted text-accent">
                  <g.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-base text-foreground">{g.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{g.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="api-reference" className="mt-20 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" strokeWidth={1.75} />
            <h2 className="text-xl font-light text-foreground">API reference</h2>
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            {apiReference.map((row, i) => (
              <div
                key={row.path}
                className={`flex items-center gap-4 px-5 py-3.5 ${i !== apiReference.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="w-14 shrink-0 font-mono text-xs text-accent">{row.method}</span>
                <span className="w-56 shrink-0 font-mono text-xs text-foreground">{row.path}</span>
                <span className="text-sm text-muted-foreground">{row.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Full request/response schemas and error references will be published here as the
            processing API is completed.
          </p>
        </div>
      </div>
    </div>
  );
}
