"use client";

import { useActionState, useMemo, useState } from "react";
import { Search, ArrowRight, Check } from "lucide-react";
import { saveCategoryAction, type ActionState } from "@/features/onboarding/actions";
import { ONBOARDING_CATEGORIES } from "@/features/onboarding/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: ActionState = {};

export function CategorySelectorForm({ initialCategory }: { initialCategory: string }) {
  const [state, formAction, isPending] = useActionState(saveCategoryAction, initialState);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ONBOARDING_CATEGORIES;
    return ONBOARDING_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="category" value={selected} />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories…"
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filtered.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selected === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelected(cat.value)}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3.5 text-left transition-colors",
                isSelected
                  ? "border-accent bg-accent-muted"
                  : "border-border bg-white/[0.02] hover:border-white/20"
              )}
            >
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", isSelected ? "bg-accent text-accent-foreground" : "bg-white/[0.04] text-muted-foreground")}>
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className={cn("text-sm", isSelected ? "text-foreground" : "text-muted-foreground")}>
                {cat.label}
              </span>
              {isSelected && <Check className="ml-auto h-4 w-4 text-accent" />}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">No categories match &quot;{query}&quot;.</p>
        )}
      </div>

      {state.errors?.category && <p className="text-xs text-danger">{state.errors.category}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isPending || !selected}>
        {isPending ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
