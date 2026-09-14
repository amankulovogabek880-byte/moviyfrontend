"use client";

import Link from "next/link";
import { Hero } from "@/components/b2c/Hero";
import { TourGrid } from "@/components/b2c/TourGrid";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useTours } from "@/hooks/b2c/useTours";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function HomePage() {
  const { data, isLoading, isError, error, refetch } = useTours({ pageSize: 6 });

  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{t("b2c.home.featuredTitle")}</h2>
          <Link href="/tours" className="text-sm font-medium text-accent hover:underline">
            {t("b2c.home.viewAll")}
          </Link>
        </div>
        {isError ? (
          <ErrorMessage
            message={error instanceof ApiError ? error.message : t("common.networkError")}
            onRetry={() => refetch()}
          />
        ) : (
          <TourGrid tours={data?.items ?? []} isLoading={isLoading} />
        )}
      </section>
    </div>
  );
}
