"use client";

import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAuditLog } from "@/hooks/admin/useAuditLog";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function AdminAuditLogPage() {
  const { data, isLoading, isError, error, refetch } = useAuditLog();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("admin.auditLog.title")}</h1>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <AuditLogTable entries={data?.items ?? []} />
      )}
    </div>
  );
}
