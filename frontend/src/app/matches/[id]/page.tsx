"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMatch } from "@/hooks/use-matches";
import { MatchInfo } from "@/components/match/match-info";
import { MatchStatusBadge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FiInfo } from "react-icons/fi";

function TeamLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (!logoUrl) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-lg font-bold text-text-muted">
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <Image
      src={logoUrl}
      alt={name}
      width={48}
      height={48}
      className="h-12 w-12 object-contain"
    />
  );
}

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const matchId = Number(id);

  const { data: match, isLoading } = useMatch(matchId);

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (!match) return <EmptyState message="Match not found" />;

  const isFinished = match.status === "FINISHED";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-xl border border-border bg-bg-card p-5">
        <div className="text-center mb-4">
          <Link
            href={`/competitions/${match.competitionId}`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
          >
            {match.competitionLogoUrl && (
              <Image
                src={match.competitionLogoUrl}
                alt={match.competitionName}
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
              />
            )}
            {match.competitionName}
            {match.matchday && (
              <span className="text-text-muted">· Matchday {match.matchday}</span>
            )}
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 py-2">
          <Link href={`/teams/${match.homeTeam.id}`} className="flex flex-col items-center gap-2 group">
            <TeamLogo logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} />
            <span className="text-sm font-medium text-text-primary group-hover:text-accent">
              {match.homeTeam.shortName || match.homeTeam.name}
            </span>
          </Link>

          <div className="flex flex-col items-center gap-1">
            {isFinished ? (
              <span className="text-4xl font-bold text-text-primary">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-lg font-medium text-accent">vs</span>
            )}
            <MatchStatusBadge status={match.status} />
          </div>

          <Link href={`/teams/${match.awayTeam.id}`} className="flex flex-col items-center gap-2 group">
            <TeamLogo logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} />
            <span className="text-sm font-medium text-text-primary group-hover:text-accent">
              {match.awayTeam.shortName || match.awayTeam.name}
            </span>
          </Link>
        </div>
      </div>

      {/* Match Info */}
      <MatchInfo match={match} />

      {/* Placeholder for events */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-bg-card p-8">
        <FiInfo className="h-6 w-6 text-text-muted" />
        <p className="text-sm text-text-muted">Match events coming soon</p>
      </div>
    </div>
  );
}
