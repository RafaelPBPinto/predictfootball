import { MatchStatus } from "@/types";

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  FINISHED: { label: "FT", className: "text-text-muted" },
  SCHEDULED: { label: "SCH", className: "text-accent" },
  POSTPONED: { label: "POSTP", className: "text-yellow-card" },
  CANCELLED: { label: "CANC", className: "text-red-card" },
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const config = statusConfig[status];

  return (
    <span className={`text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
