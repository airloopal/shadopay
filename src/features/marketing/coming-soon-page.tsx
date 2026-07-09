import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";

export function ComingSoonPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <MarketingPageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="container flex flex-col items-center gap-6 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted text-accent">
          <Clock className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="max-w-md text-muted-foreground">
          We&apos;re building this out. In the meantime, reach out directly and we&apos;ll get back to you.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
        >
          Contact us <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
