import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api-client";
import type { TourFilters } from "@/types/tour";

export function useTours(filters: TourFilters) {
  return useQuery({
    queryKey: ["b2c", "tours", filters],
    queryFn: () => publicApi.getTours(filters),
  });
}
