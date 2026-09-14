"use client";

import Link from "next/link";
import { StatCard } from "@/components/shared/StatCard";
import { BookingsTable } from "@/components/b2b/BookingsTable";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useB2BDashboard } from "@/hooks/b2b/useDashboard";
import { t } from "@/lib/i18n";
import { formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

export default function B2BDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useB2BDashboard();

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
      <h1 className="text-xl font-bold">{t("b2b.dashboard.title")}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label={t("b2b.dashboard.activeBookings")}
          value={String(data.activeBookingsCount)}
        />
        <StatCard
          label={t("b2b.dashboard.pendingAmount")}
          value={formatUsd(data.pendingPaymentAmount)}
          tone="warning"
        />
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("b2b.dashboard.recentBookings")}</h2>
          <Link href="/b2b/bookings" className="text-sm text-accent hover:underline">
            {t("common.viewDetails")}
          </Link>
        </div>
        <BookingsTable bookings={data.recentBookings} />
      </div>
    </div>
  );
}
