/**
 * Public (unauthenticated) API client for the B2C surface. Calls the backend
 * directly from the browser using NEXT_PUBLIC_API_URL.
 *
 * ASSUMED BACKEND CONTRACT — the backend is a separate, not-yet-built
 * project, so these paths/shapes are inferred from the product spec. When
 * the real spec lands, this file (plus api-proxy-client.ts) is the only
 * place that needs to change:
 *
 *   GET  /public/tours?destination=&dateFrom=&dateTo=&priceMin=&priceMax=&page=&pageSize=
 *        -> Paginated<TourListItem>
 *   GET  /public/tours/:slug -> Tour
 *   POST /public/bookings { tourDepartureId, paxCount, contact } -> { bookingNumber }
 *     (or, for tours with price tiers/room types: { tourDepartureId, adultCount,
 *      childCount, childAges, roomTypeId, contact } -> { bookingNumber })
 *   GET  /public/bookings/:bookingNumber -> Booking
 *     (paxCount on the response is always adultCount + childCount, even for
 *      advanced-mode bookings, so existing status-page rendering keeps working)
 *   POST /public/bookings/:bookingNumber/pay { amount } -> { clickCheckoutUrl }
 *   POST /public/bookings/quote { tourDepartureId, adultCount, childCount,
 *        childAges, roomTypeId } -> { totalAmount } — server-computed price
 *        preview for tours with price tiers/room types configured.
 *   GET  /public/tours/:slug/reviews -> Paginated<Review> (approved only)
 *   POST /public/bookings/:bookingNumber/review { rating, comment } -> Review
 *        (server rejects unless the trip has completed and no review exists yet)
 */
import type { Tour, TourListItem, TourFilters, Paginated } from "@/types/tour";
import type {
  Booking,
  CreateBookingInput,
  CreateBookingResult,
  PayBookingInput,
  PayBookingResult,
  QuoteBookingInput,
  QuoteBookingResult,
} from "@/types/booking";
import type { Review, ReviewFormInput } from "@/types/review";
import type { WaitlistFormInput } from "@/types/waitlist";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, status: number, code = "UNKNOWN") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("Server bilan bog'lanishda xatolik yuz berdi.", 0, "NETWORK_ERROR");
  }

  if (!res.ok) {
    let message = "Server xatosi yuz berdi.";
    let code = "UNKNOWN";
    try {
      const body = await res.json();
      message = body?.message ?? message;
      code = body?.code ?? code;
    } catch {
      // non-JSON error body — keep defaults
    }
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const publicApi = {
  getTours: (filters?: TourFilters) =>
    request<Paginated<TourListItem>>(
      `/public/tours${toQueryString(filters as Record<string, unknown>)}`
    ),
  getTour: (slug: string) => request<Tour>(`/public/tours/${encodeURIComponent(slug)}`),
  createBooking: (input: CreateBookingInput) =>
    request<CreateBookingResult>(`/public/bookings`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getBooking: (bookingNumber: string) =>
    request<Booking>(`/public/bookings/${encodeURIComponent(bookingNumber)}`),
  payBooking: (bookingNumber: string, input: PayBookingInput) =>
    request<PayBookingResult>(
      `/public/bookings/${encodeURIComponent(bookingNumber)}/pay`,
      { method: "POST", body: JSON.stringify(input) }
    ),
  quotePrice: (input: QuoteBookingInput) =>
    request<QuoteBookingResult>(`/public/bookings/quote`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getTourReviews: (slug: string) =>
    request<Paginated<Review>>(`/public/tours/${encodeURIComponent(slug)}/reviews`),
  submitReview: (bookingNumber: string, input: ReviewFormInput) =>
    request<Review>(`/public/bookings/${encodeURIComponent(bookingNumber)}/review`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  joinWaitlist: (departureId: string, input: WaitlistFormInput) =>
    request<{ ok: true }>(`/public/departures/${encodeURIComponent(departureId)}/waitlist`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
