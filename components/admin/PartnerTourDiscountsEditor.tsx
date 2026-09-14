"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import {
  partnerTourDiscountFormSchema,
  type PartnerTourDiscountFormValues,
} from "@/lib/schemas/partner";
import {
  useAddPartnerTourDiscount,
  useDeletePartnerTourDiscount,
} from "@/hooks/admin/usePartners";
import { useAdminTours } from "@/hooks/admin/useTours";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import type { PartnerTourDiscount } from "@/types/partner";

export function PartnerTourDiscountsEditor({
  partnerId,
  tourDiscounts,
}: {
  partnerId: string;
  tourDiscounts: PartnerTourDiscount[];
}) {
  const [search, setSearch] = useState("");
  const addDiscount = useAddPartnerTourDiscount(partnerId);
  const deleteDiscount = useDeletePartnerTourDiscount(partnerId);
  const { data: tours } = useAdminTours();

  const filteredTours = useMemo(() => {
    const items = tours?.items ?? [];
    if (!search.trim()) return items;
    return items.filter((tour) => tour.title.toLowerCase().includes(search.toLowerCase()));
  }, [tours, search]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerTourDiscountFormValues>({
    resolver: zodResolver(partnerTourDiscountFormSchema),
    defaultValues: { tourId: "", discountPercent: 0 },
  });

  async function onSubmit(values: PartnerTourDiscountFormValues) {
    await addDiscount.mutateAsync(values);
    reset({ tourId: "", discountPercent: 0 });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.partnerForm.tourDiscounts")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {tourDiscounts.map((discount) => (
          <div
            key={discount.id}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span>{discount.tourTitle}</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{discount.discountPercent}%</span>
              <button
                type="button"
                onClick={() => deleteDiscount.mutate(discount.id)}
                className="rounded p-1.5 text-danger hover:bg-danger/10"
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {tourDiscounts.length === 0 && <p className="text-sm text-muted">{t("common.noResults")}</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <Input
          label={t("common.search")}
          placeholder={t("admin.partnerForm.tourDiscountSearchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        <Select
          label={t("admin.partnerForm.tourDiscountSelectTour")}
          error={errors.tourId?.message}
          {...register("tourId")}
        >
          <option value="">{t("admin.partnerForm.tourDiscountSelectTour")}</option>
          {filteredTours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.title}
            </option>
          ))}
        </Select>
        <Input
          label={t("admin.partnerForm.tourDiscountPercentLabel")}
          type="number"
          className="w-32"
          error={errors.discountPercent?.message}
          {...register("discountPercent", { valueAsNumber: true })}
        />
        <Button type="submit" isLoading={addDiscount.isPending}>
          {t("admin.partnerForm.addTourDiscount")}
        </Button>
      </form>
    </section>
  );
}
