# Firebase Storage Troubleshooting Guide

## 🚨 Current Issue: Firebase Storage 404 Error

You're experiencing a `storage/unknown` error with a 404 status when trying to upload images. This typically means Firebase Storage is not properly configured or accessible.

## 🔍 Error Analysis

```
❌ Error adding product: [Error [FirebaseError]: Firebase Storage: An unknown error occurred, please check the error payload for server response. (storage/unknown)] {
  code: 'storage/unknown',
  customData: [Object],
  status_: 404,
  _baseMessage: 'Firebase Storage: An unknown error occurred, please check the error payload for server response. (storage/unknown)'
}
```

**Status 404** indicates that the Firebase Storage service is not accessible or not properly configured.

## 🛠️ Step-by-Step Fix

### 1. **Enable Firebase Storage in Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kraftika-scents`
3. In the left sidebar, click **Storage**
4. If you see "Get started" button, click it
5. Choose a location (preferably close to your users)
6. Start in test mode (you can secure it later)

### 2. **Update Firebase Storage Rules**

In Firebase Console → Storage → Rules, set these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. **Verify Storage Bucket Configuration**

Check your Firebase config in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC5fUKR-lXoNxA3Z8SjpPOaYIGcQ7pDa4k",
  authDomain: "kraftika-scents.firebaseapp.com",
  projectId: "kraftika-scents",
  storageBucket: "kraftika-scents.appspot.com", // This should match
  messagingSenderId: "185008785004",
  appId: "1:185008785004:web:46c12991e51a8cb8fa7a49"
};
```

**Important**: The `storageBucket` should match exactly what's shown in Firebase Console.

### 4. **Check Project Billing**

Firebase Storage requires billing to be enabled:
1. Go to Firebase Console → Usage and billing
2. Ensure billing is set up
3. Check if you have any quotas or limits

### 5. **Verify Authentication State**

Make sure you're logged in as an admin user:
1. Check if you're authenticated in the admin panel
2. Verify your user has the necessary permissions
3. Check browser console for auth errors

## 🔧 Alternative Solutions

### **Option 1: Fix Firebase Storage (Recommended)**

Follow the steps above to properly configure Firebase Storage.

### **Option 2: Use Current Fallback System**

The system now has a fallback that allows you to add products even when Firebase Storage fails:

1. **Product Still Gets Added**: The product is saved to Firestore
2. **Manual Image Management**: You manually save images to your `public/` folder
3. **Suggested Path**: You get a suggested path for the image
4. **Warning Displayed**: Clear indication that manual upload is required

### **Option 3: Temporary Disable Firebase Storage**

If you want to temporarily disable Firebase Storage uploads, you can modify the admin actions to skip the upload step entirely.

## 🧪 Testing Steps

### **Test 1: Basic Storage Access**
```bash
# Check if storage bucket is accessible
curl -I "https://storage.googleapis.com/kraftika-scents.appspot.com/"
```

### **Test 2: Firebase Console**
1. Go to Firebase Console → Storage
2. Try to manually upload a test file
3. Check if you can see the file in the storage browser

### **Test 3: Browser Console**
1. Open browser developer tools
2. Go to Console tab
3. Try to add a product
4. Look for detailed error messages

## 📋 Common Issues & Solutions

### **Issue: "Storage bucket not found"**
- **Solution**: Verify the storage bucket name in Firebase Console
- **Check**: Ensure `storageBucket` in config matches exactly

### **Issue: "Permission denied"**
- **Solution**: Update Storage rules to allow authenticated users
- **Check**: Verify you're logged in as an admin user

### **Issue: "Billing not enabled"**
- **Solution**: Enable billing in Firebase Console
- **Check**: Go to Usage and billing section

### **Issue: "Location not set"**
- **Solution**: Set a storage location in Firebase Console
- **Check**: Storage → Rules → Location

## 🚀 Quick Fix Commands

### **Check Current Status**
```bash
# Test if you can access Firebase Storage
npm run dev
# Then try to add a product and check console logs
```

### **Verify Configuration**
```bash
# Check your Firebase config
cat src/lib/firebase.ts
```

### **Test Storage Rules**
```bash
# In Firebase Console, test these rules:
# Allow read: true
# Allow write: if request.auth != null
```

## 📞 Support Resources

### **Firebase Documentation**
- [Firebase Storage Setup](https://firebase.google.com/docs/storage/web/start)
- [Storage Rules](https://firebase.google.com/docs/storage/security)
- [Troubleshooting](https://firebase.google.com/docs/storage/web/troubleshooting)

### **Common Error Codes**
- `storage/unknown`: Usually configuration or permission issue
- `storage/unauthorized`: Authentication or rules issue
- `storage/quota-exceeded`: Billing or quota issue
- `storage/bucket-not-found`: Configuration issue

## ✅ Success Checklist

- [ ] Firebase Storage is enabled in console
- [ ] Storage rules allow authenticated uploads
- [ ] Storage bucket name matches config exactly
- [ ] Billing is enabled
- [ ] Storage location is set
- [ ] You're authenticated as admin user
- [ ] No console errors in browser
- [ ] Test upload works in Firebase Console

## 🔄 Current Workaround

Until Firebase Storage is fixed, the system will:

1. **Add the product** to Firestore successfully
2. **Show a warning** about Firebase Storage failure
3. **Provide instructions** for manual image management
4. **Give you the suggested path** for saving to public folder

This ensures your workflow isn't completely blocked while we resolve the Firebase Storage issue.

## 📝 Next Steps

1. **Try the fixes above** to resolve Firebase Storage
2. **Test with a small image** first
3. **Check browser console** for detailed error messages
4. **Verify in Firebase Console** that Storage is working
5. **Update this guide** with any new findings

The system is designed to be resilient, so even if Firebase Storage fails, you can still manage your products effectively.
