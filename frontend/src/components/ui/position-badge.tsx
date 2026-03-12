import { Position } from "@/types";

const positionConfig: Record<Position, { bg: string; text: string }> = {
  GK: { bg: "bg-yellow-card/20", text: "text-yellow-card" },
  DF: { bg: "bg-accent/20", text: "text-accent" },
  MF: { bg: "bg-win/20", text: "text-win" },
  FW: { bg: "bg-loss/20", text: "text-loss" },
};

export function PositionBadge({ position }: { position: Position }) {
  const config = positionConfig[position];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${config.bg} ${config.text}`}
    >
      {position}
    </span>
  );
}
