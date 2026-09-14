export type PaymentMethod = "CLICK" | "MANUAL";
export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface PaymentTransaction {
  id: string;
  bookingNumber: string;
  amount: number;
  amountUzs?: number;
  method: PaymentMethod;
  status: PaymentStatus;
  note?: string;
  createdByEmail?: string;
  createdAt: string;
}

export interface MarkPaidInput {
  amount: number;
  note?: string;
}

export interface MarkUnpaidInput {
  note?: string;
}

export interface PaymentFilters {
  method?: PaymentMethod;
  status?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
