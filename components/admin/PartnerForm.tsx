"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerFormSchema, type PartnerFormValues } from "@/lib/schemas/partner";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";

export function PartnerForm({
  defaultValues,
  isNew,
  isSubmitting,
  onSubmit,
}: {
  defaultValues?: Partial<PartnerFormValues>;
  isNew: boolean;
  isSubmitting: boolean;
  onSubmit: (values: PartnerFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: { companyName: "", email: "", discountPercent: 0, ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-xl2 border border-border p-5"
    >
      <Input
        label={t("admin.partnerForm.companyNameLabel")}
        error={errors.companyName?.message}
        {...register("companyName")}
      />
      <Input
        label={t("admin.partnerForm.emailLabel")}
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("admin.partnerForm.phoneLabel")}
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label={t("admin.partnerForm.discountLabel")}
        type="number"
        error={errors.discountPercent?.message}
        {...register("discountPercent", { valueAsNumber: true })}
      />
      {isNew && (
        <Input
          label={t("admin.partnerForm.passwordLabel")}
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
      )}
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {t("admin.partnerForm.saveButton")}
      </Button>
    </form>
  );
}
