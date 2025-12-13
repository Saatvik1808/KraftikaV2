export interface Candle {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  videoUrl?: string; // Single video URL (optional)
  videoUrls?: string[]; // Array of video URLs (optional)
  scentCategory: string;
  scentNotes: string;
  burnTime: string;
  ingredients: string;
  popularity: number;
  createdAt: string;
  updatedAt?: string;
  // Add any other fields you have in Firebase
}