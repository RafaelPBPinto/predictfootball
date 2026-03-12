"use client";

import { useState, useMemo } from "react";
import { useMatchesByDate } from "@/hooks/use-matches";
import { MatchResponse } from "@/types";
import { DateStrip } from "@/components/ui/date-strip";
import { MatchCardGroup } from "@/components/match/match-card-group";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { FiCalendar } from "react-icons/fi";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

interface CompetitionGroup {
  competitionId: number;
  competitionName: string;
  competitionLogoUrl: string | null;
  matches: MatchResponse[];
}

function groupByCompetition(matches: MatchResponse[]): CompetitionGroup[] {
  const map = new Map<number, CompetitionGroup>();

  for (const match of matches) {
    const existing = map.get(match.competitionId);
    if (existing) {
      existing.matches.push(match);
    } else {
      map.set(match.competitionId, {
        competitionId: match.competitionId,
        competitionName: match.competitionName,
        competitionLogoUrl: match.competitionLogoUrl,
        matches: [match],
      });
    }
  }

  return Array.from(map.values());
}

export default function HomePage() {
  const [date, setDate] = useState(todayString);
  const { data: matches, isLoading, isError, refetch } = useMatchesByDate(date);

  const groups = useMemo(
    () => (matches ? groupByCompetition(matches) : []),
    [matches]
  );

  return (
    <div className="space-y-4">
      <DateStrip date={date} onDateChange={setDate} />

      {isLoading && <LoadingSkeleton rows={6} variant="match-list" />}

      {isError && (
        <ErrorState
          message="Failed to load matches"
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && groups.length === 0 && (
        <EmptyState message="No matches on this date" icon={FiCalendar} />
      )}

      <div className="space-y-3">
        {groups.map((group) => (
          <MatchCardGroup
            key={group.competitionId}
            competitionId={group.competitionId}
            competitionName={group.competitionName}
            competitionLogoUrl={group.competitionLogoUrl}
            matches={group.matches}
          />
        ))}
      </div>
    </div>
  );
}
