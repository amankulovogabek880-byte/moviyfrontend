import Link from "next/link";
import { formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { EmptyState } from "@/components/shared/EmptyState";
import type { TourListItem } from "@/types/tour";

export function AdminToursTable({
  tours,
  readOnly,
}: {
  tours: TourListItem[];
  readOnly?: boolean;
}) {
  if (tours.length === 0) return <EmptyState message={t("common.noResults")} />;

  return (
    <div className="overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">{t("admin.tours.colTitle")}</th>
            <th className="px-4 py-3">{t("admin.tours.colDestination")}</th>
            <th className="px-4 py-3">{t("admin.tours.colPrice")}</th>
            <th className="px-4 py-3">{t("admin.tours.colDuration")}</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id} className="border-t border-border hover:bg-surface/50">
              <td className="px-4 py-3">
                {readOnly ? (
                  <span className="font-medium">{tour.title}</span>
                ) : (
                  <Link
                    href={`/admin/tours/${tour.id}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {tour.title}
                  </Link>
                )}
              </td>
              <td className="px-4 py-3 text-muted">{tour.destination}</td>
              <td className="px-4 py-3">{formatUsd(tour.basePrice)}</td>
              <td className="px-4 py-3">
                {tour.durationDays} {t("common.days")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
