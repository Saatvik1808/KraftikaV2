export interface Candle {
  id: string;
  name: string;
  scentCategory: 'Citrus' | 'Floral' | 'Sweet' | 'Fresh' | 'Fruity' | 'Woody' | 'Spicy'; // Add more as needed
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
  images?: string[]; // For carousel on detail page
}
