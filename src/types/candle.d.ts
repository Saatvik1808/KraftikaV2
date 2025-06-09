export interface Candle {
  id: string;
  name: string;
  scentCategory: string; // relax to string
  price: number;
  imageUrl: string;
  description: string;
  scentNotes: string; // Could be more structured, e.g., { top: string[], middle: string[], base: string[] }
  burnTime: string;
  ingredients: string;
   // Optional properties
  isFeatured?: boolean;
  isNew?: boolean;
  popularityScore?: number; // For sorting
  images?: string[];
  popularity?: number; // Add if you're using it for sorting
  createdAt?: string;  // For carousel on detail page
}
