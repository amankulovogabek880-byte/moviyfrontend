"use client";

import { StatCard } from "@/components/shared/StatCard";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminDashboard } from "@/hooks/admin/useDashboard";
import { t } from "@/lib/i18n";
import { formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl2" />;

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
      <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("admin.dashboard.todayBookings")}
          value={String(data.todayBookingsCount)}
        />
        <StatCard
          label={t("admin.dashboard.pendingPayments")}
          value={String(data.pendingPaymentsCount)}
          tone="warning"
        />
        <StatCard
          label={t("admin.dashboard.pendingPaymentsAmount")}
          value={formatUsd(data.pendingPaymentsAmount)}
          tone="warning"
        />
        <StatCard
          label={t("admin.dashboard.expiringSoon")}
          value={String(data.expiringSoonCount)}
          tone="danger"
        />
      </div>
      <StatCard
        label={t("admin.dashboard.monthRevenue")}
        value={formatUsd(data.totalRevenueThisMonth)}
        tone="success"
      />
    </div>
  );
}
