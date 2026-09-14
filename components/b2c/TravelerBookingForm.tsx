"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { travelerBookingSchema, type TravelerBookingFormValues } from "@/lib/schemas/booking";
import { useBookingQuote } from "@/hooks/b2c/useBooking";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { AddOn, RoomType } from "@/types/tour";

export function TravelerBookingForm({
  departureId,
  roomTypes,
  addOns = [],
  isSubmitting,
  onSubmit,
}: {
  departureId: string;
  roomTypes: RoomType[];
  addOns?: AddOn[];
  isSubmitting: boolean;
  onSubmit: (values: TravelerBookingFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<TravelerBookingFormValues>({
    resolver: zodResolver(travelerBookingSchema),
    defaultValues: {
      adultCount: 1,
      childCount: 0,
      childAges: [],
      roomTypeId: undefined,
      addOnIds: [],
    },
  });
  const activeAddOns = addOns.filter((a) => a.isActive);

  const adultCount = watch("adultCount") || 0;
  const childCount = watch("childCount") || 0;
  const roomTypeId = watch("roomTypeId");
  const addOnIds = watch("addOnIds") ?? [];

  useEffect(() => {
    const current = getValues("childAges") ?? [];
    if (current.length === childCount) return;
    const next = Array.from({ length: childCount }, (_, i) => current[i] ?? 0);
    setValue("childAges", next, { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childCount]);

  const childAges = watch("childAges") ?? [];

  const [debounced, setDebounced] = useState({
    adultCount,
    childCount,
    childAges,
    roomTypeId,
    addOnIds,
  });
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounced({ adultCount, childCount, childAges, roomTypeId, addOnIds });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adultCount, childCount, JSON.stringify(childAges), roomTypeId, JSON.stringify(addOnIds)]);

  const quoteEnabled =
    debounced.adultCount + debounced.childCount > 0 &&
    debounced.childAges.length === debounced.childCount;
  const quote = useBookingQuote(
    {
      tourDepartureId: departureId,
      adultCount: debounced.adultCount,
      childCount: debounced.childCount,
      childAges: debounced.childAges,
      roomTypeId: debounced.roomTypeId,
      addOnIds: debounced.addOnIds,
    },
    quoteEnabled
  );

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
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t("b2c.tourDetail.adultCount")}
          type="number"
          min={1}
          error={errors.adultCount?.message}
          {...register("adultCount", { valueAsNumber: true })}
        />
        <Input
          label={t("b2c.tourDetail.childCount")}
          type="number"
          min={0}
          error={errors.childCount?.message}
          {...register("childCount", { valueAsNumber: true })}
        />
      </div>
      {childCount > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: childCount }).map((_, index) => (
            <Input
              key={index}
              label={`${t("b2c.tourDetail.childAge")} ${index + 1}`}
              type="number"
              min={0}
              max={17}
              error={errors.childAges?.[index]?.message ?? errors.childAges?.message}
              {...register(`childAges.${index}`, { valueAsNumber: true })}
            />
          ))}
        </div>
      )}
      {roomTypes.length > 0 && (
        <Select label={t("b2c.tourDetail.roomType")} {...register("roomTypeId")}>
          <option value="">{t("b2c.tourDetail.roomTypeStandard")}</option>
          {roomTypes.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} (+{formatUsd(room.extraAmount)})
            </option>
          ))}
        </Select>
      )}
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

      <div className="rounded-lg border border-border bg-surface/50 px-4 py-3">
        <p className="text-xs text-muted">{t("b2c.tourDetail.estimatedTotal")}</p>
        <p className="text-xl font-bold">
          {quote.isFetching
            ? t("b2c.tourDetail.calculating")
            : quote.data
              ? formatUsd(quote.data.totalAmount)
              : "—"}
        </p>
      </div>

      <Button type="submit" isLoading={isSubmitting} size="lg">
        {isSubmitting ? t("b2c.booking.submitting") : t("b2c.booking.submitBooking")}
      </Button>
    </form>
  );
}
