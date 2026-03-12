"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompetitions } from "@/hooks/use-competitions";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FiShield } from "react-icons/fi";

export default function TeamsPage() {
  const { data: competitions, isLoading } = useCompetitions();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-text-primary">Teams</h1>
      <p className="text-sm text-text-secondary">
        Browse teams by selecting a competition from the list below.
      </p>

      {isLoading && <LoadingSkeleton rows={6} />}

      {!isLoading && (!competitions || competitions.length === 0) && (
        <EmptyState message="No competitions available" icon={FiShield} />
      )}

      {competitions && competitions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-card divide-y divide-border">
          {competitions.map((comp) => (
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
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-text-primary">{comp.name}</span>
              </div>
              {comp.country?.flagUrl && (
                <Image
                  src={comp.country.flagUrl}
                  alt={comp.country.name}
                  width={16}
                  height={16}
                  className="h-4 w-4 rounded-sm object-cover"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
