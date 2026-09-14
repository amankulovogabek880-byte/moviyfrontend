"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import {
  priceTierFormSchema,
  roomTypeFormSchema,
  type PriceTierFormValues,
  type RoomTypeFormValues,
} from "@/lib/schemas/tour";
import {
  useAddPriceTier,
  useDeletePriceTier,
  useAddRoomType,
  useDeleteRoomType,
} from "@/hooks/admin/useTours";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { PriceTier, RoomType } from "@/types/tour";

export function PriceTiersEditor({ tourId, priceTiers }: { tourId: string; priceTiers: PriceTier[] }) {
  const addTier = useAddPriceTier(tourId);
  const deleteTier = useDeletePriceTier(tourId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriceTierFormValues>({
    resolver: zodResolver(priceTierFormSchema),
    defaultValues: { type: "ADULT", label: "", percentOfBase: 100 },
  });

  async function onSubmit(values: PriceTierFormValues) {
    await addTier.mutateAsync(values);
    reset({ type: "ADULT", label: "", percentOfBase: 100 });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.priceTiers")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {priceTiers.map((tier) => (
          <div
            key={tier.id}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span>
              {tier.type === "ADULT"
                ? t("admin.tourForm.priceTierTypeAdult")
                : t("admin.tourForm.priceTierTypeChild")}{" "}
              — {tier.label}
              {tier.ageFrom != null || tier.ageTo != null
                ? ` (${tier.ageFrom ?? 0}–${tier.ageTo ?? "∞"})`
                : ""}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{tier.percentOfBase}%</span>
              <button
                type="button"
                onClick={() => deleteTier.mutate(tier.id)}
                className="rounded p-1.5 text-danger hover:bg-danger/10"
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {priceTiers.length === 0 && (
          <p className="text-sm text-muted">{t("common.noResults")}</p>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <Select label={t("admin.tourForm.priceTierType")} {...register("type")}>
          <option value="ADULT">{t("admin.tourForm.priceTierTypeAdult")}</option>
          <option value="CHILD">{t("admin.tourForm.priceTierTypeChild")}</option>
        </Select>
        <Input
          label={t("admin.tourForm.priceTierLabel")}
          error={errors.label?.message}
          {...register("label")}
        />
        <Input
          label={t("admin.tourForm.priceTierPercent")}
          type="number"
          className="w-32"
          error={errors.percentOfBase?.message}
          {...register("percentOfBase", { valueAsNumber: true })}
        />
        <Input
          label={t("admin.tourForm.priceTierAgeFrom")}
          type="number"
          className="w-24"
          {...register("ageFrom", { valueAsNumber: true })}
        />
        <Input
          label={t("admin.tourForm.priceTierAgeTo")}
          type="number"
          className="w-24"
          {...register("ageTo", { valueAsNumber: true })}
        />
        <Button type="submit" isLoading={addTier.isPending}>
          {t("admin.tourForm.addPriceTier")}
        </Button>
      </form>
    </section>
  );
}

export function RoomTypesEditor({ tourId, roomTypes }: { tourId: string; roomTypes: RoomType[] }) {
  const addRoomType = useAddRoomType(tourId);
  const deleteRoomType = useDeleteRoomType(tourId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeFormSchema),
    defaultValues: { name: "", extraAmount: 0 },
  });

  async function onSubmit(values: RoomTypeFormValues) {
    await addRoomType.mutateAsync(values);
    reset({ name: "", extraAmount: 0 });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.roomTypes")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {roomTypes.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span>{room.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold">+{formatUsd(room.extraAmount)}</span>
              <button
                type="button"
                onClick={() => deleteRoomType.mutate(room.id)}
                className="rounded p-1.5 text-danger hover:bg-danger/10"
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {roomTypes.length === 0 && <p className="text-sm text-muted">{t("common.noResults")}</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
        <Input
          label={t("admin.tourForm.roomTypeName")}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label={t("admin.tourForm.roomTypeExtraAmount")}
          type="number"
          error={errors.extraAmount?.message}
          {...register("extraAmount", { valueAsNumber: true })}
        />
        <Button type="submit" isLoading={addRoomType.isPending}>
          {t("admin.tourForm.addRoomType")}
        </Button>
      </form>
    </section>
  );
}
