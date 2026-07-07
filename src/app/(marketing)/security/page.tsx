import Link from "next/link";
import { ArrowRight, Fingerprint, FileCheck, Server, Lock, KeyRound, Eye } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Security — ShadoPay" };

const pillars = [
  { icon: Fingerprint, title: "Role-based access", body: "Every sensitive action — approvals, key management, KYB decisions — is gated server-side by role and cannot be bypassed from the UI." },
  { icon: FileCheck, title: "Full audit trail", body: "Nothing is edited, only appended. Every action taken by staff or merchants is written to an immutable audit log." },
  { icon: Server, title: "Encrypted storage", body: "Verification documents are stored privately in access-controlled object storage and never exposed publicly." },
  { icon: Lock, title: "Encryption in transit and at rest", body: "All traffic is encrypted with TLS; data at rest is encrypted using provider-managed encryption keys." },
  { icon: KeyRound, title: "Scoped credentials", body: "API keys are scoped to live or sandbox mode and can be revoked instantly without rotating other credentials." },
  { icon: Eye, title: "Continuous monitoring", body: "Transaction patterns are screened continuously against velocity, geography, and risk-scoring rules." },
];

export default function SecurityPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Security"
        title="Privacy and security aren't an afterthought."
        description="Every layer of ShadoPay is built around protecting your business and your customers — from encrypted document storage to role-gated internal tooling."
      />

      <div className="container py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title}>
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted text-accent">
                  <p.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-base text-foreground">{p.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-lg border border-border bg-card/60 p-10 text-center">
          <h2 className="text-2xl font-light text-foreground">Want the full picture?</h2>
          <p className="max-w-md text-muted-foreground">
            The Trust Centre covers our infrastructure, compliance roadmap, incident response process,
            and how to report a vulnerability.
          </p>
          <Button asChild>
            <Link href="/trust">
              Visit the Trust Centre <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
