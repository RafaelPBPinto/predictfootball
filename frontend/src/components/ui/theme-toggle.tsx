"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useThemeContext } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 transition-colors hover:bg-bg-card-hover"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5 text-text-secondary" />
      ) : (
        <FiMoon className="h-5 w-5 text-text-secondary" />
      )}
    </button>
  );
}
