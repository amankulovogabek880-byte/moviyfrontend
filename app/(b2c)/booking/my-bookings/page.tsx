"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyBookings } from "@/hooks/b2c/useBooking";
import { t } from "@/lib/i18n";
import { formatDate, formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

/**
 * Lets a customer look up every booking made with their phone number,
 * without needing the exact booking number or a password — see
 * publicApi.getMyBookings (lib/api-client.ts) and the backend's
 * GET /public/bookings/my-bookings?phone= endpoint. Linked from the header
 * (components/b2c/Header.tsx) as "Mening bronlarim".
 */
export default function MyBookingsPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useMyBookings(submittedPhone);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = phoneInput.trim();
    if (!trimmed) return;
    setSubmittedPhone(trimmed);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold">{t("b2c.myBookings.title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("b2c.myBookings.hint")}</p>

      <form className="mt-6 flex items-end gap-2" onSubmit={handleSubmit}>
        <Input
          type="tel"
          required
          placeholder={t("b2c.myBookings.phonePlaceholder")}
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading}>
          {isLoading ? t("b2c.myBookings.searching") : t("b2c.myBookings.submit")}
        </Button>
      </form>

      {isLoading && (
        <div className="mt-6 flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-xl2" />
          <Skeleton className="h-20 w-full rounded-xl2" />
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <ErrorMessage
            message={error instanceof ApiError ? error.message : t("common.networkError")}
            onRetry={() => refetch()}
          />
        </div>
      )}

      {data && data.length === 0 && (
        <div className="mt-6">
          <EmptyState message={t("b2c.myBookings.empty")} />
        </div>
      )}

      {data && data.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {data.map((booking) => (
            <li key={booking.id}>
              <Link
                href={`/booking/${booking.bookingNumber}?contact=${encodeURIComponent(
                  submittedPhone ?? ""
                )}`}
                className="block rounded-xl2 border border-border p-4 transition-colors hover:border-accent hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{booking.tour.title}</span>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-muted">
                  <span>{formatDate(booking.departure.date)}</span>
                  <span>{formatUsd(booking.totalAmount)}</span>
                </div>
                <div className="mt-1 text-xs text-muted">#{booking.bookingNumber}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}