"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCalendar, FiGrid, FiShield, FiSun, FiMoon } from "react-icons/fi";
import { useThemeContext } from "@/components/providers/theme-provider";

const tabs = [
  { label: "Matches", icon: FiCalendar, href: "/" },
  { label: "Competitions", icon: FiGrid, href: "/competitions" },
  { label: "Teams", icon: FiShield, href: "/teams" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/90 backdrop-blur-sm md:hidden">
      <div className="flex h-14 items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                isActive ? "text-accent" : "text-text-muted"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-text-muted"
        >
          {theme === "dark" ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
          <span className="text-[10px] font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
}
