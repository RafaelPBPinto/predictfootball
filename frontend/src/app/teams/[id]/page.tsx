"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTeam } from "@/hooks/use-teams";
import { useMatchesByTeam } from "@/hooks/use-matches";
import { usePlayersByTeam } from "@/hooks/use-players";
import { useTeamStats } from "@/hooks/use-stats";
import { usePlayerStatsByTeam } from "@/hooks/use-stats";
import { Tabs } from "@/components/ui/tabs";
import { MatchCard } from "@/components/match/match-card";
import { PlayerListItem } from "@/components/player/player-list-item";
import { TeamStatsGrid } from "@/components/stats/team-stats-grid";
import { PlayerStatsTable } from "@/components/stats/player-stats-table";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { MatchResponse, PlayerResponse, Position } from "@/types";

const teamTabs = [
  { key: "overview", label: "Overview" },
  { key: "matches", label: "Matches" },
  { key: "squad", label: "Squad" },
  { key: "stats", label: "Stats" },
];

const positionOrder: Position[] = ["GK", "DF", "MF", "FW"];
const positionLabels: Record<Position, string> = {
  GK: "Goalkeepers",
  DF: "Defenders",
  MF: "Midfielders",
  FW: "Forwards",
};

function getResultIndicator(match: MatchResponse, teamId: number): string {
  if (match.status !== "FINISHED") return "";
  const isHome = match.homeTeam.id === teamId;
  const teamScore = isHome ? match.homeScore! : match.awayScore!;
  const opponentScore = isHome ? match.awayScore! : match.homeScore!;
  if (teamScore > opponentScore) return "W";
  if (teamScore < opponentScore) return "L";
  return "D";
}

const resultBarColor: Record<string, string> = {
  W: "bg-win",
  D: "bg-draw",
  L: "bg-loss",
};

