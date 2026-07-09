import Link from "next/link";
import { ArrowRight, Webhook, KeyRound, FlaskConical, BookOpen } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Developers — ShadoPay" };

export default function DevelopersPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Developers"
        title="A clean API you'll actually enjoy using."
        description="REST endpoints, signed webhooks, and a sandbox mode that never touches real money. Built to feel familiar from the first request."
      />

      <div className="container py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs text-muted-foreground">POST /v1/charges</p>
            <div className="mt-3 rounded-lg border border-border bg-card/80 p-6 shadow-glass">
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`curl https://api.shadopay.dev/v1/charges \\
  -H "Authorization: Bearer pk_live_..." \\
  -d amount=2000 \\
  -d currency=usd \\
  -d description="Order #1042"`}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: KeyRound, title: "Scoped API keys", body: "Separate live and sandbox keys, revocable at any time." },
              { icon: Webhook, title: "Signed webhooks", body: "Verify every event with an HMAC signature before you trust it." },
              { icon: FlaskConical, title: "Sandbox mode", body: "Build and test your entire integration without moving real money." },
              { icon: BookOpen, title: "Full documentation", body: "Guides, references, and changelogs in one place." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-muted text-accent">
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-lg border border-border bg-card/60 p-10 text-center">
          <h2 className="text-2xl font-light text-foreground">Ready to start building?</h2>
          <div className="flex gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 bg-accent text-accent-foreground shadow-soft hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0"
            >
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
