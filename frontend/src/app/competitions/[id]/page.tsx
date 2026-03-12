"use client";

import { use, useState, useEffect } from "react";
import { useCompetition } from "@/hooks/use-competitions";
import { useSeasons, useCurrentSeason } from "@/hooks/use-seasons";
import { useStandings } from "@/hooks/use-standings";
import { useMatchesBySeason } from "@/hooks/use-matches";
import { StandingsTable } from "@/components/standings/standings-table";
import { MatchCard } from "@/components/match/match-card";
import { SeasonSelector } from "@/components/ui/season-selector";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import Image from "next/image";

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const competitionId = Number(id);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);

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

  const recentMatches = matches
    ?.filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {competition?.logoUrl ? (
            <Image
              src={competition.logoUrl}
              alt={competition.name}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <div className="h-8 w-8 rounded bg-bg-secondary" />
          )}
          <h1 className="text-2xl font-bold text-text-primary">
            {competition?.name || "Competition"}
          </h1>
        </div>
        {seasons && selectedSeasonId && (
          <SeasonSelector
            seasons={seasons}
            selectedSeasonId={selectedSeasonId}
            onSeasonChange={setSelectedSeasonId}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Standings
          </h2>
          {standingsLoading && <LoadingSkeleton rows={20} />}
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

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Recent Results
          </h2>
          {matchesLoading && <LoadingSkeleton rows={10} />}
          {matchesError && (
            <ErrorState
              message="Failed to load matches"
              onRetry={() => refetchMatches()}
            />
          )}
          {!matchesLoading && !matchesError && (!recentMatches || recentMatches.length === 0) && (
            <EmptyState message="No recent results" />
          )}
          {recentMatches && recentMatches.length > 0 && (
            <div className="divide-y divide-border rounded-xl border border-border bg-bg-card">
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
