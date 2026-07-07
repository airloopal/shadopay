import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { HelpSearch } from "@/features/help/help-search";

export const metadata = { title: "Help Centre — ShadoPay" };

export default function HelpCentrePage() {
  return (
    <div>
      <MarketingPageHeader
        eyebrow="Help Centre"
        title="How can we help?"
        description="Search our knowledge base or browse by category."
      />
      <div className="container py-16">
        <HelpSearch />
      </div>
    </div>
  );
}
