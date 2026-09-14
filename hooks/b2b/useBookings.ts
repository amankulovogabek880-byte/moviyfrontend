import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type {
  Booking,
  BookingFilters,
  CreateBookingInput,
  CreateBookingResult,
} from "@/types/booking";
import type { Paginated } from "@/types/tour";

export function useB2BBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["b2b", "bookings", filters],
    queryFn: () =>
      proxyApi.get<Paginated<Booking>>("b2b/bookings", filters as Record<string, unknown>),
  });
}

export function useB2BBooking(bookingNumber: string) {
  return useQuery({
    queryKey: ["b2b", "booking", bookingNumber],
    queryFn: () => proxyApi.get<Booking>(`b2b/bookings/${encodeURIComponent(bookingNumber)}`),
    enabled: Boolean(bookingNumber),
  });
}

export function useCreateB2BBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) =>
      proxyApi.post<CreateBookingResult>("b2b/bookings", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2b", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["b2b", "tours"] });
    },
  });
}
