import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { Review, ReviewFilters, ReviewStatus } from "@/types/review";
import type { Paginated } from "@/types/tour";

export function useAdminReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: ["admin", "reviews", filters],
    queryFn: () =>
      proxyApi.get<Paginated<Review>>("admin/reviews", filters as Record<string, unknown>),
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      proxyApi.patch<Review>(`admin/reviews/${encodeURIComponent(id)}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}
