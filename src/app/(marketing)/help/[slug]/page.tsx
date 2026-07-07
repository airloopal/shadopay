import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findArticleBySlug } from "@/features/help/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const result = findArticleBySlug(slug);

  if (!result) notFound();
  const { article, category } = result;

  return (
    <div className="container max-w-2xl py-16">
      <Link href="/help" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Help Centre
      </Link>

      <p className="mt-8 text-sm text-accent">{category.title}</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground">{article.title}</h1>

      <div className="mt-8 space-y-4">
        {article.body.map((paragraph, i) => (
          <p key={i} className="text-muted-foreground">{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Didn&apos;t find what you needed?{" "}
        <Link href="/contact" className="text-accent hover:underline">Contact support</Link>.
      </div>
    </div>
  );
}
