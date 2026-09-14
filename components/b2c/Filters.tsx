"use client";

import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import type { TourFilters } from "@/types/tour";

export function Filters({
  value,
  onChange,
  onReset,
}: {
  value: TourFilters;
  onChange: (next: TourFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl2 border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        label={t("b2c.tours.destination")}
        value={value.destination ?? ""}
        onChange={(e) => onChange({ ...value, destination: e.target.value })}
      />
      <Input
        type="date"
        label={t("b2c.tours.dateFrom")}
        value={value.dateFrom ?? ""}
        onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
      />
      <Input
        type="date"
        label={t("b2c.tours.dateTo")}
        value={value.dateTo ?? ""}
        onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
      />
      <Input
        type="number"
        label={t("b2c.tours.priceMin")}
        value={value.priceMin ?? ""}
        onChange={(e) =>
          onChange({ ...value, priceMin: e.target.value ? Number(e.target.value) : undefined })
        }
      />
      <Input
        type="number"
        label={t("b2c.tours.priceMax")}
        value={value.priceMax ?? ""}
        onChange={(e) =>
          onChange({ ...value, priceMax: e.target.value ? Number(e.target.value) : undefined })
        }
      />
      <div className="col-span-full flex justify-end">
        <Button variant="outline" size="sm" type="button" onClick={onReset}>
          {t("common.reset")}
        </Button>
      </div>
    </div>
  );
}
