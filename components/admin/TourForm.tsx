"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { tourFormSchema, type TourFormValues } from "@/lib/schemas/tour";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";

export function TourForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: {
  defaultValues?: Partial<TourFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: TourFormValues) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      destination: "",
      country: "",
      city: "",
      description: "",
      durationDays: 1,
      basePrice: 0,
      commissionAmount: 0,
      itinerary: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "itinerary" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <section className="rounded-xl2 border border-border p-5">
        <h2 className="mb-4 font-semibold">{t("admin.tourForm.basicInfo")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t("admin.tourForm.titleLabel")}
            error={errors.title?.message}
            {...register("title")}
          />
          <Input
            label={t("admin.tourForm.slugLabel")}
            error={errors.slug?.message}
            {...register("slug")}
          />
          <Input
            label={t("admin.tourForm.destinationLabel")}
            error={errors.destination?.message}
            {...register("destination")}
          />
          <Input
            label={t("admin.tourForm.countryLabel")}
            error={errors.country?.message}
            {...register("country")}
          />
          <Input
            label={t("admin.tourForm.cityLabel")}
            error={errors.city?.message}
            {...register("city")}
          />
          <Input
            label={t("admin.tourForm.durationLabel")}
            type="number"
            error={errors.durationDays?.message}
            {...register("durationDays", { valueAsNumber: true })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <Textarea
            label={t("admin.tourForm.descriptionLabel")}
            className="min-h-40"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </section>

      <section className="rounded-xl2 border border-border p-5">
        <h2 className="mb-4 font-semibold">{t("admin.tourForm.pricing")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t("admin.tourForm.basePriceLabel")}
            type="number"
            error={errors.basePrice?.message}
            {...register("basePrice", { valueAsNumber: true })}
          />
          <Input
            label={t("admin.tourForm.commissionLabel")}
            type="number"
            error={errors.commissionAmount?.message}
            {...register("commissionAmount", { valueAsNumber: true })}
          />
        </div>
      </section>

      <section className="rounded-xl2 border border-border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{t("admin.tourForm.itinerary")}</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => append({ day: fields.length + 1, title: "", description: "" })}
          >
            <Plus className="h-4 w-4" /> {t("admin.tourForm.addItineraryDay")}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 rounded-lg border border-border p-3">
              <Input
                label={t("admin.tourForm.itineraryDay")}
                type="number"
                className="w-20"
                {...register(`itinerary.${index}.day`, { valueAsNumber: true })}
              />
              <Input
                label={t("admin.tourForm.itineraryTitle")}
                className="flex-1"
                error={errors.itinerary?.[index]?.title?.message}
                {...register(`itinerary.${index}.title`)}
              />
              <Textarea
                label={t("admin.tourForm.itineraryDescription")}
                className="flex-[2]"
                error={errors.itinerary?.[index]?.description?.message}
                {...register(`itinerary.${index}.description`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-6 h-9 rounded p-2 text-danger hover:bg-danger/10"
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="self-start">
        {t("admin.tourForm.saveButton")}
      </Button>
    </form>
  );
}