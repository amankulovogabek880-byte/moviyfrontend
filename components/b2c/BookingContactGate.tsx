"use client";

import { useState } from "react";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";

/**
 * Shown instead of the booking page when we don't have the booking's
 * contact (email/phone) stored yet — e.g. someone opened a shared link in
 * a fresh browser/tab rather than landing here right after booking. Once
 * they type it in, `onSubmit` both stores it (for next time) and triggers
 * the actual lookup.
 */
export function BookingContactGate({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (contact: string) => void;
  isLoading?: boolean;
  error?: string | null;
}) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim();
  const showRequiredError = touched && !trimmed;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-lg font-bold">{t("b2c.booking.contactGateTitle")}</h1>
      <p className="mb-6 text-sm text-muted">{t("b2c.booking.contactGateHint")}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label={t("b2c.booking.contactGatePlaceholder")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={
            showRequiredError
              ? t("b2c.booking.contactGateRequired")
              : error ?? undefined
          }
        />
        <Button type="submit" isLoading={isLoading}>
          {t("b2c.booking.contactGateSubmit")}
        </Button>
      </form>
    </div>
  );
}