"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PartnersTable } from "@/components/admin/PartnersTable";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminPartners } from "@/hooks/admin/usePartners";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function AdminPartnersPage() {
  const { data, isLoading, isError, error, refetch } = useAdminPartners();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.partners.title")}</h1>
        <Link href="/admin/partners/new">
          <Button>
            <Plus className="h-4 w-4" /> {t("admin.partners.addNew")}
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
        <PartnersTable partners={data?.items ?? []} />
      )}
    </div>
  );
}
