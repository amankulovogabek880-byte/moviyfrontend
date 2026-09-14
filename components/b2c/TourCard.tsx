import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { formatUsd } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import type { TourListItem } from "@/types/tour";

export function TourCard({ tour }: { tour: TourListItem }) {
  const urgent = tour.minRemainingSeats !== undefined && tour.minRemainingSeats <= 3;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group overflow-hidden rounded-xl2 border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {tour.coverImageUrl && (
          <Image
            src={tour.coverImageUrl}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {urgent && (
          <Badge tone="danger" className="absolute left-3 top-3">
            {t("common.seatsUrgent", { count: tour.minRemainingSeats! })}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          {tour.destination}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight">{tour.title}</h3>
        <p className="text-sm text-muted">
          {tour.durationDays} {t("common.days")}
        </p>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xs text-muted">{t("b2c.tours.fromPrice")}</span>
          <span className="text-lg font-bold text-foreground">{formatUsd(tour.basePrice)}</span>
        </div>
      </div>
    </Link>
  );
}
