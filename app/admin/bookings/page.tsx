"use client";

import { useState } from "react";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { Select } from "@/components/shared/Select";
import { useAdminBookings } from "@/hooks/admin/useBookings";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { BookingChannel, BookingStatus } from "@/types/booking";

const statuses: BookingStatus[] = [
  "PENDING_PAYMENT",
  "PARTIALLY_PAID",
  "PAID",
  "EXPIRED",
  "CANCELLED",
];
const channels: BookingChannel[] = ["B2C", "B2B"];

export default function AdminBookingsPage() {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [channel, setChannel] = useState<BookingChannel | "">("");

  const { data, isLoading, isError, error, refetch } = useAdminBookings({
    status: status || undefined,
    channel: channel || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.bookings.title")}</h1>
        <div className="flex gap-3">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus | "")}
            className="w-52"
          >
            <option value="">{t("common.all")}</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {t(`bookingStatus.${s}`)}
              </option>
            ))}
          </Select>
          <Select
            value={channel}
            onChange={(e) => setChannel(e.target.value as BookingChannel | "")}
            className="w-40"
          >
            <option value="">{t("common.all")}</option>
            {channels.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <AdminBookingsTable bookings={data?.items ?? []} />
      )}
    </div>
  );
}
