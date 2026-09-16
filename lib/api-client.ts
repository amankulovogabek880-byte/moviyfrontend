/**
 * Public (unauthenticated) API client for the B2C surface. Calls the backend
 * directly from the browser using NEXT_PUBLIC_API_URL.
 *
 * Real backend endpoints used here — see the backend's own Swagger docs at
 * `${NEXT_PUBLIC_API_URL}/api/docs` for the authoritative, up-to-date shape
 * of every request/response body.
 *
 *   GET  /public/tours?destination=&dateFrom=&dateTo=&priceMin=&priceMax=&page=&pageSize=
 *   GET  /public/tours/:slug
 *   POST /public/bookings
 *   GET  /public/bookings/:bookingNumber?contact= — `contact` (email or
 *        phone used on the booking) is required; the booking number alone
 *        is not enough to look up a booking.
 *   GET  /public/bookings/my-bookings?phone= — lists every booking made
 *        with that phone number, no password required.
 *   POST /public/bookings/:id/pay/click — note this is the booking's
 *        internal `id`, not its human-facing `bookingNumber`.
 *   POST /public/bookings/quote
 *   GET  /public/tours/:slug/reviews
 *   POST /public/bookings/:bookingNumber/review
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
  getBooking: (bookingNumber: string, contact: string) =>
    request<Booking>(
      `/public/bookings/${encodeURIComponent(bookingNumber)}?contact=${encodeURIComponent(contact)}`
    ),
  // Lists every booking made with a given phone number — no password, the
  // phone itself is the lookup key (see app/(b2c)/my-bookings/page.tsx).
  getMyBookings: (phone: string) =>
    request<Booking[]>(`/public/bookings/my-bookings?phone=${encodeURIComponent(phone)}`),
  // `bookingId` here is the booking's internal `id` (booking.id), not its
  // human-facing `bookingNumber` — the backend route only accepts the id.
  payBooking: (bookingId: string, input: PayBookingInput) =>
    request<PayBookingResult>(
      `/public/bookings/${encodeURIComponent(bookingId)}/pay/click`,
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