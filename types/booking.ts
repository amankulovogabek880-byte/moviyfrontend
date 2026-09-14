export type BookingStatus =
  | "PENDING_PAYMENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED";

export type BookingChannel = "B2C" | "B2B";

export interface BookingContact {
  fullName: string;
  phone: string;
  email: string;
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
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateBookingInput {
  tourDepartureId: string;
  paxCount: number;
  contact: BookingContact;
}

export interface CreateBookingResult {
  bookingNumber: string;
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
