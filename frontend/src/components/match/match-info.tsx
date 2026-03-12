import { FiMapPin, FiUser, FiClock } from "react-icons/fi";
import { MatchResponse } from "@/types";

export function MatchInfo({ match }: { match: MatchResponse }) {
  const items: { icon: typeof FiMapPin; label: string; value: string }[] = [];

  if (match.venue) {
    items.push({ icon: FiMapPin, label: "Venue", value: match.venue });
  }
  if (match.referee) {
    items.push({ icon: FiUser, label: "Referee", value: match.referee });
  }

  const kickoff = new Date(match.kickoff).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  items.push({ icon: FiClock, label: "Kickoff", value: kickoff });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3"
        >
          <item.icon className="h-4 w-4 shrink-0 text-text-muted" />
          <div>
            <p className="text-[10px] uppercase text-text-muted">{item.label}</p>
            <p className="text-sm text-text-primary">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
