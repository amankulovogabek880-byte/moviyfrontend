"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdminRefunds } from "@/hooks/admin/useBookings";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Select } from "@/components/shared/Select";
import { Skeleton } from "@/components/shared/Skeleton";
import { t } from "@/lib/i18n";
import { formatDate, formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import type { RefundStatus } from "@/types/booking";

const statuses: RefundStatus[] = ["PENDING", "COMPLETED", "REJECTED"];
const toneMap: Record<RefundStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  COMPLETED: "success",
  REJECTED: "danger",
};
const labelKeyMap: Record<RefundStatus, string> = {
  PENDING: "admin.refunds.statusPending",
  COMPLETED: "admin.refunds.statusCompleted",
  REJECTED: "admin.refunds.statusRejected",
};

export default function AdminRefundsPage() {
  const [status, setStatus] = useState<RefundStatus | "">("");
  const { data, isLoading, isError, error, refetch } = useAdminRefunds({
    status: status || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.refunds.title")}</h1>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as RefundStatus | "")}
          className="w-52"
        >
          <option value="">{t("common.all")}</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {t(labelKeyMap[s])}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState message={t("common.noResults")} />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">{t("admin.refunds.colBooking")}</th>
                <th className="px-3 py-2">{t("admin.refunds.colTour")}</th>
                <th className="px-3 py-2">{t("admin.refunds.colSuggested")}</th>
                <th className="px-3 py-2">{t("admin.refunds.colFinal")}</th>
                <th className="px-3 py-2">{t("admin.refunds.colStatus")}</th>
                <th className="px-3 py-2">{t("admin.refunds.colDate")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((refund) => (
                <tr key={refund.id} className="border-t border-border hover:bg-surface/50">
                  <td className="px-3 py-2 font-mono">
                    <Link href={`/admin/bookings/${refund.bookingId}`} className="text-accent hover:underline">
                      {refund.bookingNumber}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{refund.tourTitle}</td>
                  <td className="px-3 py-2">{formatUsd(refund.suggestedAmount)}</td>
                  <td className="px-3 py-2">{formatUsd(refund.finalAmount)}</td>
                  <td className="px-3 py-2">
                    <Badge tone={toneMap[refund.status]}>{t(labelKeyMap[refund.status])}</Badge>
                  </td>
                  <td className="px-3 py-2 text-muted">{formatDate(refund.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