export default function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const teamId = Number(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [matchFilter, setMatchFilter] = useState<"all" | "home" | "away">("all");

  const { data: team, isLoading: teamLoading } = useTeam(teamId);
  const { data: matches, isLoading: matchesLoading } = useMatchesByTeam(teamId);
  const { data: players, isLoading: playersLoading } = usePlayersByTeam(teamId);

  const latestSeasonId = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    const finished = matches.filter((m) => m.status === "FINISHED");
    if (finished.length === 0) return matches[0].seasonId;
    const sorted = [...finished].sort(
      (a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
    );
    return sorted[0].seasonId;
  }, [matches]);

  const { data: teamStats } = useTeamStats(teamId, latestSeasonId!);
  const { data: playerStats } = usePlayerStatsByTeam(latestSeasonId!, teamId);

  const sortedMatches = useMemo(() => {
    if (!matches) return [];
    let filtered = matches;
    if (matchFilter === "home") filtered = matches.filter((m) => m.homeTeam.id === teamId);
    if (matchFilter === "away") filtered = matches.filter((m) => m.awayTeam.id === teamId);
    return [...filtered].sort(
      (a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
    );
  }, [matches, matchFilter, teamId]);

  const recentForm = useMemo(() => {
    if (!matches) return [];
    return matches
      .filter((m) => m.status === "FINISHED")
      .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
      .slice(0, 5);
  }, [matches]);

  const nextMatch = useMemo(() => {
    if (!matches) return null;
    const scheduled = matches
      .filter((m) => m.status === "SCHEDULED")
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    return scheduled[0] ?? null;
  }, [matches]);

  const groupedPlayers = useMemo(() => {
    if (!players) return [];
    const groups = positionOrder
      .map((pos) => ({
        position: pos,
        label: positionLabels[pos],
        players: players.filter((p) => p.position === pos),
      }))
      .filter((g) => g.players.length > 0);
    const other = players.filter(
      (p) => !p.position || !positionOrder.includes(p.position)
    );
    if (other.length > 0) {
      groups.push({ position: "FW" as Position, label: "Other", players: other });
    }
    return groups;
  }, [players]);

  if (teamLoading) return <LoadingSkeleton rows={10} />;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
        <div className="flex items-center gap-4 p-5 pb-4">
          <Avatar src={team?.logoUrl ?? null} alt={team?.name ?? ""} size="lg" rounded={false} />
          <div>
            <h1 className="text-xl font-bold text-text-primary">{team?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {team?.country?.flagUrl && (
                <Image
                  src={team.country.flagUrl}
                  alt={team.country.name}
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 rounded-sm object-cover"
                />
              )}
              <span className="text-xs text-text-muted">{team?.country?.name}</span>
              {team?.founded && (
                <span className="text-xs text-text-muted">· Est. {team.founded}</span>
              )}
              {team?.venue && (
                <span className="hidden text-xs text-text-muted sm:inline">· {team.venue}</span>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <Tabs tabs={teamTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {nextMatch && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Next Match</h3>
              <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
                <MatchCard match={nextMatch} />
              </div>
            </div>
          )}

          {recentForm.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Recent Form</h3>
              <div className="flex gap-1.5 mb-2">
                {recentForm.map((m) => {
                  const r = getResultIndicator(m, teamId);
                  const color = r === "W" ? "bg-win" : r === "L" ? "bg-loss" : "bg-draw";
                  return (
                    <span
                      key={m.id}
                      className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white ${color}`}
                    >
                      {r}
                    </span>
                  );
                })}
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-bg-card divide-y divide-border">
                {recentForm.map((m) => (
                  <div key={m.id} className="relative">
                    {resultBarColor[getResultIndicator(m, teamId)] && (
                      <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${resultBarColor[getResultIndicator(m, teamId)]}`} />
                    )}
                    <MatchCard match={m} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {teamStats && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Season Stats</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatCard label="Goals Scored" value={teamStats.goalsScored} />
                <StatCard label="Goals Conceded" value={teamStats.goalsConceded} />
                <StatCard label="Clean Sheets" value={teamStats.cleanSheets} />
                <StatCard label="xG" value={teamStats.xg?.toFixed(1) ?? "-"} />
                <StatCard label="xGA" value={teamStats.xga?.toFixed(1) ?? "-"} />
                <StatCard
                  label="Possession"
                  value={teamStats.avgPossession ? `${teamStats.avgPossession.toFixed(0)}%` : "-"}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["all", "home", "away"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setMatchFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  matchFilter === f
                    ? "bg-accent text-white"
                    : "bg-bg-card text-text-secondary hover:text-text-primary"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {matchesLoading && <LoadingSkeleton rows={10} variant="match-list" />}
          {!matchesLoading && sortedMatches.length === 0 && (
            <EmptyState message="No matches found" />
          )}
          {sortedMatches.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border bg-bg-card divide-y divide-border">
              {sortedMatches.map((m) => (
                <div key={m.id} className="relative">
                  {resultBarColor[getResultIndicator(m, teamId)] && (
                    <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${resultBarColor[getResultIndicator(m, teamId)]}`} />
                  )}
                  <MatchCard match={m} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Squad Tab */}
      {activeTab === "squad" && (
        <div className="space-y-3">
          {playersLoading && <LoadingSkeleton rows={15} />}
          {!playersLoading && groupedPlayers.length === 0 && (
            <EmptyState message="No squad data available" />
          )}
          {groupedPlayers.map((group) => (
            <div key={group.position} className="overflow-hidden rounded-xl border border-border bg-bg-card">
              <div className="border-b border-border px-4 py-2">
                <span className="text-xs font-semibold text-text-muted">{group.label}</span>
              </div>
              <div className="divide-y divide-border">
                {group.players.map((player) => (
                  <PlayerListItem key={player.id} player={player} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          {teamStats && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Team Stats</h3>
              <TeamStatsGrid stats={teamStats} />
            </div>
          )}
          {playerStats && playerStats.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Player Stats</h3>
              <PlayerStatsTable stats={playerStats} />
            </div>
          )}
          {!teamStats && !playerStats && (
            <EmptyState message="No stats available for this season" />
          )}
        </div>
      )}
    </div>
  );
}
