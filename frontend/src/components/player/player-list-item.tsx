import Link from "next/link";
import Image from "next/image";
import { PlayerResponse } from "@/types";
import { PositionBadge } from "@/components/ui/position-badge";

export function PlayerListItem({ player }: { player: PlayerResponse }) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-bg-card-hover"
    >
      {player.photoUrl ? (
        <Image
          src={player.photoUrl}
          alt={player.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated text-xs font-bold text-text-muted">
          {player.name.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-text-primary">{player.name}</span>
      </div>
      {player.shirtNumber && (
        <span className="text-xs text-text-muted">#{player.shirtNumber}</span>
      )}
      {player.nationality?.flagUrl && (
        <Image
          src={player.nationality.flagUrl}
          alt={player.nationality.name}
          width={16}
          height={16}
          className="h-4 w-4 rounded-sm object-cover"
        />
      )}
      {player.position && <PositionBadge position={player.position} />}
    </Link>
  );
}
