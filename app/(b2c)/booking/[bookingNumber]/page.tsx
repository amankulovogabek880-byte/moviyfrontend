"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CountdownTimer } from "@/components/b2c/CountdownTimer";
import { PaySection } from "@/components/b2c/PaySection";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useBooking } from "@/hooks/b2c/useBooking";
import { t } from "@/lib/i18n";
import { formatDate, formatUsd, isTripCompleted, remainingBalance } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

export default function BookingStatusPage() {
  const params = useParams<{ bookingNumber: string }>();
  const queryClient = useQueryClient();
  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useBooking(params.bookingNumber);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Skeleton className="h-64 w-full rounded-xl2" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const canPay = booking.status === "PENDING_PAYMENT" || booking.status === "PARTIALLY_PAID";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
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
            {formatDate(booking.departure.date)} · {booking.paxCount} {t("common.person")}
          </p>
        </div>

        {booking.priceBreakdown && booking.priceBreakdown.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <div className="flex flex-col gap-1 text-sm">
              {booking.priceBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted">{item.label}</span>
                  <span>{formatUsd(item.amount)}</span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-border pt-1 font-semibold">
                <span>{t("b2c.booking.totalAmount")}</span>
                <span>{formatUsd(booking.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

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

        {canPay && (
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
            {booking.expiresAt && (
              <CountdownTimer
                expiresAt={booking.expiresAt}
                onExpire={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["b2c", "booking", booking.bookingNumber],
                  })
                }
              />
            )}
            <PaySection booking={booking} />
          </div>
        )}

        {booking.status === "PAID" && (
          <div className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-6 text-center">
            <Link
              href={`/booking/${booking.bookingNumber}/success`}
              className="text-accent hover:underline"
            >
              {t("b2c.success.viewBooking")}
            </Link>
            {isTripCompleted(booking) && (
              <Link
                href={`/booking/${booking.bookingNumber}/review`}
                className="text-accent hover:underline"
              >
                {t("b2c.reviews.leaveReviewLink")}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
