import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { Booking, BookingFilters } from "@/types/booking";
import type { Paginated } from "@/types/tour";
import type { MarkPaidInput, MarkUnpaidInput } from "@/types/payment";

export function useAdminBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["admin", "bookings", filters],
    queryFn: () =>
      proxyApi.get<Paginated<Booking>>("admin/bookings", filters as Record<string, unknown>),
  });
}

export function useMarkPaid(bookingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MarkPaidInput) =>
      proxyApi.patch<Booking>(
        `admin/bookings/${encodeURIComponent(bookingNumber)}/mark-paid`,
        input
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}

export function useMarkUnpaid(bookingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MarkUnpaidInput) =>
      proxyApi.patch<Booking>(
        `admin/bookings/${encodeURIComponent(bookingNumber)}/mark-unpaid`,
        input
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}
