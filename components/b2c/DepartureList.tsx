"use client";

import { cn, formatDate } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { TourDeparture } from "@/types/tour";

export function DepartureList({
  departures,
  selectedId,
  onSelect,
}: {
  departures: TourDeparture[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (departures.length === 0) {
    return <EmptyState message={t("b2c.tourDetail.noDepartures")} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {departures.map((dep) => {
        const soldOut = dep.remainingSeats <= 0;
        const urgent = !soldOut && dep.remainingSeats <= 3;
        return (
          <button
            key={dep.id}
            type="button"
            disabled={soldOut}
            onClick={() => onSelect(dep.id)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
              selectedId === dep.id ? "border-accent bg-accent/5" : "border-border",
              soldOut && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="font-medium">{formatDate(dep.date)}</span>
            {soldOut ? (
              <Badge tone="neutral">{t("b2c.tourDetail.soldOut")}</Badge>
            ) : urgent ? (
              <Badge tone="danger">{t("common.seatsUrgent", { count: dep.remainingSeats })}</Badge>
            ) : (
              <span className="text-sm text-muted">
                {dep.remainingSeats} {t("common.seatsLeft")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
