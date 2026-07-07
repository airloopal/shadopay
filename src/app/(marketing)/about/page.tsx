import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Users, Globe2, Compass } from "lucide-react";

export const metadata = { title: "About — ShadoPay" };

export default function AboutPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="About"
        title="Payment infrastructure for the businesses everyone else says no to."
        description="ShadoPay exists because legitimate, regulated businesses in high-risk categories deserve payment infrastructure built for their reality — not a workaround bolted onto someone else's."
      />

      <div className="container grid grid-cols-1 gap-16 py-20 lg:grid-cols-2">
        <div className="space-y-6 text-muted-foreground">
          <h2 className="text-2xl font-light text-foreground">Our story</h2>
          <p>
            Traditional payment processors are built around low-risk retail. The moment a business
            operates in nutraceuticals, iGaming, adult content, or another closely regulated category,
            it's treated as a liability rather than a customer — accounts get frozen, funds get held,
            and founders are left explaining themselves to support queues that were never built to
            understand their business.
          </p>
          <p>
            We started ShadoPay to fix that gap directly. Instead of treating compliance as a
            checkbox bolted on after the fact, we built verification, monitoring, and audit trails
            into the foundation of the platform — so approved merchants get the same speed and
            reliability as any other modern payments company, without pretending their business is
            something it isn't.
          </p>
          <p>
            We're a small, deliberately focused team. We'd rather do fewer things well than
            everything at once, which is why payment processing itself is being rolled out carefully,
            merchant category by merchant category, alongside the compliance work required to support
            it responsibly.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: ShieldCheck,
              title: "Compliance is the product",
              body: "Verification and monitoring aren't a layer on top — they're why the platform exists.",
            },
            {
              icon: Users,
              title: "Built with real merchants",
              body: "Every workflow is shaped by conversations with founders who've been declined elsewhere.",
            },
            {
              icon: Globe2,
              title: "Global by design",
              body: "Multi-currency settlement and jurisdiction-aware verification from day one.",
            },
            {
              icon: Compass,
              title: "Slow and deliberate rollout",
              body: "We'd rather onboard fewer categories properly than every category poorly.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-muted text-accent">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
