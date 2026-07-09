import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Trust Centre — ShadoPay" };

const sections = [
  { id: "security-overview", label: "Security overview" },
  { id: "encryption", label: "Encryption" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "availability", label: "Availability" },
  { id: "compliance-roadmap", label: "Compliance roadmap" },
  { id: "incident-response", label: "Incident response" },
  { id: "responsible-disclosure", label: "Responsible disclosure" },
  { id: "system-status", label: "System status" },
  { id: "business-verification", label: "Business verification" },
  { id: "monitoring", label: "Monitoring" },
  { id: "merchant-protection", label: "Merchant protection" },
];

export default function TrustCentrePage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Trust Centre"
        title="Everything we do to earn and keep your trust."
        description="A transparent look at how ShadoPay protects merchants, customers, and the platform itself."
      />

      <div className="container grid grid-cols-1 gap-12 py-16 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-16">
          <section id="security-overview" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Security overview</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Security at ShadoPay is organized around three principles: least-privilege access,
              complete auditability, and defense in depth. Every internal tool, every merchant-facing
              feature, and every API endpoint is designed against these principles before it ships.
            </p>
          </section>

          <section id="encryption" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Encryption</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Data in transit is encrypted using TLS 1.2 or higher across every client, API, and
              internal service connection. Data at rest — including verification documents, merchant
              records, and transaction history — is encrypted using provider-managed encryption keys
              at the storage and database layer.
            </p>
          </section>

          <section id="infrastructure" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Infrastructure</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              ShadoPay runs on managed cloud infrastructure with isolated environments for production,
              staging, and sandbox traffic. Database access is restricted to backend services; no
              client ever queries the database directly.
            </p>
          </section>

          <section id="availability" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Availability</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Core services — the API, dashboard, and hosted checkout — are built on infrastructure
              designed for high availability, with automated health checks and failover. Live uptime
              and incident history are published on our{" "}
              <Link href="/status" className="text-accent hover:underline">status page</Link>.
            </p>
          </section>

          <section id="compliance-roadmap" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Compliance roadmap</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              As an early-stage platform, ShadoPay is building its compliance program deliberately
              rather than all at once. Current priorities:
            </p>
            <div className="mt-4 space-y-3">
              {[
                { label: "KYB & merchant verification", status: "Live" },
                { label: "Transaction monitoring & alerting", status: "Live" },
                { label: "PCI DSS assessment", status: "In progress" },
                { label: "SOC 2 Type I readiness", status: "Planned" },
                { label: "Regional licensing review", status: "Planned" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <Badge variant={item.status === "Live" ? "success" : item.status === "In progress" ? "warning" : "default"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              [Placeholder: update this roadmap as certifications are completed and formally attested.]
            </p>
          </section>

          <section id="incident-response" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Incident response</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Suspected security incidents are triaged immediately by our on-call team, contained,
              and investigated. Affected merchants are notified without undue delay once impact is
              understood, consistent with our contractual and legal obligations. A post-incident
              review is conducted for every confirmed incident.
            </p>
          </section>

          <section id="responsible-disclosure" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Responsible disclosure</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              If you believe you&apos;ve found a security vulnerability, we want to hear from it before
              anyone else does. Please report it privately rather than disclosing it publicly, and
              avoid accessing or modifying data that isn&apos;t yours.
            </p>
            <Link
              href="/contact#disclosure"
              className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
            >
              Report a vulnerability <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section id="system-status" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">System status</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Real-time status for the API, checkout, dashboard, payouts, authentication, email, and
              webhook delivery is published continuously.
            </p>
            <Link
              href="/status"
              className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
            >
              View system status <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section id="business-verification" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Business verification</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every merchant completes a know-your-business (KYB) review before accepting live
              payments — confirming legal registration, beneficial ownership, and category-specific
              licensing where applicable. Verification status is visible to merchants at every stage
              from their dashboard.
            </p>
          </section>

          <section id="monitoring" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Monitoring</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Transactions are continuously screened against velocity limits, geographic mismatches,
              duplicate card usage, and chargeback-rate thresholds. Flagged activity is routed to a
              manual review queue before any adverse action is taken.
            </p>
          </section>

          <section id="merchant-protection" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-foreground">Merchant protection</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Merchants aren&apos;t left guessing. Every compliance decision — approval, rejection, or a
              request for more information — includes a clear reason, and merchants can respond
              directly from their Trust Centre rather than through a generic support queue.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
