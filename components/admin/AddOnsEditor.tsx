"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { addOnFormSchema, type AddOnFormValues } from "@/lib/schemas/tour";
import { useAddAddOn, useSetAddOnActive, useDeleteAddOn } from "@/hooks/admin/useTours";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { AddOn } from "@/types/tour";

export function AddOnsEditor({ tourId, addOns }: { tourId: string; addOns: AddOn[] }) {
  const addAddOn = useAddAddOn(tourId);
  const setActive = useSetAddOnActive(tourId);
  const deleteAddOn = useDeleteAddOn(tourId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddOnFormValues>({
    resolver: zodResolver(addOnFormSchema),
    defaultValues: { name: "", price: 0 },
  });

  async function onSubmit(values: AddOnFormValues) {
    await addAddOn.mutateAsync(values);
    reset({ name: "", price: 0 });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.addOns")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span>{addOn.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatUsd(addOn.price)}</span>
              <Badge tone={addOn.isActive ? "success" : "neutral"}>
                {addOn.isActive
                  ? t("admin.tourForm.addOnActive")
                  : t("admin.tourForm.addOnInactive")}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                isLoading={setActive.isPending}
                onClick={() =>
                  setActive.mutate({ addOnId: addOn.id, isActive: !addOn.isActive })
                }
              >
                {addOn.isActive
                  ? t("admin.tourForm.addOnInactive")
                  : t("admin.tourForm.addOnActive")}
              </Button>
              <button
                type="button"
                onClick={() => deleteAddOn.mutate(addOn.id)}
                className="rounded p-1.5 text-danger hover:bg-danger/10"
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {addOns.length === 0 && <p className="text-sm text-muted">{t("common.noResults")}</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
        <Input
          label={t("admin.tourForm.addOnName")}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label={t("admin.tourForm.addOnPrice")}
          type="number"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        <Button type="submit" isLoading={addAddOn.isPending}>
          {t("admin.tourForm.addAddOn")}
        </Button>
      </form>
    </section>
  );
}
