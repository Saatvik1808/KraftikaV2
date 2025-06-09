
export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorAvatarFallback: string; // For avatar fallback
  rating: number;
  reviewText: string;
  reviewDate: string; // Display friendly format e.g., "May 20, 2024"
  reviewImageUrl?: string; // Optional image uploaded by reviewer
}
