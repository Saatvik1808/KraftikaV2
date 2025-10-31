#!/usr/bin/env node

/**
 * Firebase Data Export Script
 * Exports data from Firebase Firestore to JSON files
 */

const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  // You'll need to add your Firebase service account configuration here
  // Get this from Firebase Console > Project Settings > Service Accounts
};

async function initializeFirebase() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.log('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set.');
    console.log('Please set it with your Firebase service account JSON.');
    console.log('Example: export FIREBASE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
    return app;
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    return null;
  }
}

async function exportCollection(db, collectionName) {
  console.log(`📤 Exporting ${collectionName} collection...`);
  
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Exported ${data.length} documents from ${collectionName}`);
    return data;
  } catch (error) {
    console.error(`❌ Error exporting ${collectionName}:`, error);
    return [];
  }
}

async function exportAllData() {
  const app = await initializeFirebase();
  if (!app) {
    console.log('❌ Cannot proceed without Firebase initialization');
    return;
  }

  const db = admin.firestore();
  const exportDir = path.join(__dirname, 'exports');
  
  // Create exports directory
  try {
    await fs.mkdir(exportDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  console.log('🚀 Starting Firebase data export...');

  // Export collections
  const collections = ['products', 'categories', 'users', 'reviews', 'orders'];
  const exportData = {};

  for (const collectionName of collections) {
    const data = await exportCollection(db, collectionName);
    exportData[collectionName] = data;
    
    // Save individual collection files
    const filePath = path.join(exportDir, `${collectionName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved ${collectionName}.json`);
  }

  // Save combined export
  const combinedPath = path.join(exportDir, 'firebase-export.json');
  await fs.writeFile(combinedPath, JSON.stringify(exportData, null, 2));
  console.log(`💾 Saved combined export: firebase-export.json`);

  // Generate summary
  console.log('\n📊 Export Summary:');
  Object.entries(exportData).forEach(([collection, data]) => {
    console.log(`- ${collection}: ${data.length} documents`);
  });

  console.log(`\n✅ Export completed! Files saved to: ${exportDir}`);
}

// Run export
if (require.main === module) {
  exportAllData().catch(console.error);
}

module.exports = { exportAllData };

