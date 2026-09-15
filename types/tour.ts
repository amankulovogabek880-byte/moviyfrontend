export interface TourDeparture {
  id: string;
  date: string;
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
  destination: string;
  shortDescription: string;
  description: string;
  images: TourImage[];
  itinerary: ItineraryDay[];
  basePrice: number;
  commissionPercent?: number;
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
  destination: string;
  shortDescription: string;
  description: string;
  durationDays: number;
  basePrice: number;
  commissionPercent: number;
  itinerary: ItineraryDay[];
}

export interface DepartureFormInput {
  date: string;
  totalSeats: number;
  price?: number;
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