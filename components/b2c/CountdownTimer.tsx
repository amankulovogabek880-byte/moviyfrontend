"use client";

import { useEffect, useState } from "react";
import { getCountdown, pad2 } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function CountdownTimer({
  expiresAt,
  onExpire,
}: {
  expiresAt: string | null;
  onExpire?: () => void;
}) {
  const [countdown, setCountdown] = useState(() => getCountdown(expiresAt));

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const next = getCountdown(expiresAt);
        if (next.expired && !prev.expired) {
          onExpire?.();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (countdown.expired) {
    return (
      <p className="text-sm font-semibold text-danger">{t("b2c.booking.countdownExpired")}</p>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm text-muted">{t("b2c.booking.countdownTitle")}</p>
      <p className="mt-1 font-mono text-3xl font-bold text-accent">
        {pad2(countdown.hours)}:{pad2(countdown.minutes)}:{pad2(countdown.seconds)}
      </p>
    </div>
  );
}
