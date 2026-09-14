export type PartnerPaymentType = "PREPAID" | "POSTPAID";

export interface PartnerTourDiscount {
  id: string;
  tourId: string;
  tourTitle: string;
  discountPercent: number;
}

export interface Partner {
  id: string;
  companyName: string;
  email: string;
  phone?: string;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
  activeBookingsCount?: number;
  tourDiscounts?: PartnerTourDiscount[];
  paymentType?: PartnerPaymentType;
  creditLimit?: number;
  creditBalance?: number;
  users?: PartnerUser[];
}

export interface PartnerTourDiscountFormInput {
  tourId: string;
  discountPercent: number;
}

export interface PartnerPaymentTermsInput {
  paymentType: PartnerPaymentType;
  creditLimit?: number;
}

export interface PartnerStatementEntry {
  id: string;
  date: string;
  tourTitle: string;
  amount: number;
  balance: number;
}

export type PartnerUserRole = "OWNER" | "AGENT";

export interface PartnerUser {
  id: string;
  fullName: string;
  email: string;
  role: PartnerUserRole;
  isActive: boolean;
}

export interface PartnerUserFormInput {
  fullName: string;
  email: string;
  role: PartnerUserRole;
}

export interface PartnerFormInput {
  companyName: string;
  email: string;
  phone?: string;
  discountPercent: number;
  password?: string;
}

export interface PartnerFilters {
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
