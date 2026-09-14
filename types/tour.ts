export interface TourDeparture {
  id: string;
  date: string;
  totalSeats: number;
  remainingSeats: number;
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
}
