"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelBookingSchema, type CancelBookingFormValues } from "@/lib/schemas/booking";
import { useCancelPreview, useCancelBooking } from "@/hooks/admin/useBookings";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import type { Booking } from "@/types/booking";

export function CancelBookingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const preview = useCancelPreview(booking.id, true);
  const cancelBooking = useCancelBooking(booking.id);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CancelBookingFormValues>({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: { refundAmount: 0 },
  });

  useEffect(() => {
    if (preview.data) {
      setValue("refundAmount", preview.data.suggestedRefundAmount);
    }
  }, [preview.data, setValue]);

  function goToConfirm() {
    setStep(2);
  }

  async function confirm() {
    setError(null);
    const values = getValues();
    try {
      await cancelBooking.mutateAsync({ refundAmount: values.refundAmount, note: values.note });
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  return (
    <Modal open onClose={onClose} title={t("admin.cancelBookingModal.title")}>
      {step === 1 ? (
        <form onSubmit={handleSubmit(goToConfirm)} className="flex flex-col gap-4">
          {preview.isLoading ? (
            <p className="text-sm text-muted">{t("admin.cancelBookingModal.calculating")}</p>
          ) : preview.data ? (
            <p className="text-sm text-muted">
              {t("admin.cancelBookingModal.suggestedAmountNote")}:{" "}
              <span className="font-semibold text-foreground">
                {formatUsd(preview.data.suggestedRefundAmount)}
              </span>
            </p>
          ) : null}
          <Input
            label={t("admin.cancelBookingModal.amountLabel")}
            type="number"
            error={errors.refundAmount?.message}
            {...register("refundAmount", { valueAsNumber: true })}
          />
          <Textarea label={t("admin.cancelBookingModal.noteLabel")} {...register("note")} />
          <Button type="submit">{t("admin.cancelBookingModal.step1Continue")}</Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-semibold">{t("admin.cancelBookingModal.step2Title")}</p>
          <p className="text-sm text-muted">{t("admin.cancelBookingModal.step2Body")}</p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
            <Button variant="danger" isLoading={cancelBooking.isPending} onClick={confirm}>
              {t("admin.cancelBookingModal.confirmButton")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
