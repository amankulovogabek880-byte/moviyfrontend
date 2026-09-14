"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingContactSchema, type BookingContactFormValues } from "@/lib/schemas/booking";
import { useCreateB2BBooking } from "@/hooks/b2b/useBookings";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export function InlineBookingForm({
  departureId,
  maxPax,
  onDone,
}: {
  departureId: string;
  maxPax: number;
  onDone: () => void;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createBooking = useCreateB2BBooking();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: { paxCount: 1 },
  });

  async function onSubmit(values: BookingContactFormValues) {
    if (values.paxCount > maxPax) {
      setError(t("b2c.tourDetail.notEnoughSeats"));
      return;
    }
    setError(null);
    try {
      const res = await createBooking.mutateAsync({
        tourDepartureId: departureId,
        paxCount: values.paxCount,
        contact: { fullName: values.fullName, phone: values.phone, email: values.email },
      });
      setResult(res.bookingNumber);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  if (result) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span>
          {t("b2b.tours.bookAction")}: <span className="font-mono font-semibold">{result}</span>
        </span>
        <div className="flex gap-3">
          <Link href={`/b2b/bookings/${result}`} className="text-accent hover:underline">
            {t("common.viewDetails")}
          </Link>
          <Button size="sm" variant="outline" type="button" onClick={onDone}>
            {t("common.close")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
      {error && <p className="w-full text-sm text-danger">{error}</p>}
      <Input
        label={t("b2c.booking.fullName")}
        error={errors.fullName?.message}
        {...register("fullName")}
        className="h-9 w-48"
      />
      <Input
        label={t("b2c.booking.phone")}
        error={errors.phone?.message}
        {...register("phone")}
        className="h-9 w-40"
      />
      <Input
        label={t("b2c.booking.email")}
        type="email"
        error={errors.email?.message}
        {...register("email")}
        className="h-9 w-52"
      />
      <Input
        label={t("b2b.tours.pax")}
        type="number"
        min={1}
        max={maxPax}
        error={errors.paxCount?.message}
        {...register("paxCount", { valueAsNumber: true })}
        className="h-9 w-20"
      />
      <Button type="submit" size="sm" isLoading={createBooking.isPending}>
        {t("common.confirm")}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onDone}>
        {t("common.cancel")}
      </Button>
    </form>
  );
}
