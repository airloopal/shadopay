import Link from "next/link";
import { ArrowRight, Pill, Dice5, Flame, Cannabis, Dumbbell, Coins } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Solutions — ShadoPay" };

const categories = [
  { icon: Pill, title: "Nutraceuticals & supplements", body: "Recurring billing and chargeback tooling built for regulated consumables." },
  { icon: Dice5, title: "iGaming & fantasy sports", body: "High-velocity transaction monitoring tuned for licensed operators." },
  { icon: Flame, title: "Adult content & entertainment", body: "Discreet billing descriptors and privacy-first customer data handling." },
  { icon: Cannabis, title: "CBD & wellness", body: "Verification workflows aligned to jurisdiction-specific legality." },
  { icon: Dumbbell, title: "Subscription fitness & coaching", body: "Flexible payment links and invoicing for high-touch service businesses." },
  { icon: Coins, title: "Digital goods & memberships", body: "Fast settlement for businesses with thin margins and high volume." },
];

export default function SolutionsPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Solutions"
        title="Built for the categories other processors decline."
        description="Every category on ShadoPay goes through the same rigorous verification — so approved merchants get consistent, reliable infrastructure regardless of industry."
      />

      <div className="container py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.title}>
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted text-accent">
                  <c.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-base text-foreground">{c.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-border bg-card/60 p-10 text-center">
          <h2 className="text-2xl font-light text-foreground">Don&apos;t see your category listed?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            We evaluate high-risk categories case by case. If your business is legally operating and
            properly licensed, talk to our team.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 bg-accent text-accent-foreground shadow-soft hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0"
          >
            Talk to sales <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
