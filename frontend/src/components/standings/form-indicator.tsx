const resultColors: Record<string, string> = {
  W: "bg-win",
  D: "bg-draw",
  L: "bg-loss",
};

export function FormIndicator({ form }: { form: string | null }) {
  if (!form) return <span className="text-text-muted">-</span>;

  return (
    <div className="flex items-center gap-1">
      {form.split("").map((result, i) => (
        <span
          key={i}
          className={`inline-block h-2 w-2 rounded-full ${resultColors[result] || "bg-text-muted"}`}
          title={result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"}
        />
      ))}
    </div>
  );
}
