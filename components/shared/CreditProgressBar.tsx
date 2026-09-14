import { cn, formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function CreditProgressBar({ limit, used }: { limit: number; used: number }) {
  const ratio = limit > 0 ? Math.min(1, used / limit) : 0;
  const tone = ratio >= 1 ? "bg-danger" : ratio >= 0.75 ? "bg-warning" : "bg-accent";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <div
          className={cn("h-full rounded-full transition-all", tone)}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted">
        {t("admin.partnerForm.creditUsedLabel")} {formatUsd(used)} / {t("admin.partnerForm.creditLimitOfLabel")}{" "}
        {formatUsd(limit)}
      </p>
    </div>
  );
}
