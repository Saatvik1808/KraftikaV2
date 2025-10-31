# Kraftika Data Migration Guide

This guide helps you migrate your Kraftika data from Firebase Firestore to PostgreSQL.

## 🎯 What This Migration Does

- **Exports** existing data from Firebase Firestore
- **Creates** PostgreSQL database tables
- **Imports** data to PostgreSQL with proper relationships
- **Seeds** sample data if no existing data is found

## 📋 Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** (v14 or higher)
3. **Firebase Admin SDK** credentials (if you have existing data)

## 🚀 Quick Start

### 1. Setup Migration Environment

```bash
cd migration-scripts
chmod +x setup.sh
./setup.sh
```

### 2. Run Sample Data Migration

If you don't have existing Firebase data, run this to create sample data:

```bash
npm run migrate
```

This will:
- Create all necessary tables
- Seed 5 categories (Citrus, Floral, Sweet, Fresh, Fruity)
- Seed 8 sample products
- Seed 5 sample reviews
- Create an admin user

### 3. Export Existing Firebase Data (Optional)

If you have existing data in Firebase:

```bash
# Set your Firebase service account key
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Export data
npm run export-firebase
```

### 4. Import Firebase Data to PostgreSQL

```bash
npm run import-postgres
```

## 📊 Data Structure

### Categories
- **Citrus**: Energizing citrus scents
- **Floral**: Beautiful floral fragrances  
- **Sweet**: Warm sweet aromas
- **Fresh**: Clean fresh scents
- **Fruity**: Vibrant fruit fragrances

### Sample Products
1. **Ocean Breeze** - Fresh category
2. **Vanilla Dreams** - Sweet category
3. **Lavender Fields** - Floral category
4. **Citrus Sunrise** - Citrus category
5. **Coffee Mornings** - Sweet category
6. **Grass & Green** - Fresh category
7. **Mocha Delight** - Sweet category
8. **Candle Glow** - Sweet category

### Admin User
- **Email**: admin@kraftika.com
- **Password**: admin123
- **Role**: ADMIN

## 🔧 Configuration

### Database Configuration

The migration uses these default settings:

```javascript
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'kraftika_db',
  user: 'kraftika_user',
  password: 'anamika01'
};
```

You can override these with environment variables:

```bash
export DB_HOST=your-host
export DB_PORT=5432
export DB_NAME=your-database
export DB_USER=your-username
export DB_PASSWORD=your-password
```

### Firebase Configuration

To export existing Firebase data, you need a service account key:

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Set the environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

## 📁 File Structure

```
migration-scripts/
├── firebase-to-postgres.js    # Main migration script
├── export-firebase-data.js    # Firebase export script
├── import-to-postgres.js      # PostgreSQL import script
├── package.json               # Dependencies
├── setup.sh                  # Setup script
├── README.md                  # This file
└── exports/                  # Exported data (created during migration)
    ├── firebase-export.json   # Combined export
    ├── products.json         # Products export
    ├── categories.json       # Categories export
    └── ...
```

## 🔍 Verification

After migration, verify your data:

```sql
-- Connect to PostgreSQL
psql -U kraftika_user -d kraftika_db

-- Check tables
\dt

-- Check data
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM reviews;
SELECT COUNT(*) FROM users;

-- Check relationships
SELECT c.name, COUNT(p.id) as product_count 
FROM categories c 
LEFT JOIN products p ON c.id = p.scent_category_id 
GROUP BY c.id, c.name;
```

## 🚨 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@15

# Test connection
psql -U kraftika_user -d kraftika_db -c "SELECT version();"
```

### Firebase Export Issues

```bash
# Check Firebase configuration
echo $FIREBASE_SERVICE_ACCOUNT_KEY

# Test Firebase connection
node -e "
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
console.log('Firebase connected successfully');
"
```

### Migration Errors

1. **Check database permissions**:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE kraftika_db TO kraftika_user;
   ```

2. **Check table existence**:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

3. **Check data integrity**:
   ```sql
   SELECT * FROM products WHERE scent_category_id IS NULL;
   ```

## 📈 Next Steps

After successful migration:

1. **Update your Spring Boot application** to use the new data
2. **Test API endpoints** with the migrated data
3. **Update frontend** to use Spring Boot APIs instead of Firebase
4. **Set up production database** with proper security

## 🆘 Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify database and Firebase configurations
3. Ensure all dependencies are installed
4. Check file permissions and paths

## 📝 Notes

- The migration preserves all data relationships
- UUIDs are generated for new records
- Existing Firebase IDs are preserved when possible
- Arrays (scentNotes, ingredients) are properly handled
- Timestamps are converted to PostgreSQL format

