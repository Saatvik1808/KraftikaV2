#!/usr/bin/env node

/**
 * Import Real Firebase Data to PostgreSQL
 * This script imports the actual Firebase data from kraftika-scents-default-rtdb-export.json
 */

const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kraftika_db',
  user: process.env.DB_USER || 'kraftika_user',
  password: process.env.DB_PASSWORD || 'anamika01'  // Updated password
};

async function connectToDatabase() {
  const client = new Client(dbConfig);
  await client.connect();
  console.log('✅ Connected to PostgreSQL database');
  return client;
}

async function clearExistingData(client) {
  console.log('🧹 Clearing existing data...');
  
  // Delete in reverse order of dependencies
  await client.query('DELETE FROM reviews');
  await client.query('DELETE FROM product_ingredients');
  await client.query('DELETE FROM product_scent_notes');
  await client.query('DELETE FROM products');
  await client.query('DELETE FROM categories');
  
  console.log('✅ Existing data cleared');
}

async function createRealCategories(client) {
  console.log('🏷️ Creating real categories...');
  
  // Extract unique scent categories from the data
  const realCategories = [
    { name: "Fresh", description: "Clean and refreshing scents", color: "#00CED1", icon: "droplet" },
    { name: "Woody", description: "Earthy and warm woody aromas", color: "#8B4513", icon: "tree" },
    { name: "Floral", description: "Beautiful and romantic floral fragrances", color: "#FF69B4", icon: "flower" },
    { name: "Sweet", description: "Warm and comforting sweet aromas", color: "#DDA0DD", icon: "heart" }
  ];
  
  for (const category of realCategories) {
    const result = await client.query(`
      INSERT INTO categories (name, description, color, icon, is_active, product_count, created_at, updated_at)
      VALUES ($1, $2, $3, $4, true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id
    `, [category.name, category.description, category.color, category.icon]);
    
    console.log(`✅ Created category: ${category.name}`);
  }
}

async function importRealProducts(client, products) {
  console.log(`🕯️ Importing ${products.length} real products...`);
  
  for (const product of products) {
    try {
      // Skip corrupted product (id: 12)
      if (product.id === "12" || product.name === "Valentine's Special" && product.description.includes("drrddrrdolate")) {
        console.log(`⚠️ Skipping corrupted product: ${product.name}`);
        continue;
      }
      
      // Get category ID
      const categoryResult = await client.query(
        'SELECT id FROM categories WHERE name = $1',
        [product.scentCategory]
      );
      
      if (categoryResult.rows.length === 0) {
        console.log(`❌ Category not found: ${product.scentCategory}`);
        continue;
      }
      
      const categoryId = categoryResult.rows[0].id;
      
      // Convert price from rupees to decimal (assuming prices are in rupees)
      const price = parseFloat(product.price) / 100; // Convert to decimal format
      
      // Insert product
      const result = await client.query(`
        INSERT INTO products (name, description, price, scent_category_id, burn_time, image_url, popularity, stock_quantity, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id
      `, [
        product.name,
        product.description,
        price,
        categoryId,
        product.burnTime,
        product.imageUrl,
        Math.floor(Math.random() * 50) + 50, // Random popularity 50-100
        50 // Default stock quantity
      ]);
      
      const productId = result.rows[0].id;
      
      // Parse scent notes (they're in a single string format)
      if (product.scentNotes) {
        // Split by | and clean up
        const scentNotes = product.scentNotes.split('|').map(note => note.trim());
        for (const scentNote of scentNotes) {
          if (scentNote) {
            await client.query(`
              INSERT INTO product_scent_notes (product_id, scent_note)
              VALUES ($1, $2)
            `, [productId, scentNote]);
          }
        }
      }
      
      // Parse ingredients (they're in a single string format)
      if (product.ingredients) {
        // Split by comma and clean up
        const ingredients = product.ingredients.split(',').map(ingredient => ingredient.trim());
        for (const ingredient of ingredients) {
          if (ingredient) {
            await client.query(`
              INSERT INTO product_ingredients (product_id, ingredient)
              VALUES ($1, $2)
            `, [productId, ingredient]);
          }
        }
      }
      
      // Update category product count
      await client.query(`
        UPDATE categories 
        SET product_count = product_count + 1 
        WHERE id = $1
      `, [categoryId]);
      
      console.log(`✅ Imported product: ${product.name} (₹${product.price})`);
      
    } catch (error) {
      console.error(`❌ Error importing product ${product.name}:`, error.message);
    }
  }
}

