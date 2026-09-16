export type BookingStatus =
  | "PENDING_PAYMENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CONFIRMED_UNPAID"
  | "EXPIRED"
  | "CANCELLED"
  | "COMPLETED";

export type BookingChannel = "B2C" | "B2B";

export interface BookingContact {
  fullName: string;
  phone: string;
  email: string;
}

export type PartnerPaymentType = "PREPAID" | "POSTPAID";

export interface PriceBreakdownItem {
  label: string;
  amount: number;
}

export interface BookingTravelerDetail {
  adultCount: number;
  childCount: number;
  childAges?: number[];
  roomTypeName?: string;
  addOns?: { name: string; price: number }[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  tour: {
    id: string;
    slug: string;
    title: string;
    coverImageUrl: string;
  };
  departure: {
    id: string;
    date: string;
  };
  paxCount: number;
  totalAmount: number;
  paidAmount: number;
  contact: BookingContact;
  channel: BookingChannel;
  partnerId?: string;
  partnerCompanyName?: string;
  createdByName?: string;
  paymentType?: PartnerPaymentType;
  priceBreakdown?: PriceBreakdownItem[];
  travelers?: BookingTravelerDetail;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateBookingInput {
  tourDepartureId: string;
  contact: BookingContact;
  // Simple (legacy) mode — used when the tour has no price tiers/room types.
  paxCount?: number;
  // Advanced mode — used when the tour has price tiers and/or room types.
  adultCount?: number;
  childCount?: number;
  childAges?: number[];
  roomTypeId?: string;
  // Available regardless of mode, whenever the tour has add-ons configured.
  addOnIds?: string[];
}

export interface CreateBookingResult {
  bookingNumber: string;
}

export interface QuoteBookingInput {
  tourDepartureId: string;
  adultCount: number;
  childCount: number;
  childAges: number[];
  roomTypeId?: string;
  addOnIds?: string[];
}

export interface QuoteBookingResult {
  totalAmount: number;
}

export type RefundStatus = "PENDING" | "DONE";

export interface RefundRequest {
  id: string;
  bookingId: string;
  bookingNumber: string;
  tourTitle: string;
  suggestedAmount: number;
  finalAmount: number;
  note?: string;
  status: RefundStatus;
  createdAt: string;
}

export interface CancelPreviewResult {
  suggestedRefundAmount: number;
  policyNote?: string;
}

export interface CancelBookingInput {
  refundAmount: number;
  note?: string;
}

export interface RefundFilters {
  status?: RefundStatus;
  page?: number;
  pageSize?: number;
}

export interface PayBookingInput {
  amount: number;
}

export interface PayBookingResult {
  clickCheckoutUrl: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  channel?: BookingChannel;
  partnerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}