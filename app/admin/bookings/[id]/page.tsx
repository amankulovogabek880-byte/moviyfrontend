"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminBooking, useBookingNotifications } from "@/hooks/admin/useBookings";
import { CancelBookingModal } from "@/components/admin/CancelBookingModal";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { DownloadLink } from "@/components/shared/DownloadLink";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { t } from "@/lib/i18n";
import { formatDate, formatDateTime, formatUsd, isTripCompleted, remainingBalance } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

function NotificationsSection({ bookingId }: { bookingId: string }) {
  const { data, isLoading } = useBookingNotifications(bookingId);
  const entries = data?.items ?? [];

  return (
    <div className="mt-6 border-t border-border pt-6">
      <h2 className="mb-3 text-sm font-semibold">{t("admin.bookingDetail.notificationsSection")}</h2>
      {isLoading ? (
        <p className="text-sm text-muted">{t("common.loading")}</p>
      ) : entries.length === 0 ? (
        <EmptyState message={t("admin.bookingDetail.notificationsEmpty")} />
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-sm">
              <span>
                {entry.channel === "SMS"
                  ? t("admin.bookingDetail.notifChannelSms")
                  : t("admin.bookingDetail.notifChannelEmail")}{" "}
                · {entry.recipient}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-muted">{formatDateTime(entry.sentAt)}</span>
                <Badge tone={entry.status === "SUCCESS" ? "success" : "danger"}>
                  {entry.status === "SUCCESS"
                    ? t("admin.bookingDetail.notifStatusSuccess")
                    : t("admin.bookingDetail.notifStatusFailed")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [showCancel, setShowCancel] = useState(false);
  const { data: booking, isLoading, isError, error, refetch } = useAdminBooking(params.id);

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl2" />;
  if (isError || !booking) {
    return (
      <ErrorMessage
        message={error instanceof ApiError ? error.message : t("common.networkError")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/bookings" className="text-sm text-accent hover:underline">
          ← {t("admin.bookingDetail.backToList")}
        </Link>
      </div>

      <div className="rounded-xl2 border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">{t("b2c.booking.bookingNumberLabel")}</p>
            <p className="font-mono text-xl font-bold">{booking.bookingNumber}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="font-display text-lg font-semibold">{booking.tour.title}</p>
          <p className="text-sm text-muted">
            {formatDate(booking.departure.date)} · {booking.paxCount} {t("common.person")} ·{" "}
            {booking.channel}
            {booking.partnerCompanyName ? ` · ${booking.partnerCompanyName}` : ""}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
          <div>
            <p className="text-xs text-muted">{t("b2c.booking.totalAmount")}</p>
            <p className="font-semibold">{formatUsd(booking.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">{t("b2c.booking.paidAmount")}</p>
            <p className="font-semibold">{formatUsd(booking.paidAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">{t("b2c.booking.remainingAmount")}</p>
            <p className="font-semibold">{formatUsd(remainingBalance(booking))}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h2 className="mb-3 text-sm font-semibold">{t("admin.bookingDetail.contactSection")}</h2>
          <p className="text-sm">{booking.contact.fullName}</p>
          <p className="text-sm text-muted">
            {booking.contact.phone} · {booking.contact.email}
          </p>
        </div>

        {booking.travelers && (
          <div className="mt-6 border-t border-border pt-6">
            <h2 className="mb-3 text-sm font-semibold">{t("admin.bookingDetail.travelersSection")}</h2>
            <p className="text-sm">
              {t("admin.bookingDetail.adultsLabel")}: {booking.travelers.adultCount}
              {booking.travelers.childCount > 0 &&
                ` · ${t("admin.bookingDetail.childrenLabel")}: ${booking.travelers.childCount}`}
            </p>
            {booking.travelers.roomTypeName && (
              <p className="text-sm text-muted">
                {t("admin.bookingDetail.roomTypeLabel")}: {booking.travelers.roomTypeName}
              </p>
            )}
            {booking.travelers.addOns && booking.travelers.addOns.length > 0 && (
              <p className="text-sm text-muted">
                {t("admin.bookingDetail.addOnsLabel")}:{" "}
                {booking.travelers.addOns.map((a) => `${a.name} (+${formatUsd(a.price)})`).join(", ")}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 border-t border-border pt-6">
          <h2 className="mb-3 text-sm font-semibold">{t("admin.bookingDetail.documentsSection")}</h2>
          <div className="flex flex-wrap gap-3">
            <DownloadLink path={`admin/bookings/${booking.id}/invoice`}>
              {t("admin.bookingDetail.invoiceButton")}
            </DownloadLink>
            {isTripCompleted(booking) && (
              <DownloadLink path={`admin/bookings/${booking.id}/act`}>
                {t("admin.bookingDetail.actButton")}
              </DownloadLink>
            )}
          </div>
        </div>

        <NotificationsSection bookingId={booking.id} />

        <div className="mt-6 border-t border-border pt-6">
          {booking.status === "CANCELLED" ? (
            <p className="text-sm text-muted">{t("admin.bookingDetail.alreadyCancelled")}</p>
          ) : (
            <Button variant="danger" onClick={() => setShowCancel(true)}>
              {t("admin.bookingDetail.cancelButton")}
            </Button>
          )}
        </div>
      </div>

      {showCancel && <CancelBookingModal booking={booking} onClose={() => setShowCancel(false)} />}
    </div>
  );
}
