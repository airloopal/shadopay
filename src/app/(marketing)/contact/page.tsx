import { Briefcase, LifeBuoy, Handshake, Scale, Newspaper, ShieldAlert } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Contact — ShadoPay" };

const channels = [
  { icon: Briefcase, title: "Sales", body: "Talk to us about onboarding your business.", email: "sales@shadopay.dev" },
  { icon: LifeBuoy, title: "Support", body: "Help with your existing ShadoPay account.", email: "support@shadopay.dev" },
  { icon: Handshake, title: "Partnerships", body: "Integrations, referrals, and platform partnerships.", email: "partners@shadopay.dev" },
  { icon: Scale, title: "Legal", body: "Contracts, compliance, and legal inquiries.", email: "legal@shadopay.dev" },
  { icon: Newspaper, title: "Media", body: "Press and media inquiries.", email: "press@shadopay.dev" },
  { icon: ShieldAlert, title: "Responsible disclosure", body: "Report a suspected security vulnerability.", email: "security@shadopay.dev", id: "disclosure" },
];

export default function ContactPage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Contact"
        title="Let's talk."
        description="Reach the right team directly — we typically respond within one business day."
      />

      <div className="container py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => (
            <Card key={c.title} id={c.id} className="scroll-mt-24">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted text-accent">
                  <c.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-base text-foreground">{c.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
                <a href={`mailto:${c.email}`} className="mt-3 inline-block text-sm text-accent hover:underline">
                  {c.email}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-lg rounded-lg border border-border bg-card/60 p-8">
          <h2 className="text-lg font-light text-foreground">Send a message</h2>
          <form className="mt-6 space-y-4">
            <input
              placeholder="Your name"
              className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <input
              type="email"
              placeholder="Email address"
              className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <textarea
              rows={4}
              placeholder="How can we help?"
              className="w-full rounded-sm border border-border bg-surface-raised p-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="h-10 w-full rounded-md bg-accent text-sm font-medium text-accent-foreground transition-all hover:shadow-glow-accent"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
