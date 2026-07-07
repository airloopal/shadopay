interface MarketingPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function MarketingPageHeader({ eyebrow, title, description }: MarketingPageHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="container py-20 text-center">
        <p className="text-sm text-accent">{eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
