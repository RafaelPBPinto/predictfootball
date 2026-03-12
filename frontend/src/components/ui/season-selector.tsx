"use client";

import { SeasonResponse } from "@/types";

interface SeasonSelectorProps {
  seasons: SeasonResponse[];
  selectedSeasonId: number;
  onSeasonChange: (seasonId: number) => void;
}

function formatSeasonYear(year: number): string {
  return `${year}/${(year + 1).toString().slice(-2)}`;
}

export function SeasonSelector({
  seasons,
  selectedSeasonId,
  onSeasonChange,
}: SeasonSelectorProps) {
  return (
    <select
      value={selectedSeasonId}
      onChange={(e) => onSeasonChange(Number(e.target.value))}
      className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
    >
      {seasons.map((season) => (
        <option key={season.id} value={season.id}>
          {formatSeasonYear(season.year)}
        </option>
      ))}
    </select>
  );
}
