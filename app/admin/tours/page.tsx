"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminToursTable } from "@/components/admin/AdminToursTable";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminTours } from "@/hooks/admin/useTours";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function AdminToursPage() {
  const { data, isLoading, isError, error, refetch } = useAdminTours();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.tours.title")}</h1>
        <Link href="/admin/tours/new">
          <Button>
            <Plus className="h-4 w-4" /> {t("admin.tours.addNew")}
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <AdminToursTable tours={data?.items ?? []} />
      )}
    </div>
  );
}
