import { redirect } from "next/navigation";
import { getSession, getActiveMerchant } from "@/lib/session";
import { HomePage } from "@/features/marketing/home-page";

export default async function RootPage() {
  const session = await getSession();

  if (!session) {
    return <HomePage />;
  }

  const merchant = await getActiveMerchant(session.user.id);
  if (!merchant) redirect("/onboarding");
  redirect(merchant.onboardingCompletedAt ? "/dashboard" : "/onboarding");
}
