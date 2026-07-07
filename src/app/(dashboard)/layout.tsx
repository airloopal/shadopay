import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PageTransition } from "@/components/layout/page-transition";
import { merchantNav } from "@/config/nav";
import { requireActiveMerchant } from "@/lib/session";
import { listNotifications } from "@/features/notifications/queries";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, merchant } = await requireActiveMerchant();
  const notifications = await listNotifications(merchant.id);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={merchantNav} brand="ShadoPay" />
      <div className="flex flex-1 flex-col">
        <Topbar
          userName={session.user.name}
          userEmail={session.user.email}
          merchantName={merchant.displayName}
          merchantId={merchant.id}
          notifications={notifications}
          mobileNavItems={merchantNav}
          mobileNavBrand="ShadoPay"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
