import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { publicApi } from "@/lib/api-client";
import type { CreateBookingInput, PayBookingInput, QuoteBookingInput } from "@/types/booking";
import type { ReviewFormInput } from "@/types/review";
import type { WaitlistFormInput } from "@/types/waitlist";

// `contact` is the email or phone used on the booking — the backend's
// public lookup endpoint requires it alongside the booking number (see
// lib/api-client.ts and lib/booking-contact.ts for where it comes from).
export function useBooking(bookingNumber: string, contact: string | null | undefined) {
  return useQuery({
    queryKey: ["b2c", "booking", bookingNumber, contact],
    queryFn: () => publicApi.getBooking(bookingNumber, contact as string),
    enabled: Boolean(bookingNumber) && Boolean(contact),
    staleTime: 5_000,
  });
}

// Used by app/(b2c)/my-bookings/page.tsx — looks up every booking made
// with a given phone number, no password required.
export function useMyBookings(phone: string | null) {
  return useQuery({
    queryKey: ["b2c", "myBookings", phone],
    queryFn: () => publicApi.getMyBookings(phone as string),
    enabled: Boolean(phone),
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (input: CreateBookingInput) => publicApi.createBooking(input),
  });
}

export function useBookingQuote(input: QuoteBookingInput, enabled: boolean) {
  return useQuery({
    queryKey: ["b2c", "bookingQuote", input],
    queryFn: () => publicApi.quotePrice(input),
    enabled,
    staleTime: 0,
  });
}

// `bookingId` is the booking's internal `id` (booking.id), not its
// human-facing `bookingNumber` — see lib/api-client.ts's payBooking.
export function usePayBooking(bookingId: string, bookingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PayBookingInput) => publicApi.payBooking(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2c", "booking", bookingNumber] });
    },
  });
}

export function useSubmitReview(bookingNumber: string) {
  return useMutation({
    mutationFn: (input: ReviewFormInput) => publicApi.submitReview(bookingNumber, input),
  });
}

export function useJoinWaitlist(departureId: string) {
  return useMutation({
    mutationFn: (input: WaitlistFormInput) => publicApi.joinWaitlist(departureId, input),
  });
}