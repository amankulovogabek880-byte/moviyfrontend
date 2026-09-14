import { formatUsd } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import { t } from "@/lib/i18n";

export function PriceCell({
  basePrice,
  discountedPrice,
  isCustom,
}: {
  basePrice: number;
  discountedPrice: number;
  isCustom?: boolean;
}) {
  const hasDiscount = discountedPrice < basePrice;
  return (
    <div className="flex flex-col gap-0.5">
      {hasDiscount && (
        <span className="text-xs text-muted line-through">{formatUsd(basePrice)}</span>
      )}
      <span className="font-semibold">{formatUsd(discountedPrice)}</span>
      {isCustom && <Badge tone="accent">{t("b2b.tours.customPriceBadge")}</Badge>}
    </div>
  );
}
