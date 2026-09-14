import { Suspense } from "react";
import { ToursPageClient } from "@/components/b2c/ToursPageClient";
import { Skeleton } from "@/components/shared/Skeleton";

export default function ToursPage() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-10 h-96 max-w-6xl" />}>
      <ToursPageClient />
    </Suspense>
  );
}
