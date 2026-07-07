import { ComingSoonPage } from "@/features/marketing/coming-soon-page";

export const metadata = { title: "News — ShadoPay" };

export default function NewsPage() {
  return (
    <ComingSoonPage
      eyebrow="News"
      title="Company news is coming soon."
      description="Announcements, milestones, and updates from ShadoPay will be published here."
    />
  );
}
