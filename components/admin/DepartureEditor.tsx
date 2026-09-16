"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import {
  departureFormSchema,
  departurePriceUpdateSchema,
  type DepartureFormValues,
  type DeparturePriceUpdateValues,
} from "@/lib/schemas/tour";
import {
  useAddDeparture,
  useUpdateDeparture,
  useDepartureWaitlist,
} from "@/hooks/admin/useTours";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate, formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { TourDeparture } from "@/types/tour";

function DepartureWaitlistPanel({ tourId, departureId }: { tourId: string; departureId: string }) {
  const { data, isLoading } = useDepartureWaitlist(tourId, departureId, true);
  const entries = data?.items ?? [];

  if (isLoading) return <p className="px-3 py-2 text-sm text-muted">{t("common.loading")}</p>;
  if (entries.length === 0) {
    return <EmptyState message={t("admin.tourForm.waitlistEmpty")} />;
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between text-sm">
          <span>
            {entry.fullName} · {entry.phone} · {entry.email}
          </span>
          <span className="text-muted">
            {entry.paxCount} {t("common.person")}
          </span>
        </div>
      ))}
    </div>
  );
}

function DepartureRow({ tourId, departure }: { tourId: string; departure: TourDeparture }) {
  const [editing, setEditing] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const updateDeparture = useUpdateDeparture(tourId, departure.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeparturePriceUpdateValues>({
    resolver: zodResolver(departurePriceUpdateSchema),
    defaultValues: { price: departure.price ?? undefined },
  });

  async function onSubmit(values: DeparturePriceUpdateValues) {
    await updateDeparture.mutateAsync(values);
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border px-3 py-2 text-sm">
      <div className="flex items-center justify-between">
        <span>
          {formatDate(departure.departureDate)} → {formatDate(departure.returnDate)}
        </span>
        <span className="text-muted">
          {departure.remainingSeats}/{departure.totalSeats} {t("common.seatsLeft")}
        </span>
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Input
              type="number"
              className="h-8 w-28"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />
            <Button type="submit" size="sm" isLoading={updateDeparture.isPending}>
              {t("common.save")}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
              {t("common.cancel")}
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            {departure.price != null ? (
              <span className="font-semibold">{formatUsd(departure.price)}</span>
            ) : (
              <Badge tone="neutral">{t("admin.tourForm.departureStandardPrice")}</Badge>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded p-1.5 text-muted hover:bg-surface hover:text-foreground"
              aria-label={t("admin.tourForm.departureEditPrice")}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <Button size="sm" variant="outline" onClick={() => setShowWaitlist((v) => !v)}>
              {t("admin.tourForm.waitlistButton")}
              {departure.waitlistCount != null ? ` (${departure.waitlistCount})` : ""}
            </Button>
          </div>
        )}
      </div>
      {showWaitlist && <DepartureWaitlistPanel tourId={tourId} departureId={departure.id} />}
    </div>
  );
}

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
          <DepartureRow key={dep.id} tourId={tourId} departure={dep} />
        ))}
        {departures.length === 0 && (
          <p className="text-sm text-muted">{t("b2c.tourDetail.noDepartures")}</p>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <Input
          label={t("admin.tourForm.departureDate")}
          type="date"
          error={errors.departureDate?.message}
          {...register("departureDate")}
        />
        <Input
          label={t("admin.tourForm.departureReturnDate")}
          type="date"
          error={errors.returnDate?.message}
          {...register("returnDate")}
        />
        <Input
          label={t("admin.tourForm.departureSeats")}
          type="number"
          error={errors.totalSeats?.message}
          {...register("totalSeats", { valueAsNumber: true })}
        />
        <Input
          label={t("admin.tourForm.departureBasePriceOverride")}
          type="number"
          error={errors.basePriceOverride?.message}
          {...register("basePriceOverride", { valueAsNumber: true })}
        />
        <Input
          label={t("admin.tourForm.departureCommissionOverride")}
          type="number"
          error={errors.commissionOverride?.message}
          {...register("commissionOverride", { valueAsNumber: true })}
        />
        <Button type="submit" isLoading={addDeparture.isPending}>
          {t("admin.tourForm.addDeparture")}
        </Button>
      </form>
    </section>
  );
}

/**
 * Local (not-yet-persisted) departure list used on the "new tour" flow,
 * before the tour itself has an id. Reuses the same form fields as
 * DepartureEditor's add-form, but only updates an in-memory array via
 * `onChange` instead of calling `useAddDeparture`. Allows zero entries —
 * the admin can always add departure dates later from the edit page.
 */
export function DepartureDraftList({
  value,
  onChange,
}: {
  value: DepartureFormValues[];
  onChange: (departures: DepartureFormValues[]) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartureFormValues>({ resolver: zodResolver(departureFormSchema) });

  function onAdd(values: DepartureFormValues) {
    onChange([...value, values]);
    reset();
  }

  function onRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.departures")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {value.map((dep, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span>
              {formatDate(dep.departureDate)} → {formatDate(dep.returnDate)} · {dep.totalSeats}{" "}
              {t("common.seatsLeft")}
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded p-1.5 text-danger hover:bg-danger/10"
              aria-label={t("common.delete")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-sm text-muted">{t("b2c.tourDetail.noDepartures")}</p>
        )}
      </div>
      <form onSubmit={handleSubmit(onAdd)} className="flex flex-wrap items-end gap-3">
        <Input
          label={t("admin.tourForm.departureDate")}
          type="date"
          error={errors.departureDate?.message}
          {...register("departureDate")}
        />
        <Input
          label={t("admin.tourForm.departureReturnDate")}
          type="date"
          error={errors.returnDate?.message}
          {...register("returnDate")}
        />
        <Input
          label={t("admin.tourForm.departureSeats")}
          type="number"
          error={errors.totalSeats?.message}
          {...register("totalSeats", { valueAsNumber: true })}
        />
        <Input
          label={t("admin.tourForm.departureBasePriceOverride")}
          type="number"
          error={errors.basePriceOverride?.message}
          {...register("basePriceOverride", { valueAsNumber: true })}
        />
        <Input
          label={t("admin.tourForm.departureCommissionOverride")}
          type="number"
          error={errors.commissionOverride?.message}
          {...register("commissionOverride", { valueAsNumber: true })}
        />
        <Button type="submit">{t("admin.tourForm.addDeparture")}</Button>
      </form>
    </section>
  );
}