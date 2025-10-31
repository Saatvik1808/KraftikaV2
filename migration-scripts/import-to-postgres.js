#!/usr/bin/env node

/**
 * PostgreSQL Data Import Script
 * Imports exported Firebase data to PostgreSQL
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
  password: process.env.DB_PASSWORD || 'kraftika_password'
};

async function connectToDatabase() {
  const client = new Client(dbConfig);
  await client.connect();
  console.log('✅ Connected to PostgreSQL database');
  return client;
}

async function importCategories(client, categories) {
  console.log(`🏷️ Importing ${categories.length} categories...`);
  
  for (const category of categories) {
    try {
      await client.query(`
        INSERT INTO categories (id, name, description, color, icon, is_active, product_count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          color = EXCLUDED.color,
          icon = EXCLUDED.icon,
          is_active = EXCLUDED.is_active,
          product_count = EXCLUDED.product_count,
          updated_at = EXCLUDED.updated_at
      `, [
        category.id,
        category.name,
        category.description || null,
        category.color || null,
        category.icon || null,
        category.isActive !== false,
        category.productCount || 0,
        category.createdAt || new Date().toISOString(),
        category.updatedAt || new Date().toISOString()
      ]);
      
      console.log(`✅ Imported category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error importing category ${category.name}:`, error.message);
    }
  }
}

async function importProducts(client, products) {
  console.log(`🕯️ Importing ${products.length} products...`);
  
  for (const product of products) {
    try {
      // Handle scentCategory - it might be a string or an object
      let scentCategoryId = null;
      if (product.scentCategory) {
        if (typeof product.scentCategory === 'string') {
          // If it's a string, find the category by name
          const categoryResult = await client.query(
            'SELECT id FROM categories WHERE name = $1',
            [product.scentCategory]
          );
          if (categoryResult.rows.length > 0) {
            scentCategoryId = categoryResult.rows[0].id;
          }
        } else if (product.scentCategory.id) {
          // If it's an object with an id
          scentCategoryId = product.scentCategory.id;
        }
      }

      // Handle arrays for scentNotes and ingredients
      const scentNotes = Array.isArray(product.scentNotes) ? product.scentNotes : 
                        product.scentNotes ? [product.scentNotes] : [];
      const ingredients = Array.isArray(product.ingredients) ? product.ingredients : 
                         product.ingredients ? [product.ingredients] : [];

      await client.query(`
        INSERT INTO products (id, name, description, price, scent_category_id, scent_notes, burn_time, ingredients, image_url, popularity, stock_quantity, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          scent_category_id = EXCLUDED.scent_category_id,
          scent_notes = EXCLUDED.scent_notes,
          burn_time = EXCLUDED.burn_time,
          ingredients = EXCLUDED.ingredients,
          image_url = EXCLUDED.image_url,
          popularity = EXCLUDED.popularity,
          stock_quantity = EXCLUDED.stock_quantity,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
      `, [
        product.id,
        product.name,
        product.description || null,
        parseFloat(product.price) || 0,
        scentCategoryId,
        scentNotes,
        product.burnTime || null,
        ingredients,
        product.imageUrl || null,
        parseInt(product.popularity) || 0,
        parseInt(product.stockQuantity) || 0,
        product.isActive !== false,
        product.createdAt || new Date().toISOString(),
        product.updatedAt || new Date().toISOString()
      ]);
      
      console.log(`✅ Imported product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error importing product ${product.name}:`, error.message);
    }
  }
}

async function importUsers(client, users) {
  console.log(`👤 Importing ${users.length} users...`);
  
  for (const user of users) {
    try {
      await client.query(`
        INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          phone = EXCLUDED.phone,
          role = EXCLUDED.role,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
      `, [
        user.id,
        user.email,
        user.passwordHash || user.password_hash || 'temp_password_hash',
        user.firstName || user.first_name || null,
        user.lastName || user.last_name || null,
        user.phone || null,
        user.role || 'CUSTOMER',
        user.isActive !== false,
        user.createdAt || new Date().toISOString(),
        user.updatedAt || new Date().toISOString()
      ]);
      
      console.log(`✅ Imported user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error importing user ${user.email}:`, error.message);
    }
  }
}

async function importReviews(client, reviews) {
  console.log(`⭐ Importing ${reviews.length} reviews...`);
  
  for (const review of reviews) {
    try {
      await client.query(`
        INSERT INTO reviews (id, product_id, author_name, author_email, rating, review_text, review_date, is_verified, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          author_name = EXCLUDED.author_name,
          author_email = EXCLUDED.author_email,
          rating = EXCLUDED.rating,
          review_text = EXCLUDED.review_text,
          review_date = EXCLUDED.review_date,
          is_verified = EXCLUDED.is_verified
      `, [
        review.id,
        review.productId || review.product_id,
        review.authorName || review.author_name,
        review.authorEmail || review.author_email || null,
        parseInt(review.rating) || 5,
        review.reviewText || review.review_text || null,
        review.reviewDate || review.review_date || new Date().toISOString(),
        review.isVerified || review.is_verified || false,
        review.createdAt || new Date().toISOString()
      ]);
      
      console.log(`✅ Imported review by ${review.authorName || review.author_name}`);
    } catch (error) {
      console.error(`❌ Error importing review:`, error.message);
    }
  }
}

async function importFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
}

async function main() {
  try {
    console.log('🚀 Starting PostgreSQL data import...');
    
    const client = await connectToDatabase();
    
    // Import from combined export file
    const exportPath = path.join(__dirname, 'exports', 'firebase-export.json');
    const exportData = await importFromFile(exportPath);
    
    if (!exportData) {
      console.log('❌ No export data found. Please run export-firebase-data.js first.');
      return;
    }

    // Import data in order (categories first, then products, etc.)
    if (exportData.categories) {
      await importCategories(client, exportData.categories);
    }
    
    if (exportData.products) {
      await importProducts(client, exportData.products);
    }
    
    if (exportData.users) {
      await importUsers(client, exportData.users);
    }
    
    if (exportData.reviews) {
      await importReviews(client, exportData.reviews);
    }

    console.log('🎉 Import completed successfully!');
    
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

