import { storage } from '../lib/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

async function downloadImagesFromFirebase() {
  try {
    console.log('🚀 Starting image download from Firebase Storage...');
    
    // List all images in the products folder
    const productsRef = ref(storage, 'products');
    const result = await listAll(productsRef);
    
    console.log(`📁 Found ${result.items.length} images in Firebase Storage`);
    
    // Create public folder if it doesn't exist
    const publicDir = join(process.cwd(), 'public');
    try {
      mkdirSync(publicDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    
    // Download each image
    for (const item of result.items) {
      try {
        const url = await getDownloadURL(item);
        const fileName = item.name.split('-').slice(1).join('-'); // Remove UUID prefix
        
        console.log(`⬇️  Downloading: ${fileName}`);
        
        // Download the image
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to download ${fileName}: ${response.statusText}`);
        }
        
        const buffer = await response.buffer();
        const filePath = join(publicDir, fileName);
        
        // Write to public folder
        writeFileSync(filePath, buffer);
        console.log(`✅ Downloaded: ${fileName}`);
        
      } catch (error) {
        console.error(`❌ Error downloading ${item.name}:`, error);
      }
    }
    
    console.log('🎉 Image download complete!');
    console.log('📁 Check your public/ folder for the downloaded images');
    
  } catch (error) {
    console.error('❌ Error in download process:', error);
  }
}

// Run the download function
downloadImagesFromFirebase();
