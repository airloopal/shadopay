import Link from "next/link";
import { FileText } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Legal Centre — ShadoPay" };

const documents = [
  { href: "/legal/terms", title: "Terms of Service", body: "The core agreement governing use of ShadoPay." },
  { href: "/legal/privacy", title: "Privacy Policy", body: "How we collect, use, and protect personal data." },
  { href: "/legal/cookies", title: "Cookie Policy", body: "How cookies and similar technologies are used." },
  { href: "/legal/acceptable-use", title: "Acceptable Use Policy", body: "Prohibited uses of the ShadoPay platform." },
  { href: "/legal/merchant-agreement", title: "Merchant Agreement", body: "Terms specific to merchants processing payments." },
  { href: "/legal/refund-policy", title: "Refund Policy", body: "How refunds are requested, processed, and disclosed." },
  { href: "/legal/security-policy", title: "Security Policy", body: "Our commitments around data and platform security." },
  { href: "/legal/aml-policy", title: "AML Policy", body: "Our approach to anti-money laundering compliance." },
  { href: "/legal/verification-policy", title: "Verification Policy", body: "How business and identity verification works." },
  { href: "/legal/complaint-procedure", title: "Complaint Procedure", body: "How to raise and escalate a complaint." },
  { href: "/legal/data-processing-addendum", title: "Data Processing Addendum", body: "Terms governing data processed on behalf of merchants." },
  { href: "/legal/subprocessors", title: "Subprocessor List", body: "Third parties that may process data on our behalf." },
  { href: "/legal/platform-rules", title: "Platform Rules", body: "Operating rules for merchants using ShadoPay." },
  { href: "/legal/content-standards", title: "Content Standards", body: "Standards for content sold or promoted through ShadoPay." },
];

export default function LegalCentrePage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Legal Centre"
        title="Policies and agreements."
        description="Original, plainly written documentation governing your use of ShadoPay."
      />

      <div className="container py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {documents.map((doc) => (
            <Link key={doc.href} href={doc.href}>
              <Card className="h-full">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-muted text-accent">
                    <FileText className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{doc.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{doc.body}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
