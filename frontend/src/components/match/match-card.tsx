import Link from "next/link";
import Image from "next/image";
import { MatchResponse } from "@/types";
import { MatchStatusBadge } from "@/components/ui/badge";

function TeamLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (!logoUrl) {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-secondary text-[10px] font-bold text-text-muted">
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <Image
      src={logoUrl}
      alt={name}
      width={24}
      height={24}
      className="h-6 w-6 object-contain"
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
      className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-bg-card-hover"
    >
      <div className="flex flex-1 items-center justify-end gap-2">
        <span className="text-sm text-text-primary text-right">
          {match.homeTeam.shortName || match.homeTeam.name}
        </span>
        <TeamLogo logoUrl={match.homeTeam.logoUrl} name={match.homeTeam.name} />
      </div>

      <div className="flex w-20 items-center justify-center gap-1">
        {isFinished ? (
          <span className="text-sm font-bold text-text-primary">
            {match.homeScore} - {match.awayScore}
          </span>
        ) : match.status === "SCHEDULED" ? (
          <span className="text-sm font-medium text-accent">
            {formatKickoff(match.kickoff)}
          </span>
        ) : (
          <MatchStatusBadge status={match.status} />
        )}
      </div>

      <div className="flex flex-1 items-center gap-2">
        <TeamLogo logoUrl={match.awayTeam.logoUrl} name={match.awayTeam.name} />
        <span className="text-sm text-text-primary">
          {match.awayTeam.shortName || match.awayTeam.name}
        </span>
      </div>

      {isFinished && (
        <div className="ml-2">
          <MatchStatusBadge status={match.status} />
        </div>
      )}
    </Link>
  );
}
