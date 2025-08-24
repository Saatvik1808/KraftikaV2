import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const sampleProducts = [
  {
    name: "Ocean Breeze",
    description: "A refreshing blend of sea salt and ocean mist that transports you to the beach with every breath.",
    price: 29.99,
    imageUrl: "/ocean.jpeg",
    scentCategory: "Fresh",
    scentNotes: "Sea salt, ocean mist, driftwood",
    burnTime: "40-50 hours",
    ingredients: "Soy wax, essential oils, cotton wick",
    popularity: 95,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Vanilla Dreams",
    description: "Warm and comforting vanilla with hints of caramel and cream for a cozy atmosphere.",
    price: 24.99,
    imageUrl: "/valentine.jpeg",
    scentCategory: "Sweet",
    scentNotes: "Vanilla, caramel, cream",
    burnTime: "35-45 hours",
    ingredients: "Soy wax, vanilla extract, cotton wick",
    popularity: 88,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Lavender Fields",
    description: "Soothing lavender with herbal undertones perfect for relaxation and meditation.",
    price: 27.99,
    imageUrl: "/flower.jpeg",
    scentCategory: "Floral",
    scentNotes: "Lavender, herbs, green notes",
    burnTime: "40-50 hours",
    ingredients: "Soy wax, lavender oil, cotton wick",
    popularity: 92,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Citrus Sunrise",
    description: "Energizing blend of orange, lemon, and grapefruit to brighten your day.",
    price: 26.99,
    imageUrl: "/aes.jpeg",
    scentCategory: "Citrus",
    scentNotes: "Orange, lemon, grapefruit",
    burnTime: "35-45 hours",
    ingredients: "Soy wax, citrus oils, cotton wick",
    popularity: 85,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Coffee Mornings",
    description: "Rich coffee aroma with hints of vanilla and caramel for coffee lovers.",
    price: 31.99,
    imageUrl: "/coffee.jpeg",
    scentCategory: "Sweet",
    scentNotes: "Coffee, vanilla, caramel",
    burnTime: "45-55 hours",
    ingredients: "Soy wax, coffee extract, cotton wick",
    popularity: 90,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Grass & Green",
    description: "Fresh cut grass and green leaves for a natural, outdoor feeling.",
    price: 25.99,
    imageUrl: "/grass.jpeg",
    scentCategory: "Fresh",
    scentNotes: "Fresh grass, green leaves, earth",
    burnTime: "35-45 hours",
    ingredients: "Soy wax, green oils, cotton wick",
    popularity: 78,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Mocha Delight",
    description: "Decadent chocolate and coffee blend for a luxurious experience.",
    price: 33.99,
    imageUrl: "/mocha.jpeg",
    scentCategory: "Sweet",
    scentNotes: "Chocolate, coffee, cream",
    burnTime: "45-55 hours",
    ingredients: "Soy wax, chocolate extract, coffee oil, cotton wick",
    popularity: 87,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Candle Glow",
    description: "Classic candle scent with warm, inviting notes perfect for any occasion.",
    price: 22.99,
    imageUrl: "/candleImage.jpeg",
    scentCategory: "Sweet",
    scentNotes: "Warm wax, vanilla, amber",
    burnTime: "30-40 hours",
    ingredients: "Soy wax, vanilla oil, amber oil, cotton wick",
    popularity: 82,
    createdAt: new Date().toISOString(),
  }
];

export async function seedSampleData() {
  try {
    console.log('🚀 Starting to seed sample data to Firestore...');
    
    const productsRef = collection(db, 'products');
    
    for (const product of sampleProducts) {
      await addDoc(productsRef, product);
      console.log(`✅ Added product: ${product.name}`);
    }
    
    console.log('🎉 Sample data seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
  }
}

// Uncomment the line below and run this file to seed data
// seedSampleData();
