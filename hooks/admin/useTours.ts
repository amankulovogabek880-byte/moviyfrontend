import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type {
  Tour,
  TourFormInput,
  DepartureFormInput,
  Paginated,
  TourListItem,
} from "@/types/tour";

export function useAdminTours() {
  return useQuery({
    queryKey: ["admin", "tours"],
    queryFn: () => proxyApi.get<Paginated<TourListItem>>("admin/tours"),
  });
}

export function useAdminTour(id: string) {
  return useQuery({
    queryKey: ["admin", "tour", id],
    queryFn: () => proxyApi.get<Tour>(`admin/tours/${encodeURIComponent(id)}`),
    enabled: Boolean(id) && id !== "new",
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TourFormInput) => proxyApi.post<Tour>("admin/tours", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tours"] }),
  });
}

export function useUpdateTour(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<TourFormInput>) =>
      proxyApi.patch<Tour>(`admin/tours/${encodeURIComponent(id)}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tours"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "tour", id] });
    },
  });
}

export function useAddDeparture(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DepartureFormInput) =>
      proxyApi.post(`admin/tours/${encodeURIComponent(tourId)}/departures`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}
