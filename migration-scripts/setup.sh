#!/bin/bash

# Kraftika Data Migration Setup Script

echo "🚀 Setting up Kraftika Firebase to PostgreSQL migration..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing migration dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create exports directory
mkdir -p exports

echo "📁 Created exports directory"

# Check PostgreSQL connection
echo "🔍 Checking PostgreSQL connection..."
node -e "
const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'kraftika_db',
  user: 'kraftika_user',
  password: 'kraftika_password'
});

client.connect()
  .then(() => {
    console.log('✅ PostgreSQL connection successful');
    client.end();
  })
  .catch(err => {
    console.log('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  });
"

if [ $? -ne 0 ]; then
    echo "❌ PostgreSQL connection failed. Please check your database setup."
    exit 1
fi

echo ""
echo "🎉 Migration setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run sample data migration: npm run migrate"
echo "2. Export Firebase data (if you have existing data): npm run export-firebase"
echo "3. Import Firebase data: npm run import-postgres"
echo ""
echo "📚 For more information, see README.md"

