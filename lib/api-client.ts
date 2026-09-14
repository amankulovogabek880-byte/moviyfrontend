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
 *   GET  /public/bookings/:bookingNumber -> Booking
 *   POST /public/bookings/:bookingNumber/pay { amount } -> { clickCheckoutUrl }
 */
import type { Tour, TourListItem, TourFilters, Paginated } from "@/types/tour";
import type {
  Booking,
  CreateBookingInput,
  CreateBookingResult,
  PayBookingInput,
  PayBookingResult,
} from "@/types/booking";

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
};
