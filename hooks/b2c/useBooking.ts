import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { publicApi } from "@/lib/api-client";
import type { CreateBookingInput, PayBookingInput } from "@/types/booking";

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

export function usePayBooking(bookingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PayBookingInput) => publicApi.payBooking(bookingNumber, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2c", "booking", bookingNumber] });
    },
  });
}
