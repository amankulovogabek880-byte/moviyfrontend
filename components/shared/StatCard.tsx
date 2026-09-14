import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "danger" | "warning" | "success";
}) {
  const toneClass =
    tone === "danger"
      ? "text-danger"
      : tone === "warning"
        ? "text-warning"
        : tone === "success"
          ? "text-success"
          : "text-foreground";

  return (
    <div className="rounded-xl2 border border-border bg-background p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", toneClass)}>{value}</p>
    </div>
  );
}
