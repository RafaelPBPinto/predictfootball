type SkeletonVariant = "match-list" | "table" | "stat-grid" | "default";

interface LoadingSkeletonProps {
  rows?: number;
  variant?: SkeletonVariant;
}

export function LoadingSkeleton({ rows = 5, variant = "default" }: LoadingSkeletonProps) {
  if (variant === "stat-grid") {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-bg-card" />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
        <div className="h-10 animate-pulse border-b border-border bg-bg-elevated" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse border-b border-border last:border-b-0" />
        ))}
      </div>
    );
  }

  if (variant === "match-list") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
        <div className="h-10 animate-pulse border-b border-border bg-bg-elevated" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-11 animate-pulse border-b border-border last:border-b-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-bg-card" />
      ))}
    </div>
  );
}
