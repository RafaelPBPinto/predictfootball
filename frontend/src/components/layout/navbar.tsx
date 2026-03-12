"use client";

import Link from "next/link";
import { FiActivity } from "react-icons/fi";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <FiActivity className="h-5 w-5 text-accent" />
          <span className="hidden text-base font-bold text-text-primary sm:inline">
            PredictFootball
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
