import Image from "next/image";
import Link from "next/link";
import { MatchResponse } from "@/types";
import { MatchCard } from "./match-card";

interface MatchCardGroupProps {
  competitionId: number;
  competitionName: string;
  competitionLogoUrl: string | null;
  matches: MatchResponse[];
}

export function MatchCardGroup({
  competitionId,
  competitionName,
  competitionLogoUrl,
  matches,
}: MatchCardGroupProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
      <Link
        href={`/competitions/${competitionId}`}
        className="flex items-center gap-2.5 border-b border-border px-3 py-2 transition-colors hover:bg-bg-card-hover"
      >
        {competitionLogoUrl ? (
          <Image
            src={competitionLogoUrl}
            alt={competitionName}
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        ) : (
          <div className="h-4 w-4 rounded bg-bg-elevated" />
        )}
        <span className="text-xs font-semibold text-text-secondary">
          {competitionName}
        </span>
      </Link>
      <div className="divide-y divide-border">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
