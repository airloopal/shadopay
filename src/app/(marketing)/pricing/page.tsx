import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pricing — ShadoPay" };

const plans = [
  {
    name: "Starter",
    price: "2.9% + $0.30",
    tagline: "Per successful transaction",
    features: ["Payment links & hosted checkout", "Standard settlement schedule", "Email support", "Sandbox access"],
  },
  {
    name: "Growth",
    price: "Custom",
    tagline: "For established, higher-volume merchants",
    features: ["Volume-based pricing", "Faster settlement options", "Dedicated compliance contact", "Priority support"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    tagline: "For platforms and marketplaces",
    features: ["Custom reserve structures", "Multi-entity support", "Dedicated infrastructure review", "SLA-backed support"],
  },
];

export default function PricingPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Pricing"
        title="Simple, transparent pricing."
        description="No setup fees. No long-term contracts. Final pricing depends on category, volume, and risk profile — confirmed during onboarding."
      />

      <div className="container py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.highlighted ? "border-accent/40 shadow-glow-accent" : ""}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{plan.name}</CardTitle>
                <p className="mt-2 text-3xl font-light text-foreground">{plan.price}</p>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-success" /> {f}
                  </div>
                ))}
                <Button asChild className="mt-4 w-full" variant={plan.highlighted ? "default" : "outline"}>
                  <Link href="/contact">
                    Talk to sales <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Rates shown are illustrative for this MVP and subject to change following underwriting review.
          Final pricing is confirmed in your Merchant Agreement.
        </p>
      </div>
    </div>
  );
}
