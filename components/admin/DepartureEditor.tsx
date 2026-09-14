"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departureFormSchema, type DepartureFormValues } from "@/lib/schemas/tour";
import { useAddDeparture } from "@/hooks/admin/useTours";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { formatDate } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { TourDeparture } from "@/types/tour";

export function DepartureEditor({
  tourId,
  departures,
}: {
  tourId: string;
  departures: TourDeparture[];
}) {
  const addDeparture = useAddDeparture(tourId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartureFormValues>({ resolver: zodResolver(departureFormSchema) });

  async function onSubmit(values: DepartureFormValues) {
    await addDeparture.mutateAsync(values);
    reset();
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.departures")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {departures.map((dep) => (
          <div
            key={dep.id}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span>{formatDate(dep.date)}</span>
            <span className="text-muted">
              {dep.remainingSeats}/{dep.totalSeats} {t("common.seatsLeft")}
            </span>
          </div>
        ))}
        {departures.length === 0 && (
          <p className="text-sm text-muted">{t("b2c.tourDetail.noDepartures")}</p>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
        <Input
          label={t("admin.tourForm.departureDate")}
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />
        <Input
          label={t("admin.tourForm.departureSeats")}
          type="number"
          error={errors.totalSeats?.message}
          {...register("totalSeats", { valueAsNumber: true })}
        />
        <Button type="submit" isLoading={addDeparture.isPending}>
          {t("admin.tourForm.addDeparture")}
        </Button>
      </form>
    </section>
  );
}
