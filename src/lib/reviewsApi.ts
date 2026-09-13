const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export interface ApiReview {
  id: number;
  name: string;
  city: string;
  stars: number;
  text: string;
  is_approved?: boolean;
  created_at?: string;
}

export interface ReviewPage {
  reviews: ApiReview[];
  count: number;
}

export interface ReviewRatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface ReviewRatingSummary {
  count: number;
  average: number;
  distribution: ReviewRatingDistribution[];
}

interface ReviewListResponse { count?: number; results?: ApiReview[]; }

export async function getReviews(): Promise<ReviewPage> {
  const response = await fetch(`${API_BASE_URL}/api/reviews/`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Reviews API request failed (${response.status})`);
  const payload = await response.json() as ApiReview[] | ReviewListResponse;
  const reviews = Array.isArray(payload) ? payload : payload.results ?? [];
  return { reviews, count: Array.isArray(payload) ? reviews.length : payload.count ?? reviews.length };
}

export async function getReviewRatingSummary(): Promise<ReviewRatingSummary> {
  const response = await fetch(`${API_BASE_URL}/api/reviews/summary/`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Review summary API request failed (${response.status})`);
  return response.json() as Promise<ReviewRatingSummary>;
}

export async function submitReview(review: Pick<ApiReview, "name" | "city" | "stars" | "text">) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(review),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(payload?.detail || "ثبت دیدگاه انجام نشد.");
  }
  return response.json() as Promise<ApiReview>;
}
