"use client";

import { cn, formatDate, formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { TourDeparture } from "@/types/tour";

export function DepartureList({
  departures,
  basePrice,
  selectedId,
  onSelect,
}: {
  departures: TourDeparture[];
  basePrice: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (departures.length === 0) {
    return <EmptyState message={t("b2c.tourDetail.noDepartures")} />;
  }

  const effectivePrices = departures.map((dep) => dep.price ?? basePrice);
  const showPerDatePrice = new Set(effectivePrices).size > 1;

  return (
    <div className="flex flex-col gap-2">
      {departures.map((dep, index) => {
        const soldOut = dep.remainingSeats <= 0;
        const urgent = !soldOut && dep.remainingSeats <= 3;
        return (
          <button
            key={dep.id}
            type="button"
            onClick={() => onSelect(dep.id)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
              selectedId === dep.id ? "border-accent bg-accent/5" : "border-border",
              soldOut && "opacity-70"
            )}
          >
            <span className="font-medium">
              {formatDate(dep.departureDate)}
              {showPerDatePrice && (
                <span className="ml-2 text-sm font-normal text-accent">
                  — {formatUsd(effectivePrices[index])}
                </span>
              )}
            </span>
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