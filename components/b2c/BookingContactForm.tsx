"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingContactSchema, type BookingContactFormValues } from "@/lib/schemas/booking";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { formatUsd } from "@/lib/utils";
import type { AddOn } from "@/types/tour";

export function BookingContactForm({
  maxPax,
  addOns = [],
  isSubmitting,
  onSubmit,
}: {
  maxPax: number;
  addOns?: AddOn[];
  isSubmitting: boolean;
  onSubmit: (values: BookingContactFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: { paxCount: 1, addOnIds: [] },
  });
  const activeAddOns = addOns.filter((a) => a.isActive);

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
      {activeAddOns.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">{t("b2c.tourDetail.addOnsTitle")}</p>
          <div className="flex flex-col gap-2">
            {activeAddOns.map((addOn) => (
              <label key={addOn.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" value={addOn.id} {...register("addOnIds")} />
                {addOn.name} (+{formatUsd(addOn.price)})
              </label>
            ))}
          </div>
        </div>
      )}
      <Button type="submit" isLoading={isSubmitting} size="lg">
        {isSubmitting ? t("b2c.booking.submitting") : t("b2c.booking.submitBooking")}
      </Button>
    </form>
  );
}
