import { TourCard } from "./TourCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { t } from "@/lib/i18n";
import type { TourListItem } from "@/types/tour";

export function TourGrid({
  tours,
  isLoading,
}: {
  tours: TourListItem[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl2" />
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return <EmptyState message={t("b2c.tours.emptyState")} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
