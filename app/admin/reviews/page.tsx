"use client";

import { useState } from "react";
import { useAdminReviews, useModerateReview } from "@/hooks/admin/useReviews";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Select } from "@/components/shared/Select";
import { Skeleton } from "@/components/shared/Skeleton";
import { StarRating } from "@/components/shared/StarRating";
import { t } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import type { ReviewStatus } from "@/types/review";

const statuses: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];
const toneMap: Record<ReviewStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};
const labelKeyMap: Record<ReviewStatus, string> = {
  PENDING: "admin.reviews.statusPending",
  APPROVED: "admin.reviews.statusApproved",
  REJECTED: "admin.reviews.statusRejected",
};

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<ReviewStatus | "">("PENDING");
  const { data, isLoading, isError, error, refetch } = useAdminReviews({
    status: status || undefined,
  });
  const moderate = useModerateReview();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("admin.reviews.title")}</h1>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReviewStatus | "")}
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
        <div className="flex flex-col gap-3">
          {data?.items.map((review) => (
            <div key={review.id} className="rounded-xl2 border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">
                    {review.authorName}
                    {review.tourTitle ? ` · ${review.tourTitle}` : ""}
                  </p>
                  <StarRating value={review.rating} size="sm" />
                </div>
                <Badge tone={toneMap[review.status]}>{t(labelKeyMap[review.status])}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
                {review.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={moderate.isPending}
                      onClick={() => moderate.mutate({ id: review.id, status: "REJECTED" })}
                    >
                      {t("admin.reviews.reject")}
                    </Button>
                    <Button
                      size="sm"
                      isLoading={moderate.isPending}
                      onClick={() => moderate.mutate({ id: review.id, status: "APPROVED" })}
                    >
                      {t("admin.reviews.approve")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
