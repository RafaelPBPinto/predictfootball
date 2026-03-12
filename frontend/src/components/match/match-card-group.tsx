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
    <div className="rounded-xl border border-border bg-bg-card">
      <Link
        href={`/competitions/${competitionId}`}
        className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-bg-card-hover"
      >
        {competitionLogoUrl ? (
          <Image
            src={competitionLogoUrl}
            alt={competitionName}
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
        ) : (
          <div className="h-5 w-5 rounded bg-bg-secondary" />
        )}
        <span className="text-sm font-semibold text-text-primary">
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
