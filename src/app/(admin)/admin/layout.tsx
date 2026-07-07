import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PageTransition } from "@/components/layout/page-transition";
import { adminNav } from "@/config/nav";
import { requireRole } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE", "PLATFORM_SUPPORT");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={adminNav} brand="ShadoPay Admin" />
      <div className="flex flex-1 flex-col">
        <Topbar
          userName={session.user.name}
          userEmail={session.user.email}
          mobileNavItems={adminNav}
          mobileNavBrand="ShadoPay Admin"
          showEnvironmentBadge
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
