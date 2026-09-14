"use client";

import { useState } from "react";
import { formatUsd, remainingBalance } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/shared/Badge";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { MarkPaidModal } from "./MarkPaidModal";
import type { Booking } from "@/types/booking";

export function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  const [modal, setModal] = useState<{ booking: Booking; mode: "paid" | "unpaid" } | null>(null);

  if (bookings.length === 0) return <EmptyState message={t("common.noResults")} />;

  return (
    <>
      <div className="overflow-x-auto rounded-xl2 border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">{t("admin.bookings.colNumber")}</th>
              <th className="px-3 py-2">{t("admin.bookings.colChannel")}</th>
              <th className="px-3 py-2">{t("admin.bookings.colPartner")}</th>
              <th className="px-3 py-2">{t("admin.bookings.colTour")}</th>
              <th className="px-3 py-2">{t("admin.bookings.colStatus")}</th>
              <th className="px-3 py-2">{t("admin.bookings.colTotal")}</th>
              <th className="px-3 py-2">{t("admin.bookings.colRemaining")}</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-surface/50">
                <td className="px-3 py-2 font-mono">{b.bookingNumber}</td>
                <td className="px-3 py-2">
                  <Badge tone={b.channel === "B2B" ? "accent" : "neutral"}>{b.channel}</Badge>
                </td>
                <td className="px-3 py-2 text-muted">{b.partnerCompanyName ?? "—"}</td>
                <td className="px-3 py-2">{b.tour.title}</td>
                <td className="px-3 py-2">
                  <BookingStatusBadge status={b.status} />
                </td>
                <td className="px-3 py-2">{formatUsd(b.totalAmount)}</td>
                <td className="px-3 py-2">{formatUsd(remainingBalance(b))}</td>
                <td className="px-3 py-2 text-right">
                  {b.status !== "PAID" && b.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setModal({ booking: b, mode: "paid" })}
                    >
                      {t("admin.bookings.markPaid")}
                    </Button>
                  )}
                  {(b.status === "PAID" || b.status === "PARTIALLY_PAID") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setModal({ booking: b, mode: "unpaid" })}
                    >
                      {t("admin.bookings.markUnpaid")}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <MarkPaidModal
          booking={modal.booking}
          mode={modal.mode}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
