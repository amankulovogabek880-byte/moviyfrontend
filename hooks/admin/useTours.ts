import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type {
  Tour,
  TourFormInput,
  DepartureFormInput,
  Paginated,
  TourListItem,
  PriceTierFormInput,
  RoomTypeFormInput,
  TourVisibility,
  AddOnFormInput,
} from "@/types/tour";
import type { WaitlistEntry } from "@/types/waitlist";

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

export function useUpdateDeparture(tourId: string, departureId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { price?: number }) =>
      proxyApi.patch(
        `admin/tours/${encodeURIComponent(tourId)}/departures/${encodeURIComponent(departureId)}`,
        input
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useDepartureWaitlist(tourId: string, departureId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "tour", tourId, "departure", departureId, "waitlist"],
    queryFn: () =>
      proxyApi.get<Paginated<WaitlistEntry>>(
        `admin/tours/${encodeURIComponent(tourId)}/departures/${encodeURIComponent(departureId)}/waitlist`
      ),
    enabled,
  });
}

export function useAddAddOn(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddOnFormInput) =>
      proxyApi.post(`admin/tours/${encodeURIComponent(tourId)}/add-ons`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useSetAddOnActive(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addOnId, isActive }: { addOnId: string; isActive: boolean }) =>
      proxyApi.patch(
        `admin/tours/${encodeURIComponent(tourId)}/add-ons/${encodeURIComponent(addOnId)}`,
        { isActive }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useDeleteAddOn(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addOnId: string) =>
      proxyApi.delete(
        `admin/tours/${encodeURIComponent(tourId)}/add-ons/${encodeURIComponent(addOnId)}`
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useUpdateTourVisibility(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { visibility: TourVisibility; partnerIds: string[] }) =>
      proxyApi.patch<Tour>(`admin/tours/${encodeURIComponent(tourId)}/visibility`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "tours"] });
    },
  });
}

export function useAddPriceTier(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PriceTierFormInput) =>
      proxyApi.post(`admin/tours/${encodeURIComponent(tourId)}/price-tiers`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useDeletePriceTier(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tierId: string) =>
      proxyApi.delete(
        `admin/tours/${encodeURIComponent(tourId)}/price-tiers/${encodeURIComponent(tierId)}`
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useAddRoomType(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RoomTypeFormInput) =>
      proxyApi.post(`admin/tours/${encodeURIComponent(tourId)}/room-types`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}

export function useDeleteRoomType(tourId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomTypeId: string) =>
      proxyApi.delete(
        `admin/tours/${encodeURIComponent(tourId)}/room-types/${encodeURIComponent(roomTypeId)}`
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tour", tourId] }),
  });
}
