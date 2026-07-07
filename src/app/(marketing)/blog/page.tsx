import { ComingSoonPage } from "@/features/marketing/coming-soon-page";

export const metadata = { title: "Blog — ShadoPay" };

export default function BlogPage() {
  return (
    <ComingSoonPage
      eyebrow="Blog"
      title="Our blog is coming soon."
      description="Engineering deep-dives, compliance perspectives, and product updates will live here."
    />
  );
}
