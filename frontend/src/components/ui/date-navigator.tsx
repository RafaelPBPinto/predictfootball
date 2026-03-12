"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface DateNavigatorProps {
  date: string;
  onDateChange: (date: string) => void;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const diff = date.getTime() - today.getTime();
  const daysDiff = Math.round(diff / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) return "Today";
  if (daysDiff === -1) return "Yesterday";
  if (daysDiff === 1) return "Tomorrow";

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function shiftDate(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T12:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onDateChange(shiftDate(date, -1))}
        className="rounded-lg p-2 transition-colors hover:bg-bg-card-hover"
      >
        <FiChevronLeft className="h-5 w-5 text-text-secondary" />
      </button>
      <span className="min-w-[120px] text-center text-sm font-semibold text-text-primary">
        {formatDateLabel(date)}
      </span>
      <button
        onClick={() => onDateChange(shiftDate(date, 1))}
        className="rounded-lg p-2 transition-colors hover:bg-bg-card-hover"
      >
        <FiChevronRight className="h-5 w-5 text-text-secondary" />
      </button>
    </div>
  );
}
