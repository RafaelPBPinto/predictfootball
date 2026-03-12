import Image from "next/image";
import Link from "next/link";
import { PlayerResponse } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { PositionBadge } from "@/components/ui/position-badge";

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export function PlayerHeader({ player }: { player: PlayerResponse }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-bg-card p-5">
      <Avatar
        src={player.photoUrl}
        alt={player.name}
        size="lg"
        fallback={player.name.charAt(0)}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-text-primary">{player.name}</h1>
          {player.shirtNumber && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-elevated text-xs font-bold text-text-muted">
              {player.shirtNumber}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {player.position && <PositionBadge position={player.position} />}
          {player.currentTeam && (
            <Link
              href={`/teams/${player.currentTeam.id}`}
              className="flex items-center gap-1.5 hover:text-accent"
            >
              {player.currentTeam.logoUrl && (
                <Image
                  src={player.currentTeam.logoUrl}
                  alt={player.currentTeam.name}
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
              )}
              <span className="text-sm text-text-secondary">{player.currentTeam.name}</span>
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
          {player.nationality && (
            <span className="flex items-center gap-1">
              {player.nationality.flagUrl && (
                <Image
                  src={player.nationality.flagUrl}
                  alt={player.nationality.name}
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 rounded-sm object-cover"
                />
              )}
              {player.nationality.name}
            </span>
          )}
          {player.dateOfBirth && (
            <span>Age: {calculateAge(player.dateOfBirth)}</span>
          )}
          {player.height && <span>{player.height} cm</span>}
          {player.weight && <span>{player.weight} kg</span>}
        </div>
      </div>
    </div>
  );
}
