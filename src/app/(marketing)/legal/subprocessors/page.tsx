import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Subprocessor List — ShadoPay" };

const subprocessors = [
  { name: "[Placeholder: Cloud infrastructure provider]", purpose: "Application hosting and compute", location: "United States" },
  { name: "[Placeholder: Database provider]", purpose: "Managed PostgreSQL database hosting", location: "United States" },
  { name: "[Placeholder: Object storage provider]", purpose: "Encrypted storage of verification documents", location: "United States" },
  { name: "[Placeholder: Email delivery provider]", purpose: "Transactional email delivery", location: "United States" },
  { name: "[Placeholder: Identity verification provider]", purpose: "Identity document verification support", location: "[Placeholder]" },
];

export default function SubprocessorsPage() {
  return (
    <LegalDocument
      title="Subprocessor List"
      lastUpdated="July 7, 2026"
      summary="This page lists the third-party subprocessors ShadoPay may engage to help provide the Services, consistent with our Data Processing Addendum."
    >
      <LegalSection title="Current subprocessors">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-3 gap-4 border-b border-border bg-white/[0.02] px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span>Subprocessor</span>
            <span>Purpose</span>
            <span>Location</span>
          </div>
          {subprocessors.map((s, i) => (
            <div
              key={s.name}
              className={`grid grid-cols-3 gap-4 px-5 py-3.5 text-sm ${i !== subprocessors.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="text-foreground">{s.name}</span>
              <span className="text-muted-foreground">{s.purpose}</span>
              <span className="text-muted-foreground">{s.location}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          [Placeholder: replace with finalized vendor names once contracts are executed.]
        </p>
      </LegalSection>

      <LegalSection title="Notice of new subprocessors">
        <p>
          We will update this list before engaging a new subprocessor that will process merchant or
          end-customer personal data. [Placeholder: insert advance notice period and objection
          process, e.g. 30 days' notice with a right to object.]
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
