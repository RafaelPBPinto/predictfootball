import { TeamSeasonStatsResponse } from "@/types";
import { StatCard } from "@/components/ui/stat-card";

interface TeamStatsGridProps {
  stats: TeamSeasonStatsResponse;
}

export function TeamStatsGrid({ stats }: TeamStatsGridProps) {
  const items: { label: string; value: string | number; sub?: string | null }[] = [
    { label: "Goals Scored", value: stats.goalsScored },
    { label: "Goals Conceded", value: stats.goalsConceded },
    { label: "Clean Sheets", value: stats.cleanSheets },
    { label: "xG", value: stats.xg?.toFixed(1) ?? "-" },
    { label: "xGA", value: stats.xga?.toFixed(1) ?? "-" },
    { label: "Avg Possession", value: stats.avgPossession ? `${stats.avgPossession.toFixed(0)}%` : "-" },
    { label: "Shots/Game", value: stats.shotsPerGame?.toFixed(1) ?? "-" },
    { label: "Shots on Target", value: stats.shotsOnTargetPerGame?.toFixed(1) ?? "-" },
    { label: "Pass Accuracy", value: stats.passAccuracy ? `${stats.passAccuracy.toFixed(0)}%` : "-" },
    { label: "Tackles/Game", value: stats.tacklesPerGame?.toFixed(1) ?? "-" },
    { label: "Interceptions", value: stats.interceptions ?? "-" },
    { label: "Fouls/Game", value: stats.foulsPerGame?.toFixed(1) ?? "-" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <StatCard key={item.label} label={item.label} value={item.value} sub={item.sub} />
      ))}
    </div>
  );
}
