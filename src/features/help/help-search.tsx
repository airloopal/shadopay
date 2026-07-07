"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { helpCategories, allArticles } from "@/features/help/data";

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const articles = useMemo(() => allArticles(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }, [query, articles]);

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an article…"
          className="h-12 rounded-full border-border bg-white/[0.03] pl-11 text-sm"
        />
      </div>

      {query.trim() ? (
        <div className="mx-auto mt-8 max-w-xl space-y-2">
          {results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">No articles match &quot;{query}&quot;.</p>
          )}
          {results.map((a) => (
            <Link
              key={a.slug}
              href={`/help/${a.slug}`}
              className="block rounded-md border border-border bg-card/60 p-4 transition-colors hover:border-white/20"
            >
              <p className="text-sm text-foreground">{a.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.categoryTitle} · {a.summary}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((cat) => (
            <Card key={cat.slug}>
              <CardContent className="p-6">
                <p className="text-base text-foreground">{cat.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{cat.description}</p>
                <ul className="mt-4 space-y-2">
                  {cat.articles.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/help/${a.slug}`} className="text-sm text-accent hover:underline">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