async function createSampleReviews(client) {
  console.log('⭐ Creating sample reviews for real products...');
  
  // Get all products
  const productsResult = await client.query('SELECT id, name FROM products ORDER BY created_at');
  const products = productsResult.rows;
  
  const sampleReviews = [
    {
      authorName: "Priya Sharma",
      authorEmail: "priya@example.com",
      rating: 5,
      reviewText: "Absolutely love this candle! The scent is perfect and it burns beautifully. Highly recommended!",
      reviewDate: "2024-06-10T10:00:00Z"
    },
    {
      authorName: "Rahul Patel",
      authorEmail: "rahul@example.com",
      rating: 4,
      reviewText: "Great quality candle with amazing fragrance. The burn time is excellent and the packaging is beautiful.",
      reviewDate: "2024-05-25T14:30:00Z"
    },
    {
      authorName: "Ananya Gupta",
      authorEmail: "ananya@example.com",
      rating: 5,
      reviewText: "This is my favorite candle! The scent fills the entire room and lasts for hours. Will definitely buy again.",
      reviewDate: "2024-06-05T09:15:00Z"
    },
    {
      authorName: "Arjun Singh",
      authorEmail: "arjun@example.com",
      rating: 4,
      reviewText: "Good quality candle with nice fragrance. The price is reasonable and the burn time is as advertised.",
      reviewDate: "2024-05-15T16:45:00Z"
    },
    {
      authorName: "Neha Kapoor",
      authorEmail: "neha@example.com",
      rating: 5,
      reviewText: "Excellent candle! The scent is divine and the quality is top-notch. Perfect for gifting or personal use.",
      reviewDate: "2024-06-18T11:20:00Z"
    }
  ];
  
  // Add reviews to random products
  for (let i = 0; i < Math.min(products.length, sampleReviews.length); i++) {
    const product = products[i];
    const review = sampleReviews[i];
    
    await client.query(`
      INSERT INTO reviews (product_id, author_name, author_email, rating, review_text, review_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    `, [
      product.id,
      review.authorName,
      review.authorEmail,
      review.rating,
      review.reviewText,
      review.reviewDate
    ]);
    
    console.log(`✅ Added review for ${product.name}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting real Firebase data import...');
    
    const client = await connectToDatabase();
    
    // Read the real Firebase data
    const dataPath = path.join(__dirname, '..', 'kraftika-backend', 'src', 'main', 'kraftika-scents-default-rtdb-export.json');
    const data = await fs.readFile(dataPath, 'utf8');
    const products = JSON.parse(data);
    
    console.log(`📦 Found ${products.length} products in Firebase export`);
    
    // Clear existing data
    await clearExistingData(client);
    
    // Create real categories
    await createRealCategories(client);
    
    // Import real products
    await importRealProducts(client, products);
    
    // Create sample reviews
    await createSampleReviews(client);
    
    console.log('🎉 Real Firebase data import completed successfully!');
    
    // Show summary
    const categoriesResult = await client.query('SELECT COUNT(*) FROM categories');
    const productsResult = await client.query('SELECT COUNT(*) FROM products');
    const reviewsResult = await client.query('SELECT COUNT(*) FROM reviews');
    
    console.log('\n📊 Import Summary:');
    console.log(`- Categories: ${categoriesResult.rows[0].count}`);
    console.log(`- Products: ${productsResult.rows[0].count}`);
    console.log(`- Reviews: ${reviewsResult.rows[0].count}`);
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
if (require.main === module) {
  main();
}

module.exports = { main };

