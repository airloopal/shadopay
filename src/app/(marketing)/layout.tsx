import { MarketingNav } from "@/features/marketing/marketing-nav";
import { MarketingFooter } from "@/features/marketing/marketing-footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
