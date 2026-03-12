import Image from "next/image";
import Link from "next/link";
import { StandingResponse } from "@/types";
import { FormIndicator } from "./form-indicator";

interface StandingsTableProps {
  standings: StandingResponse[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="px-3 py-3 text-left font-medium">#</th>
            <th className="px-3 py-3 text-left font-medium">Team</th>
            <th className="px-3 py-3 text-center font-medium">P</th>
            <th className="px-3 py-3 text-center font-medium">W</th>
            <th className="px-3 py-3 text-center font-medium">D</th>
            <th className="px-3 py-3 text-center font-medium">L</th>
            <th className="hidden px-3 py-3 text-center font-medium lg:table-cell">GF</th>
            <th className="hidden px-3 py-3 text-center font-medium lg:table-cell">GA</th>
            <th className="px-3 py-3 text-center font-medium">GD</th>
            <th className="px-3 py-3 text-center font-medium">Pts</th>
            <th className="hidden px-3 py-3 text-center font-medium md:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr
              key={standing.id}
              className="border-b border-border transition-colors last:border-b-0 hover:bg-bg-card-hover"
            >
              <td className="px-3 py-2.5 text-text-muted">{standing.position}</td>
              <td className="px-3 py-2.5">
                <Link
                  href={`/teams/${standing.team.id}`}
                  className="flex items-center gap-2 hover:text-accent"
                >
                  {standing.team.logoUrl ? (
                    <Image
                      src={standing.team.logoUrl}
                      alt={standing.team.name}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-secondary text-[8px] font-bold text-text-muted">
                      {standing.team.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-text-primary">
                    {standing.team.shortName || standing.team.name}
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2.5 text-center text-text-secondary">{standing.played}</td>
              <td className="px-3 py-2.5 text-center text-text-secondary">{standing.won}</td>
              <td className="px-3 py-2.5 text-center text-text-secondary">{standing.drawn}</td>
              <td className="px-3 py-2.5 text-center text-text-secondary">{standing.lost}</td>
              <td className="hidden px-3 py-2.5 text-center text-text-secondary lg:table-cell">{standing.goalsFor}</td>
              <td className="hidden px-3 py-2.5 text-center text-text-secondary lg:table-cell">{standing.goalsAgainst}</td>
              <td className="px-3 py-2.5 text-center text-text-secondary">
                {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
              </td>
              <td className="px-3 py-2.5 text-center font-bold text-text-primary">{standing.points}</td>
              <td className="hidden px-3 py-2.5 md:table-cell">
                <div className="flex justify-center">
                  <FormIndicator form={standing.form} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
