import { db } from './firebase-admin';
import products from '../data/products.json';
import reviews from '../data/reviews.json';


async function seedDatabase() {
  console.log('🚀 Starting to seed database...');

  // --- Seed Products ---
  const productsBatch = db.batch();

  products.forEach((product: any) => {
    const docRef = db.collection('products').doc(product.id.toString());
    productsBatch.set(docRef, {
      ...product,
      price: Number(product.price) || 0,
      createdAt: product.createdAt || new Date().toISOString(),
      popularity: product.popularity || Math.floor(Math.random() * 100),
    });
  });
  

  await productsBatch.commit();
  console.log('✅ Products have been seeded successfully.');

  // --- Seed Reviews ---
  const reviewsBatch = db.batch();

//   reviews.forEach((review) => {
//     const docRef = db.collection('reviews').doc(review.id.toString());
//     reviewsBatch.set(docRef, {
//       ...review,
//       rating: Number(review.rating) || 0,
//     });
//   });

  await reviewsBatch.commit();
  console.log('✅ Reviews have been seeded successfully.');

  console.log('🎉 Database seeding complete!');
}

seedDatabase().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
