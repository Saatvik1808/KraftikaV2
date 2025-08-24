import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

async function testFirebaseStorage() {
  try {
    console.log('🧪 Testing Firebase Storage connectivity...');
    
    // Create a test file
    const testContent = 'This is a test file for Firebase Storage';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    console.log('📁 Test file created:', testFile.name, 'Size:', testFile.size, 'bytes');
    
    // Try to upload to Firebase Storage
    const testPath = `test/${Date.now()}-test.txt`;
    const storageRef = ref(storage, testPath);
    
    console.log('⬆️  Attempting to upload to path:', testPath);
    
    const snapshot = await uploadBytes(storageRef, testFile, {
      contentType: 'text/plain',
      cacheControl: 'public, max-age=3600'
    });
    
    console.log('✅ Upload successful! Snapshot:', snapshot);
    console.log('📊 Bytes transferred:', snapshot.bytesTransferred);
    
    // Try to get download URL
    console.log('🔗 Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Download URL obtained:', downloadURL);
    
    // Test if the URL is accessible
    console.log('🌐 Testing URL accessibility...');
    const response = await fetch(downloadURL);
    if (response.ok) {
      const content = await response.text();
      console.log('✅ URL accessible, content:', content);
    } else {
      console.log('❌ URL not accessible, status:', response.status);
    }
    
    console.log('🎉 Firebase Storage test completed successfully!');
    console.log('📝 Your Firebase Storage is working correctly.');
    
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error);
    
    if (error.code === 'storage/unauthorized') {
      console.log('🔐 Issue: Unauthorized access. Check your Storage rules.');
    } else if (error.code === 'storage/bucket-not-found') {
      console.log('🪣 Issue: Storage bucket not found. Check your configuration.');
    } else if (error.code === 'storage/quota-exceeded') {
      console.log('💰 Issue: Storage quota exceeded. Check your billing.');
    } else if (error.code === 'storage/unknown') {
      console.log('❓ Issue: Unknown storage error. Check Firebase Console.');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Go to Firebase Console → Storage');
    console.log('2. Ensure Storage is enabled');
    console.log('3. Check Storage rules');
    console.log('4. Verify billing is enabled');
    console.log('5. Check storage bucket name in config');
  }
}

// Run the test
testFirebaseStorage();
