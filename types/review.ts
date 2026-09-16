export type ReviewStatus = "PENDING_MODERATION" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  tourId: string;
  tourTitle?: string;
  authorName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface ReviewFormInput {
  rating: number;
  comment: string;
}

export interface ReviewFilters {
  status?: ReviewStatus;
  page?: number;
  pageSize?: number;
}