"use client";

import { useRef, useEffect } from "react";

interface DateStripProps {
  date: string;
  onDateChange: (date: string) => void;
}

function getDays(centerDate: string, range: number = 7): string[] {
  const days: string[] = [];
  const center = new Date(centerDate + "T12:00:00");
  for (let i = -range; i <= range; i++) {
    const d = new Date(center);
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDay(dateStr: string): { abbr: string; num: string; isToday: boolean } {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const isToday = dateStr === today.toISOString().split("T")[0];
  const abbr = isToday
    ? "Today"
    : date.toLocaleDateString("en-GB", { weekday: "short" });
  const num = date.getDate().toString();
  return { abbr, num, isToday };
}

export function DateStrip({ date, onDateChange }: DateStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [date]);

  const days = getDays(date);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar flex gap-1 overflow-x-auto py-1"
    >
      {days.map((d) => {
        const { abbr, num, isToday } = formatDay(d);
        const isActive = d === date;
        return (
          <button
            key={d}
            ref={isActive ? activeRef : undefined}
            onClick={() => onDateChange(d)}
            className={`flex shrink-0 flex-col items-center rounded-lg px-3 py-1.5 transition-colors ${
              isActive
                ? "bg-accent text-white"
                : isToday
                ? "bg-bg-card text-accent"
                : "text-text-secondary hover:bg-bg-card"
            }`}
          >
            <span className="text-[10px] font-medium uppercase">{abbr}</span>
            <span className="text-sm font-bold">{num}</span>
          </button>
        );
      })}
    </div>
  );
}
