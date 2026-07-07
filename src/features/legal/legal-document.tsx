import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LegalDocumentProps {
  title: string;
  lastUpdated: string;
  summary?: string;
  children: React.ReactNode;
}

export function LegalDocument({ title, lastUpdated, summary, children }: LegalDocumentProps) {
  return (
    <div className="container max-w-3xl py-16">
      <Link href="/legal" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Legal Centre
      </Link>

      <h1 className="mt-8 text-3xl font-light tracking-tight text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      {summary && <p className="mt-4 text-muted-foreground">{summary}</p>}

      <div className="legal-prose mt-10 space-y-8">{children}</div>

      <div className="mt-14 rounded-lg border border-border bg-card/60 p-5 text-xs text-muted-foreground">
        This document is provided as a professionally drafted MVP template and has not been reviewed
        by qualified legal counsel. Bracketed placeholders indicate jurisdiction-specific or
        company-specific language that should be finalized before this policy governs live,
        production transactions.
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-light text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
