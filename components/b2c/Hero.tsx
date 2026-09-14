"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/shared/Button";

export function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const qs = destination ? `?destination=${encodeURIComponent(destination)}` : "";
    router.push(`/tours${qs}`);
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="font-display text-4xl font-extrabold text-surface-foreground sm:text-5xl">
          {t("b2c.home.heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("b2c.home.heroSubtitle")}</p>
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-xl gap-2 rounded-xl2 bg-background p-2 shadow-lg"
        >
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t("b2c.home.searchPlaceholder")}
            className="flex-1 rounded-lg border-0 px-4 text-sm outline-none"
          />
          <Button type="submit" size="lg">
            <Search className="h-4 w-4" />
            {t("common.search")}
          </Button>
        </form>
      </div>
    </section>
  );
}
