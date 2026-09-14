import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api-client";

export function useTour(slug: string) {
  return useQuery({
    queryKey: ["b2c", "tour", slug],
    queryFn: () => publicApi.getTour(slug),
    enabled: Boolean(slug),
    // Remaining seats change often (other buyers), so keep this fresher
    // than the default 30s staleTime.
    staleTime: 10_000,
  });
}

export function useTourReviews(slug: string) {
  return useQuery({
    queryKey: ["b2c", "tour", slug, "reviews"],
    queryFn: () => publicApi.getTourReviews(slug),
    enabled: Boolean(slug),
  });
}
