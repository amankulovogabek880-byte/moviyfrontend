"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingContactSchema, type BookingContactFormValues } from "@/lib/schemas/booking";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";

export function BookingContactForm({
  maxPax,
  isSubmitting,
  onSubmit,
}: {
  maxPax: number;
  isSubmitting: boolean;
  onSubmit: (values: BookingContactFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: { paxCount: 1 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label={t("b2c.booking.fullName")}
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        label={t("b2c.booking.phone")}
        placeholder="+998901234567"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label={t("b2c.booking.email")}
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("b2c.tourDetail.pax")}
        type="number"
        min={1}
        max={maxPax}
        error={errors.paxCount?.message}
        {...register("paxCount", { valueAsNumber: true })}
      />
      <Button type="submit" isLoading={isSubmitting} size="lg">
        {isSubmitting ? t("b2c.booking.submitting") : t("b2c.booking.submitBooking")}
      </Button>
    </form>
  );
}
