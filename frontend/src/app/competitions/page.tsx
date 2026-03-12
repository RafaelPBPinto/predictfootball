"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompetitions } from "@/hooks/use-competitions";
import { CompetitionResponse } from "@/types";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FiGrid } from "react-icons/fi";

function groupByCountry(competitions: CompetitionResponse[]) {
  const map = new Map<string, { flag: string | null; items: CompetitionResponse[] }>();
  for (const comp of competitions) {
    const key = comp.country.name;
    const existing = map.get(key);
    if (existing) existing.items.push(comp);
    else map.set(key, { flag: comp.country.flagUrl, items: [comp] });
  }
  return Array.from(map.entries());
}

export default function CompetitionsPage() {
  const { data: competitions, isLoading } = useCompetitions();

  const groups = competitions ? groupByCountry(competitions) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-text-primary">Competitions</h1>

      {isLoading && <LoadingSkeleton rows={8} />}

      {!isLoading && groups.length === 0 && (
        <EmptyState message="No competitions available" icon={FiGrid} />
      )}

      <div className="space-y-4">
        {groups.map(([country, { flag, items }]) => (
          <div key={country}>
            <div className="flex items-center gap-2 mb-2 px-1">
              {flag ? (
                <Image src={flag} alt={country} width={16} height={16} className="h-4 w-4 rounded-sm object-cover" />
              ) : (
                <span className="h-4 w-4 text-[10px] leading-4 text-center">🏳</span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{country}</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-bg-card divide-y divide-border">
              {items.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/competitions/${comp.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg-card-hover"
                >
                  {comp.logoUrl ? (
                    <Image
                      src={comp.logoUrl}
                      alt={comp.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded bg-bg-elevated" />
                  )}
                  <span className="text-sm font-medium text-text-primary">{comp.name}</span>
                  <span className="ml-auto text-xs text-text-muted capitalize">{comp.type.toLowerCase()}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
