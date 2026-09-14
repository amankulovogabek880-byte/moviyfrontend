"use client";

import { useTourReviews } from "@/hooks/b2c/useTour";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { formatDate } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function ReviewsSection({ slug }: { slug: string }) {
  const { data, isLoading } = useTourReviews(slug);
  const reviews = data?.items ?? [];

  return (
    <div className="mt-10">
      <h2 className="mb-4 font-display text-xl font-bold">{t("b2c.reviews.sectionTitle")}</h2>
      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl2" />
      ) : reviews.length === 0 ? (
        <EmptyState message={t("b2c.reviews.empty")} />
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl2 border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.authorName}</p>
                <StarRating value={review.rating} size="sm" />
              </div>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
              <p className="mt-2 text-xs text-muted">{formatDate(review.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
