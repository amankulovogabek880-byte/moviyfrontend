"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waitlistFormSchema, type WaitlistFormValues } from "@/lib/schemas/waitlist";
import { useJoinWaitlist } from "@/hooks/b2c/useBooking";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export function WaitlistForm({ departureId }: { departureId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const joinWaitlist = useJoinWaitlist(departureId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { paxCount: 1 },
  });

  async function onSubmit(values: WaitlistFormValues) {
    setError(null);
    try {
      await joinWaitlist.mutateAsync(values);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  if (submitted) {
    return <p className="text-sm text-success">{t("b2c.tourDetail.waitlistThankYou")}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">{t("b2c.tourDetail.waitlistTitle")}</p>
      <p className="text-sm text-muted">{t("b2c.tourDetail.waitlistIntro")}</p>
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
          error={errors.paxCount?.message}
          {...register("paxCount", { valueAsNumber: true })}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" isLoading={joinWaitlist.isPending} size="lg">
          {joinWaitlist.isPending
            ? t("b2c.tourDetail.waitlistSubmitting")
            : t("b2c.tourDetail.waitlistJoin")}
        </Button>
      </form>
    </div>
  );
}
