"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompetitions } from "@/hooks/use-competitions";

export function Sidebar() {
  const { data: competitions, isLoading } = useCompetitions();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-bg-secondary lg:block">
      <div className="sticky top-14 p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Competitions
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-bg-card" />
            ))}
          </div>
        ) : (
          <nav className="space-y-1">
            {competitions?.map((comp) => (
              <Link
                key={comp.id}
                href={`/competitions/${comp.id}`}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
              >
                {comp.logoUrl ? (
                  <Image
                    src={comp.logoUrl}
                    alt={comp.name}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] object-contain"
                  />
                ) : (
                  <div className="h-[18px] w-[18px] rounded bg-bg-card" />
                )}
                {comp.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
