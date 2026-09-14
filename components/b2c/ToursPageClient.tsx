"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filters } from "@/components/b2c/Filters";
import { TourGrid } from "@/components/b2c/TourGrid";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useTours } from "@/hooks/b2c/useTours";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { TourFilters } from "@/types/tour";

export function ToursPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: TourFilters = useMemo(
    () => ({
      destination: searchParams.get("destination") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    }),
    [searchParams]
  );

  function updateFilters(next: TourFilters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, val]) => {
      if (val !== undefined && val !== "") params.set(key, String(val));
    });
    router.push(`/tours?${params.toString()}`);
  }

  const { data, isLoading, isError, error, refetch } = useTours(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold">{t("b2c.tours.title")}</h1>
      <div className="mb-8">
        <Filters value={filters} onChange={updateFilters} onReset={() => router.push("/tours")} />
      </div>
      {isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <TourGrid tours={data?.items ?? []} isLoading={isLoading} />
      )}
    </div>
  );
}
