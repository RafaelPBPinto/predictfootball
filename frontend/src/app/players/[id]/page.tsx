"use client";

import { use, useMemo } from "react";
import { usePlayer } from "@/hooks/use-players";
import { usePlayerStats } from "@/hooks/use-players";
import { useMatchesByTeam } from "@/hooks/use-matches";
import { PlayerHeader } from "@/components/player/player-header";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const playerId = Number(id);

  const { data: player, isLoading: playerLoading } = usePlayer(playerId);

  const teamId = player?.currentTeam?.id ?? 0;
  const { data: matches } = useMatchesByTeam(teamId);

  const latestSeasonId = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    const finished = matches.filter((m) => m.status === "FINISHED");
    if (finished.length === 0) return matches[0].seasonId;
    const sorted = [...finished].sort(
      (a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
    );
    return sorted[0].seasonId;
  }, [matches]);

  const { data: stats } = usePlayerStats(playerId, latestSeasonId!);

  if (playerLoading) return <LoadingSkeleton rows={8} />;
  if (!player) return <EmptyState message="Player not found" />;

  return (
    <div className="space-y-6">
      <PlayerHeader player={player} />

      {stats ? (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Season Stats
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <StatCard
              label="Appearances"
              value={stats.appearances}
              sub={`${stats.starts} starts`}
            />
            <StatCard label="Minutes" value={stats.minutesPlayed} />
            <StatCard
              label="Goals"
              value={stats.goals}
              sub={stats.penaltyGoals > 0 ? `${stats.penaltyGoals} pen` : null}
            />
            <StatCard label="Assists" value={stats.assists} />
            <StatCard label="Yellow Cards" value={stats.yellowCards} />
            <StatCard label="Red Cards" value={stats.redCards} />
            {stats.xg != null && (
              <StatCard label="xG" value={stats.xg.toFixed(2)} />
            )}
            {stats.xag != null && (
              <StatCard label="xAG" value={stats.xag.toFixed(2)} />
            )}
          </div>
        </div>
      ) : (
        latestSeasonId && (
          <EmptyState message="No stats available for this season" />
        )
      )}
    </div>
  );
}
