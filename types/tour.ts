export interface TourDeparture {
  id: string;
  departureDate: string;
  returnDate: string;
  totalSeats: number;
  remainingSeats: number;
  price?: number | null;
  waitlistCount?: number;
}

export interface PriceTier {
  id: string;
  type: "ADULT" | "CHILD" | "INFANT";
  label: string;
  percentOfBase: number;
  ageFrom?: number;
  ageTo?: number;
}

export interface RoomType {
  id: string;
  name: string;
  extraAmount: number;
}

export type TourVisibility = "ALL_PARTNERS" | "SELECTED_PARTNERS";

export interface AddOn {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface AddOnFormInput {
  name: string;
  price: number;
}

export interface TourImage {
  id: string;
  url: string;
  order: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  categoryId?: string;
  destination: string;
  country: string;
  city: string;
  description: string;
  images: TourImage[];
  itinerary: ItineraryDay[];
  basePrice: number;
  commissionAmount: number;
  currency?: string;
  active?: boolean;
  durationDays: number;
  departures: TourDeparture[];
  isFeatured?: boolean;
  priceTiers?: PriceTier[];
  roomTypes?: RoomType[];
  addOns?: AddOn[];
  visibility?: TourVisibility;
  visiblePartnerIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TourListItem {
  id: string;
  slug: string;
  title: string;
  destination: string;
  coverImageUrl: string;
  basePrice: number;
  durationDays: number;
  minRemainingSeats?: number;
  isFeatured?: boolean;
}

export interface B2BTourListItem extends TourListItem {
  discountPercent: number;
  discountedPrice: number;
  departures: TourDeparture[];
  hasCustomDiscount?: boolean;
}

export interface TourFilters {
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TourFormInput {
  title: string;
  slug: string;
  categoryId?: string;
  destination: string;
  country: string;
  city: string;
  description: string;
  durationDays: number;
  basePrice: number;
  commissionAmount: number;
  currency?: string;
  active?: boolean;
  itinerary: ItineraryDay[];
}

export interface DepartureFormInput {
  departureDate: string;
  returnDate: string;
  totalSeats: number;
  basePriceOverride?: number;
  commissionOverride?: number;
}

export interface PriceTierFormInput {
  type: "ADULT" | "CHILD" | "INFANT";
  label: string;
  percentOfBase: number;
  ageFrom?: number;
  ageTo?: number;
}

export interface RoomTypeFormInput {
  name: string;
  extraAmount: number;
}