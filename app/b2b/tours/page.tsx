"use client";

import { ToursTable } from "@/components/b2b/ToursTable";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useB2BTours } from "@/hooks/b2b/useTours";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function B2BToursPage() {
  const { data, isLoading, isError, error, refetch } = useB2BTours();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">{t("b2b.tours.title")}</h1>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <ToursTable tours={data?.items ?? []} />
      )}
    </div>
  );
}
