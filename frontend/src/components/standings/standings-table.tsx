import Image from "next/image";
import Link from "next/link";
import { StandingResponse } from "@/types";
import { FormIndicator } from "./form-indicator";

interface StandingsTableProps {
  standings: StandingResponse[];
}

function getZoneColor(position: number, total: number): string | null {
  if (position === 1) return "bg-win";
  if (position === 2) return "bg-yellow-card";
  if (position === 3) return "bg-zone-cl";
  if (position === 4) return "bg-zone-cl-qual";
  if (position === total - 2) return "bg-zone-relegation-playoff";
  if (position > total - 2) return "bg-loss";
  return null;
}

export function StandingsTable({ standings }: StandingsTableProps) {
  const total = standings.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-heavy text-text-muted">
            <th className="sticky left-0 bg-bg-card px-2 py-2.5 text-left text-xs font-medium w-8">#</th>
            <th className="sticky left-8 bg-bg-card px-2 py-2.5 text-left text-xs font-medium">Team</th>
            <th className="px-2 py-2.5 text-center text-xs font-medium w-8">P</th>
            <th className="hidden px-2 py-2.5 text-center text-xs font-medium w-8 sm:table-cell">W</th>
            <th className="hidden px-2 py-2.5 text-center text-xs font-medium w-8 sm:table-cell">D</th>
            <th className="hidden px-2 py-2.5 text-center text-xs font-medium w-8 sm:table-cell">L</th>
            <th className="hidden px-2 py-2.5 text-center text-xs font-medium w-8 lg:table-cell">GF</th>
            <th className="hidden px-2 py-2.5 text-center text-xs font-medium w-8 lg:table-cell">GA</th>
            <th className="px-2 py-2.5 text-center text-xs font-medium w-8">GD</th>
            <th className="px-2 py-2.5 text-center text-xs font-medium w-10">Pts</th>
            <th className="hidden px-2 py-2.5 text-center text-xs font-medium md:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const zoneColor = getZoneColor(s.position, total);
            return (
              <tr
                key={s.id}
                className="border-b border-border transition-colors last:border-b-0 hover:bg-bg-card-hover"
              >
                <td className="sticky left-0 bg-bg-card px-2 py-2 text-xs text-text-muted relative">
                  {zoneColor && (
                    <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${zoneColor}`} />
                  )}
                  {s.position}
                </td>
                <td className="sticky left-8 bg-bg-card px-2 py-2">
                  <Link
                    href={`/teams/${s.team.id}`}
                    className="flex items-center gap-2 hover:text-accent"
                  >
                    {s.team.logoUrl ? (
                      <Image
                        src={s.team.logoUrl}
                        alt={s.team.name}
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] object-contain"
                      />
                    ) : (
                      <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-bg-elevated text-[7px] font-bold text-text-muted">
                        {s.team.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-text-primary">
                      {s.team.shortName || s.team.name}
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-2 text-center text-xs text-text-secondary">{s.played}</td>
                <td className="hidden px-2 py-2 text-center text-xs text-text-secondary sm:table-cell">{s.won}</td>
                <td className="hidden px-2 py-2 text-center text-xs text-text-secondary sm:table-cell">{s.drawn}</td>
                <td className="hidden px-2 py-2 text-center text-xs text-text-secondary sm:table-cell">{s.lost}</td>
                <td className="hidden px-2 py-2 text-center text-xs text-text-secondary lg:table-cell">{s.goalsFor}</td>
                <td className="hidden px-2 py-2 text-center text-xs text-text-secondary lg:table-cell">{s.goalsAgainst}</td>
                <td className="px-2 py-2 text-center text-xs text-text-secondary">
                  {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                </td>
                <td className="px-2 py-2 text-center text-sm font-bold text-text-primary">{s.points}</td>
                <td className="hidden px-2 py-2 md:table-cell">
                  <div className="flex justify-center">
                    <FormIndicator form={s.form} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
