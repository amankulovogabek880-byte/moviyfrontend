"use client";

import { Fragment, useState } from "react";
import { formatDate } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { PriceCell } from "./PriceCell";
import { InlineBookingForm } from "./InlineBookingForm";
import type { B2BTourListItem, TourDeparture } from "@/types/tour";

interface Row {
  tour: B2BTourListItem;
  departure: TourDeparture;
}

export function ToursTable({ tours }: { tours: B2BTourListItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows: Row[] = tours.flatMap((tour) =>
    tour.departures.map((departure) => ({ tour, departure }))
  );

  if (rows.length === 0) {
    return <EmptyState message={t("common.noResults")} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-3 py-2">{t("b2b.tours.colTour")}</th>
            <th className="px-3 py-2">{t("b2b.tours.colDestination")}</th>
            <th className="px-3 py-2">{t("b2b.tours.colDeparture")}</th>
            <th className="px-3 py-2">{t("b2b.tours.colSeats")}</th>
            <th className="px-3 py-2">{t("b2b.tours.colPrice")}</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = row.departure.id;
            const soldOut = row.departure.remainingSeats <= 0;
            const urgent = !soldOut && row.departure.remainingSeats <= 3;
            const isExpanded = expandedId === rowKey;
            return (
              <Fragment key={rowKey}>
                <tr className="border-t border-border hover:bg-surface/50">
                  <td className="px-3 py-2 font-medium">{row.tour.title}</td>
                  <td className="px-3 py-2 text-muted">{row.tour.destination}</td>
                  <td className="px-3 py-2">{formatDate(row.departure.departureDate)}</td>
                  <td className="px-3 py-2">
                    {soldOut ? (
                      <Badge tone="neutral">0</Badge>
                    ) : urgent ? (
                      <Badge tone="danger">{row.departure.remainingSeats}</Badge>
                    ) : (
                      row.departure.remainingSeats
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {(() => {
                      const rowBasePrice = row.departure.price ?? row.tour.basePrice;
                      const rowDiscountedPrice =
                        rowBasePrice * (1 - row.tour.discountPercent / 100);
                      return (
                        <PriceCell
                          basePrice={rowBasePrice}
                          discountedPrice={rowDiscountedPrice}
                          isCustom={row.tour.hasCustomDiscount}
                        />
                      );
                    })()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      size="sm"
                      variant={isExpanded ? "secondary" : "primary"}
                      disabled={soldOut}
                      onClick={() => setExpandedId(isExpanded ? null : rowKey)}
                    >
                      {t("b2b.tours.bookAction")}
                    </Button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-t border-border bg-surface/40">
                    <td colSpan={6} className="px-3 py-3">
                      <InlineBookingForm
                        departureId={row.departure.id}
                        maxPax={row.departure.remainingSeats}
                        onDone={() => setExpandedId(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}