"use client";

import { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useCompetition } from "@/hooks/use-competitions";
import { useSeasons, useCurrentSeason } from "@/hooks/use-seasons";
import { useStandings } from "@/hooks/use-standings";
import { useMatchesBySeason } from "@/hooks/use-matches";
import { StandingsTable } from "@/components/standings/standings-table";
import { MatchCard } from "@/components/match/match-card";
import { SeasonSelector } from "@/components/ui/season-selector";
import { Tabs } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { MatchResponse } from "@/types";

const competitionTabs = [
  { key: "standings", label: "Standings" },
  { key: "matches", label: "Matches" },
];

interface MatchdayGroup {
  matchday: number | null;
  matches: MatchResponse[];
}

function groupByMatchday(matches: MatchResponse[]): MatchdayGroup[] {
  const map = new Map<number | null, MatchResponse[]>();
  for (const m of matches) {
    const key = m.matchday;
    const existing = map.get(key);
    if (existing) existing.push(m);
    else map.set(key, [m]);
  }
  return Array.from(map.entries())
    .map(([matchday, matches]) => ({ matchday, matches }))
    .sort((a, b) => (b.matchday ?? 0) - (a.matchday ?? 0));
}

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const competitionId = Number(id);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("standings");

  const { data: competition } = useCompetition(competitionId);
  const { data: currentSeason } = useCurrentSeason(competitionId);
  const { data: seasons } = useSeasons(competitionId);

  useEffect(() => {
    if (currentSeason && !selectedSeasonId) {
      setSelectedSeasonId(currentSeason.id);
    }
  }, [currentSeason, selectedSeasonId]);

  const {
    data: standings,
    isLoading: standingsLoading,
    isError: standingsError,
    refetch: refetchStandings,
  } = useStandings(selectedSeasonId!);

  const {
    data: matches,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useMatchesBySeason(selectedSeasonId!);

  const matchdayGroups = useMemo(
    () => (matches ? groupByMatchday(matches) : []),
    [matches]
  );

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
        <div className="flex items-center justify-between p-5 pb-4">
          <div className="flex items-center gap-3">
            {competition?.logoUrl ? (
              <Image
                src={competition.logoUrl}
                alt={competition.name}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-bg-elevated" />
            )}
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {competition?.name || "Competition"}
              </h1>
              {competition?.country && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  {competition.country.flagUrl && (
                    <Image
                      src={competition.country.flagUrl}
                      alt={competition.country.name}
                      width={14}
                      height={14}
                      className="h-3.5 w-3.5 rounded-sm object-cover"
                    />
                  )}
                  <span className="text-xs text-text-muted">{competition.country.name}</span>
                </div>
              )}
            </div>
          </div>
          {seasons && selectedSeasonId && (
            <SeasonSelector
              seasons={seasons}
              selectedSeasonId={selectedSeasonId}
              onSeasonChange={setSelectedSeasonId}
            />
          )}
        </div>
        <div className="border-t border-border">
          <Tabs tabs={competitionTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Standings Tab */}
      {activeTab === "standings" && (
        <div>
          {standingsLoading && <LoadingSkeleton rows={20} variant="table" />}
          {standingsError && (
            <ErrorState
              message="Failed to load standings"
              onRetry={() => refetchStandings()}
            />
          )}
          {!standingsLoading && !standingsError && standings && standings.length === 0 && (
            <EmptyState message="No standings available" />
          )}
          {standings && standings.length > 0 && (
            <StandingsTable standings={standings} />
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div className="space-y-3">
          {matchesLoading && <LoadingSkeleton rows={10} variant="match-list" />}
          {matchesError && (
            <ErrorState
              message="Failed to load matches"
              onRetry={() => refetchMatches()}
            />
          )}
          {!matchesLoading && !matchesError && matchdayGroups.length === 0 && (
            <EmptyState message="No matches available" />
          )}
          {matchdayGroups.map((group) => (
            <div key={group.matchday ?? "none"} className="overflow-hidden rounded-xl border border-border bg-bg-card">
              <div className="border-b border-border px-3 py-2">
                <span className="text-xs font-semibold text-text-muted">
                  {group.matchday ? `Matchday ${group.matchday}` : "Unscheduled"}
                </span>
              </div>
              <div className="divide-y divide-border">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
