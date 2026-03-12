import Link from "next/link";
import Image from "next/image";
import { MatchResponse } from "@/types";

function TeamLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (!logoUrl) {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated text-[9px] font-bold text-text-muted">
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <Image
      src={logoUrl}
      alt={name}
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
    />
  );
}

function formatKickoff(kickoff: string): string {
  return new Date(kickoff).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MatchCard({ match }: { match: MatchResponse }) {
  const isFinished = match.status === "FINISHED";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="flex h-11 items-center px-3 transition-colors hover:bg-bg-card-hover"
    >
      <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
        <span className="truncate text-right text-sm text-text-primary">
          {match.homeTeam.shortName || match.homeTeam.name}
        </span>
        <TeamLogo logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} />
      </div>

      <div className="flex w-16 shrink-0 items-center justify-center">
        {isFinished ? (
          <span className="text-sm font-bold text-text-primary">
            {match.homeScore} - {match.awayScore}
          </span>
        ) : match.status === "SCHEDULED" ? (
          <span className="text-xs font-medium text-accent">
            {formatKickoff(match.kickoff)}
          </span>
        ) : (
          <span className="text-xs font-medium text-yellow-card">
            {match.status === "POSTPONED" ? "PPD" : "CANC"}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <TeamLogo logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} />
        <span className="truncate text-sm text-text-primary">
          {match.awayTeam.shortName || match.awayTeam.name}
        </span>
      </div>

      {match.matchday && (
        <span className="ml-2 hidden text-[10px] text-text-muted sm:inline">
          MD{match.matchday}
        </span>
      )}
    </Link>
  );
}
