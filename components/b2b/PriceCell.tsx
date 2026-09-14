import { formatUsd } from "@/lib/utils";

export function PriceCell({
  basePrice,
  discountedPrice,
}: {
  basePrice: number;
  discountedPrice: number;
}) {
  const hasDiscount = discountedPrice < basePrice;
  return (
    <div className="flex flex-col">
      {hasDiscount && (
        <span className="text-xs text-muted line-through">{formatUsd(basePrice)}</span>
      )}
      <span className="font-semibold">{formatUsd(discountedPrice)}</span>
    </div>
  );
}
