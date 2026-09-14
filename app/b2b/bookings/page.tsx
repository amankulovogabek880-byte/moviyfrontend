"use client";

import { useState } from "react";
import { BookingsTable } from "@/components/b2b/BookingsTable";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { Select } from "@/components/shared/Select";
import { useB2BBookings } from "@/hooks/b2b/useBookings";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { BookingStatus } from "@/types/booking";

const statuses: BookingStatus[] = [
  "PENDING_PAYMENT",
  "PARTIALLY_PAID",
  "PAID",
  "EXPIRED",
  "CANCELLED",
];

export default function B2BBookingsPage() {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useB2BBookings(status ? { status } : undefined);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("b2b.bookings.title")}</h1>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus | "")}
          className="w-56"
        >
          <option value="">{t("common.all")}</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {t(`bookingStatus.${s}`)}
            </option>
          ))}
        </Select>
      </div>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <BookingsTable bookings={data?.items ?? []} />
      )}
    </div>
  );
}
