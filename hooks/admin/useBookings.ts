import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type {
  Booking,
  BookingFilters,
  CancelBookingInput,
  CancelPreviewResult,
  RefundFilters,
  RefundRequest,
} from "@/types/booking";
import type { Paginated } from "@/types/tour";
import type { MarkPaidInput, MarkUnpaidInput } from "@/types/payment";
import type { NotificationLogEntry } from "@/types/notification";

export function useAdminBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["admin", "bookings", filters],
    queryFn: () =>
      proxyApi.get<Paginated<Booking>>("admin/bookings", filters as Record<string, unknown>),
  });
}

export function useAdminBooking(id: string) {
  return useQuery({
    queryKey: ["admin", "booking", id],
    queryFn: () => proxyApi.get<Booking>(`admin/bookings/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

export function useCancelPreview(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "booking", id, "cancel-preview"],
    queryFn: () =>
      proxyApi.get<CancelPreviewResult>(
        `admin/bookings/${encodeURIComponent(id)}/cancel-preview`
      ),
    enabled,
  });
}

export function useCancelBooking(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CancelBookingInput) =>
      proxyApi.post<Booking>(`admin/bookings/${encodeURIComponent(id)}/cancel`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "refunds"] });
    },
  });
}

export function useBookingNotifications(bookingId: string) {
  return useQuery({
    queryKey: ["admin", "booking", bookingId, "notifications"],
    queryFn: () =>
      proxyApi.get<Paginated<NotificationLogEntry>>(
        `admin/bookings/${encodeURIComponent(bookingId)}/notifications`
      ),
    enabled: Boolean(bookingId),
  });
}

export function useAdminRefunds(filters?: RefundFilters) {
  return useQuery({
    queryKey: ["admin", "refunds", filters],
    queryFn: () =>
      proxyApi.get<Paginated<RefundRequest>>("admin/refunds", filters as Record<string, unknown>),
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
