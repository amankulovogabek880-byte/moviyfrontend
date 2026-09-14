"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { t } from "@/lib/i18n";

export default function BookingSuccessPage() {
  const params = useParams<{ bookingNumber: string }>();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <CheckCircle2 className="h-16 w-16 text-success" />
      <h1 className="mt-4 font-display text-2xl font-bold">{t("b2c.success.title")}</h1>
      <p className="mt-2 text-muted">{t("b2c.success.subtitle")}</p>
      <p className="mt-4 font-mono text-sm text-muted">{params.bookingNumber}</p>
      <Link href="/" className="mt-8 text-accent hover:underline">
        {t("b2c.success.backHome")}
      </Link>
    </div>
  );
}
