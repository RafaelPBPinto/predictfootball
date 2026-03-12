"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useCompetitions } from "@/hooks/use-competitions";
import { CompetitionResponse } from "@/types";

function groupByCountry(competitions: CompetitionResponse[]) {
  const map = new Map<string, { flag: string | null; items: CompetitionResponse[] }>();
  for (const comp of competitions) {
    const key = comp.country.name;
    const existing = map.get(key);
    if (existing) {
      existing.items.push(comp);
    } else {
      map.set(key, { flag: comp.country.flagUrl, items: [comp] });
    }
  }
  return Array.from(map.entries());
}

function CountryGroup({
  name,
  flagUrl,
  competitions,
  pathname,
}: {
  name: string;
  flagUrl: string | null;
  competitions: CompetitionResponse[];
  pathname: string;
}) {
  const hasActive = competitions.some((c) => pathname === `/competitions/${c.id}`);
  const [open, setOpen] = useState(hasActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-secondary"
      >
        {flagUrl ? (
          <Image src={flagUrl} alt={name} width={14} height={14} className="h-3.5 w-3.5 rounded-sm object-cover" />
        ) : (
          <span className="h-3.5 w-3.5 text-[8px] leading-[14px] text-center">🏳</span>
        )}
        <span className="flex-1 text-left">{name}</span>
        {open ? (
          <FiChevronDown className="h-3 w-3" />
        ) : (
          <FiChevronRight className="h-3 w-3" />
        )}
      </button>
      {open && (
        <nav className="mt-0.5 space-y-0.5 pl-2">
          {competitions.map((comp) => {
            const isActive = pathname === `/competitions/${comp.id}`;
            return (
              <Link
                key={comp.id}
                href={`/competitions/${comp.id}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "border-l-2 border-accent bg-bg-card text-text-primary"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                }`}
              >
                {comp.logoUrl ? (
                  <Image
                    src={comp.logoUrl}
                    alt={comp.name}
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                ) : (
                  <div className="h-4 w-4 rounded bg-bg-elevated" />
                )}
                <span className="truncate">{comp.name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export function Sidebar() {
  const { data: competitions, isLoading } = useCompetitions();
  const pathname = usePathname();

  const groups = competitions ? groupByCountry(competitions) : [];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-secondary lg:block">
      <div className="sticky top-12 overflow-y-auto p-3" style={{ maxHeight: "calc(100vh - 3rem)" }}>
        <h2 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Competitions
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 animate-pulse rounded bg-bg-card" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {groups.map(([country, { flag, items }]) => (
              <CountryGroup
                key={country}
                name={country}
                flagUrl={flag}
                competitions={items}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
