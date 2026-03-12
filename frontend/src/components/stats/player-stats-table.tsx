"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayerSeasonStatsResponse } from "@/types";

type SortKey = "appearances" | "goals" | "assists" | "minutesPlayed" | "yellowCards" | "redCards";

interface PlayerStatsTableProps {
  stats: PlayerSeasonStatsResponse[];
}

export function PlayerStatsTable({ stats }: PlayerStatsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("goals");

  const sorted = [...stats].sort((a, b) => b[sortKey] - a[sortKey]);

  const headers: { key: SortKey; label: string; hideOnMobile?: boolean }[] = [
    { key: "appearances", label: "App" },
    { key: "minutesPlayed", label: "Min", hideOnMobile: true },
    { key: "goals", label: "G" },
    { key: "assists", label: "A" },
    { key: "yellowCards", label: "YC", hideOnMobile: true },
    { key: "redCards", label: "RC", hideOnMobile: true },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-heavy text-text-muted">
            <th className="px-3 py-2.5 text-left text-xs font-medium">Player</th>
            {headers.map((h) => (
              <th
                key={h.key}
                onClick={() => setSortKey(h.key)}
                className={`cursor-pointer px-2 py-2.5 text-center text-xs font-medium transition-colors hover:text-accent ${
                  h.hideOnMobile ? "hidden sm:table-cell" : ""
                } ${sortKey === h.key ? "text-accent" : ""}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr
              key={s.id}
              className="border-b border-border transition-colors last:border-b-0 hover:bg-bg-card-hover"
            >
              <td className="px-3 py-2">
                <Link
                  href={`/players/${s.playerId}`}
                  className="text-sm font-medium text-text-primary hover:text-accent"
                >
                  {s.playerName}
                </Link>
              </td>
              <td className="px-2 py-2 text-center text-xs text-text-secondary">{s.appearances}</td>
              <td className="hidden px-2 py-2 text-center text-xs text-text-secondary sm:table-cell">{s.minutesPlayed}</td>
              <td className="px-2 py-2 text-center text-xs font-medium text-text-primary">{s.goals}</td>
              <td className="px-2 py-2 text-center text-xs text-text-secondary">{s.assists}</td>
              <td className="hidden px-2 py-2 text-center text-xs text-text-secondary sm:table-cell">{s.yellowCards}</td>
              <td className="hidden px-2 py-2 text-center text-xs text-text-secondary sm:table-cell">{s.redCards}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
