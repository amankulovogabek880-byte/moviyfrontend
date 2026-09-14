"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  partnerPaymentTermsSchema,
  type PartnerPaymentTermsValues,
} from "@/lib/schemas/partner";
import { useSetPartnerPaymentTerms } from "@/hooks/admin/usePartners";
import { Select } from "@/components/shared/Select";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { CreditProgressBar } from "@/components/shared/CreditProgressBar";
import { t } from "@/lib/i18n";
import type { Partner } from "@/types/partner";

export function PartnerPaymentTermsForm({ partner }: { partner: Partner }) {
  const setPaymentTerms = useSetPartnerPaymentTerms(partner.id);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PartnerPaymentTermsValues>({
    resolver: zodResolver(partnerPaymentTermsSchema),
    defaultValues: {
      paymentType: partner.paymentType ?? "PREPAID",
      creditLimit: partner.creditLimit ?? 0,
    },
  });

  const paymentType = watch("paymentType");

  async function onSubmit(values: PartnerPaymentTermsValues) {
    await setPaymentTerms.mutateAsync(values);
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.partnerForm.paymentTerms")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label={t("admin.partnerForm.paymentTypeLabel")} {...register("paymentType")}>
            <option value="PREPAID">{t("admin.partnerForm.paymentTypePrepaid")}</option>
            <option value="POSTPAID">{t("admin.partnerForm.paymentTypePostpaid")}</option>
          </Select>
          {paymentType === "POSTPAID" && (
            <Input
              label={t("admin.partnerForm.creditLimitLabel")}
              type="number"
              error={errors.creditLimit?.message}
              {...register("creditLimit", { valueAsNumber: true })}
            />
          )}
        </div>
        {paymentType === "POSTPAID" && partner.paymentType === "POSTPAID" && (
          <CreditProgressBar
            limit={partner.creditLimit ?? 0}
            used={partner.creditBalance ?? 0}
          />
        )}
        <Button type="submit" isLoading={setPaymentTerms.isPending} className="self-start">
          {t("admin.partnerForm.savePaymentTerms")}
        </Button>
      </form>
    </section>
  );
}
