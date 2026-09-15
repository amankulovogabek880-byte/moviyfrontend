"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { t } from "@/lib/i18n";
import { formatUsd, remainingBalance } from "@/lib/utils";
import { usePayBooking } from "@/hooks/b2c/useBooking";
import { ApiError } from "@/lib/api-client";
import type { Booking } from "@/types/booking";

export function PaySection({ booking }: { booking: Booking }) {
  const remaining = remainingBalance(booking);
  const [mode, setMode] = useState<"idle" | "partial">("idle");
  const [amount, setAmount] = useState(remaining);
  const [error, setError] = useState<string | null>(null);
  const payBooking = usePayBooking(booking.id, booking.bookingNumber);

  async function handlePay(payAmount: number) {
    setError(null);
    try {
      const result = await payBooking.mutateAsync({ amount: payAmount });
      window.location.href = result.clickCheckoutUrl;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-danger">{error}</p>}
      {mode === "idle" ? (
        <>
          <Button isLoading={payBooking.isPending} onClick={() => handlePay(remaining)}>
            {t("b2c.booking.payFull")} ({formatUsd(remaining)})
          </Button>
          <Button variant="outline" type="button" onClick={() => setMode("partial")}>
            {t("b2c.booking.payPartial")}
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            label={t("b2c.booking.amountToPay")}
            value={amount}
            min={1}
            max={remaining}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button isLoading={payBooking.isPending} onClick={() => handlePay(amount)}>
            {t("b2c.booking.payNow")}
          </Button>
        </div>
      )}
    </div>
  );
}