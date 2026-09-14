import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { B2BTourListItem, TourFilters, Paginated } from "@/types/tour";

export function useB2BTours(filters?: TourFilters) {
  return useQuery({
    queryKey: ["b2b", "tours", filters],
    queryFn: () =>
      proxyApi.get<Paginated<B2BTourListItem>>("b2b/tours", filters as Record<string, unknown>),
  });
}
