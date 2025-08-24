export interface Candle {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  scentCategory: string;
  scentNotes: string;
  burnTime: string;
  ingredients: string;
  popularity: number;
  createdAt: string;
  // Add any other fields you have in Firebase
}