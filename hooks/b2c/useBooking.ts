import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { publicApi } from "@/lib/api-client";
import type { CreateBookingInput, PayBookingInput, QuoteBookingInput } from "@/types/booking";
import type { ReviewFormInput } from "@/types/review";
import type { WaitlistFormInput } from "@/types/waitlist";

export function useBooking(bookingNumber: string) {
  return useQuery({
    queryKey: ["b2c", "booking", bookingNumber],
    queryFn: () => publicApi.getBooking(bookingNumber),
    enabled: Boolean(bookingNumber),
    staleTime: 5_000,
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

export function usePayBooking(bookingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PayBookingInput) => publicApi.payBooking(bookingNumber, input),
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
