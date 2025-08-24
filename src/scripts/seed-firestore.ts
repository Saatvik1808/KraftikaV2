import { seedSampleData } from '../lib/seed-sample-data';

async function main() {
  console.log('🌱 Starting Firestore seeding process...');
  
  try {
    await seedSampleData();
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
