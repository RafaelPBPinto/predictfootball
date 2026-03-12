import { IconType } from "react-icons";

interface EmptyStateProps {
  message?: string;
  icon?: IconType;
}

export function EmptyState({ message = "No data available", icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-bg-card p-8">
      {Icon && <Icon className="h-8 w-8 text-text-muted" />}
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
