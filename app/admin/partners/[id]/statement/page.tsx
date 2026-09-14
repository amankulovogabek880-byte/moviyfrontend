"use client";

import { useParams } from "next/navigation";
import { useAdminPartnerStatement } from "@/hooks/admin/usePartners";
import { DownloadLink } from "@/components/shared/DownloadLink";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { t } from "@/lib/i18n";
import { formatDate, formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

export default function AdminPartnerStatementPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useAdminPartnerStatement(params.id);

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl2" />;
  if (isError || !data) {
    return (
      <ErrorMessage
        message={error instanceof ApiError ? error.message : t("common.networkError")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.partnerForm.statementTitle")}</h1>
        <div className="flex items-center gap-3">
          <DownloadLink path={`admin/partners/${params.id}/statement/export?format=pdf`}>
            {t("admin.partnerForm.statementDownloadPdf")}
          </DownloadLink>
          <DownloadLink path={`admin/partners/${params.id}/statement/export?format=excel`}>
            {t("admin.partnerForm.statementDownloadExcel")}
          </DownloadLink>
          <DownloadLink path={`admin/partners/${params.id}/statement/invoice`} variant="primary">
            {t("admin.partnerForm.statementMonthlyInvoice")}
          </DownloadLink>
        </div>
      </div>

      {data.items.length === 0 ? (
        <EmptyState message={t("admin.partnerForm.statementEmpty")} />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">{t("admin.partnerForm.statementColDate")}</th>
                <th className="px-3 py-2">{t("admin.partnerForm.statementColTour")}</th>
                <th className="px-3 py-2">{t("admin.partnerForm.statementColAmount")}</th>
                <th className="px-3 py-2">{t("admin.partnerForm.statementColBalance")}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((entry) => (
                <tr key={entry.id} className="border-t border-border">
                  <td className="px-3 py-2">{formatDate(entry.date)}</td>
                  <td className="px-3 py-2">{entry.tourTitle}</td>
                  <td className="px-3 py-2">{formatUsd(entry.amount)}</td>
                  <td className="px-3 py-2">{formatUsd(entry.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
