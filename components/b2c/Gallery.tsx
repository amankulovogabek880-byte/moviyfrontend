"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TourImage } from "@/types/tour";

export function Gallery({ images, alt }: { images: TourImage[]; alt: string }) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return <div className="aspect-[16/9] w-full rounded-xl2 bg-surface" />;
  }

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl2 bg-surface">
        <Image src={sorted[active].url} alt={alt} fill className="object-cover" priority />
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2",
                i === active ? "border-accent" : "border-transparent"
              )}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
