export function EmptyState({ message = "No data available" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-bg-card p-8">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
