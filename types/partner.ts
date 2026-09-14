export interface Partner {
  id: string;
  companyName: string;
  email: string;
  phone?: string;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
  activeBookingsCount?: number;
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
