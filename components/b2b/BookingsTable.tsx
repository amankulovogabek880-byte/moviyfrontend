import Link from "next/link";
import { formatDate, formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Booking } from "@/types/booking";

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return <EmptyState message={t("common.noResults")} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-3 py-2">{t("b2b.bookings.colNumber")}</th>
            <th className="px-3 py-2">{t("b2b.bookings.colTour")}</th>
            <th className="px-3 py-2">{t("b2b.bookings.colDate")}</th>
            <th className="px-3 py-2">{t("b2b.bookings.colStatus")}</th>
            <th className="px-3 py-2">{t("b2b.bookings.colTotal")}</th>
            <th className="px-3 py-2">{t("b2b.bookings.colPaid")}</th>
            <th className="px-3 py-2">{t("b2b.bookings.colCreatedBy")}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t border-border hover:bg-surface/50">
              <td className="px-3 py-2">
                <Link
                  href={`/b2b/bookings/${b.bookingNumber}`}
                  className="font-mono text-accent hover:underline"
                >
                  {b.bookingNumber}
                </Link>
              </td>
              <td className="px-3 py-2">{b.tour.title}</td>
              <td className="px-3 py-2">{formatDate(b.departure.date)}</td>
              <td className="px-3 py-2">
                <BookingStatusBadge status={b.status} />
              </td>
              <td className="px-3 py-2">{formatUsd(b.totalAmount)}</td>
              <td className="px-3 py-2">{formatUsd(b.paidAmount)}</td>
              <td className="px-3 py-2 text-muted">{b.createdByName ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
