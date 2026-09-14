"use client";

import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CountdownTimer } from "@/components/b2c/CountdownTimer";
import { PaySection } from "@/components/b2c/PaySection";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useB2BBooking } from "@/hooks/b2b/useBookings";
import { t } from "@/lib/i18n";
import { formatDate, formatUsd, remainingBalance } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

export default function B2BBookingDetailPage() {
  const params = useParams<{ bookingNumber: string }>();
  const queryClient = useQueryClient();
  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useB2BBooking(params.bookingNumber);

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl2" />;

  if (isError || !booking) {
    return (
      <ErrorMessage
        message={error instanceof ApiError ? error.message : t("common.networkError")}
        onRetry={() => refetch()}
      />
    );
  }

  const canPay = booking.status === "PENDING_PAYMENT" || booking.status === "PARTIALLY_PAID";

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">{t("b2b.bookingDetail.title")}</h1>
      <div className="rounded-xl2 border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">{t("b2c.booking.bookingNumberLabel")}</p>
            <p className="font-mono text-lg font-bold">{booking.bookingNumber}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="font-semibold">{booking.tour.title}</p>
          <p className="text-sm text-muted">
            {formatDate(booking.departure.date)} · {booking.paxCount} {t("common.person")}
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

        {canPay && (
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
            {booking.expiresAt && (
              <CountdownTimer
                expiresAt={booking.expiresAt}
                onExpire={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["b2b", "booking", booking.bookingNumber],
                  })
                }
              />
            )}
            <PaySection booking={booking} />
          </div>
        )}
      </div>
    </div>
  );
}
