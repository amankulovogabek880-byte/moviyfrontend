"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { markPaidSchema, type MarkPaidFormValues } from "@/lib/schemas/payment";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { remainingBalance } from "@/lib/utils";
import { useMarkPaid, useMarkUnpaid } from "@/hooks/admin/useBookings";
import { ApiError } from "@/lib/api-client";
import type { Booking } from "@/types/booking";

export function MarkPaidModal({
  booking,
  mode,
  onClose,
}: {
  booking: Booking;
  mode: "paid" | "unpaid";
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  // Critical: the backend's mark-paid/mark-unpaid routes key off the
  // booking's internal `id` (a UUID), not the human-facing `bookingNumber`
  // — passing bookingNumber here silently 404s (or worse, could hit the
  // wrong booking if IDs and numbers ever collided in format).
  const markPaid = useMarkPaid(booking.id);
  const markUnpaid = useMarkUnpaid(booking.id);
  const isPaid = mode === "paid";

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<MarkPaidFormValues>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: { amount: remainingBalance(booking) },
  });

  function goToConfirm() {
    setStep(2);
  }

  async function confirm() {
    setError(null);
    const values = getValues();
    try {
      if (isPaid) {
        await markPaid.mutateAsync({ amount: values.amount, note: values.note });
      } else {
        await markUnpaid.mutateAsync({ note: values.note });
      }
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isPaid ? t("admin.markPaidModal.titlePaid") : t("admin.markPaidModal.titleUnpaid")}
    >
      {step === 1 ? (
        <form onSubmit={handleSubmit(goToConfirm)} className="flex flex-col gap-4">
          {isPaid && (
            <Input
              label={t("admin.markPaidModal.amountLabel")}
              type="number"
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
          )}
          <Textarea label={t("admin.markPaidModal.noteLabel")} {...register("note")} />
          <Button type="submit">{t("admin.markPaidModal.step1Continue")}</Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-semibold">{t("admin.markPaidModal.step2Title")}</p>
          <p className="text-sm text-muted">{t("admin.markPaidModal.step2Body")}</p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
            <Button
              variant={isPaid ? "primary" : "danger"}
              isLoading={markPaid.isPending || markUnpaid.isPending}
              onClick={confirm}
            >
              {t("admin.markPaidModal.confirmButton")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}