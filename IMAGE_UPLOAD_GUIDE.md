# Image Upload System Guide

This guide explains how to use the new image upload system for your Kraftika admin dashboard.

## 🖼️ How It Works

The image upload system works in two phases:

1. **Upload to Firebase Storage**: Images are uploaded to Firebase Storage for temporary storage
2. **Save to Public Folder**: You manually save images to your `public/` folder using the suggested paths

## 📁 Current Setup

Your images are currently stored in the `public/` folder with paths like:
- `/aes.jpeg`
- `/ocean.jpeg`
- `/valentine.jpeg`
- `/flower.jpeg`
- `/coffee.jpeg`
- `/grass.jpeg`
- `/mocha.jpeg`
- `/candleImage.jpeg`

## 🚀 Using the New Upload System

### Adding New Products

1. **Go to Admin Dashboard** → **Products** → **Add Product**
2. **Upload Image**: 
   - Drag & drop an image file
   - Or click "Choose Image" to browse
   - Supported formats: PNG, JPEG, WebP
   - Maximum size: 10MB
3. **Fill Product Details**: Complete all required fields
4. **Submit Form**: Click "Add Product"

### After Upload

You'll see a success message with:

- **Suggested Public Path**: The path to save in your `public/` folder
- **Firebase Storage URL**: Backup URL if you need to download the image
- **Instructions**: Step-by-step guide to complete the process

### Completing the Process

1. **Download Image**: Use the Firebase Storage URL to download the image
2. **Save to Public Folder**: Save the image to your `public/` folder using the suggested path
3. **Verify**: The image should now be accessible from your website

## 🔧 Example Workflow

```
1. Upload "Sunrise Citrus.jpg" via admin form
2. Get suggested path: /sunrise-citrus.jpg
3. Download image from Firebase Storage
4. Save as "sunrise-citrus.jpg" in your public/ folder
5. Image is now accessible at /sunrise-citrus.jpg
```

## 📝 Editing Products

When editing existing products:

1. **Current Image**: Shows the existing image with download/view options
2. **Upload New Image**: Option to replace with a new image
3. **Same Process**: Follows the same upload workflow
4. **Update Path**: The `imageUrl` field will be updated automatically

## 🎯 Benefits of This System

### ✅ Advantages
- **Secure Storage**: Images are safely stored in Firebase Storage
- **Backup URLs**: Firebase URLs serve as backup if public folder images are lost
- **Consistent Paths**: Suggested paths follow your naming convention
- **Easy Management**: Clear instructions for each upload
- **Drag & Drop**: Modern, user-friendly interface

### ⚠️ Considerations
- **Manual Step**: Requires manually saving images to public folder
- **Two Locations**: Images exist in both Firebase Storage and public folder
- **Path Management**: Need to maintain consistent naming conventions

## 🛠️ Technical Details

### Firebase Storage Structure
```
products/
├── uuid-product1.jpg
├── uuid-product2.png
└── uuid-product3.webp
```

### Public Folder Structure
```
public/
├── aes.jpeg
├── ocean.jpeg
├── valentine.jpeg
├── flower.jpeg
├── coffee.jpeg
├── grass.jpeg
├── mocha.jpeg
├── candleImage.jpeg
└── [new-uploads]/
```

### Database Fields
- `imageUrl`: Path to image in public folder (e.g., `/aes.jpeg`)
- `firebaseImageUrl`: Firebase Storage URL as backup
- `updatedAt`: Timestamp of last update

## 🔍 Troubleshooting

### Image Not Showing
1. Check if image exists in `public/` folder
2. Verify the path in `imageUrl` field
3. Ensure image filename matches exactly (case-sensitive)

### Upload Failed
1. Check file size (max 10MB)
2. Verify file format (PNG, JPEG, WebP only)
3. Check Firebase configuration
4. Review browser console for errors

### Path Issues
1. Ensure paths start with `/`
2. Use lowercase filenames
3. Replace spaces with hyphens
4. Avoid special characters

## 📋 Best Practices

### File Naming
- Use descriptive names: `sunrise-citrus.jpg`
- Use lowercase letters
- Replace spaces with hyphens
- Keep names short but meaningful

### Image Optimization
- Use appropriate formats (JPEG for photos, PNG for graphics)
- Optimize file sizes (under 1MB when possible)
- Maintain consistent dimensions for similar products
- Use high quality for product images

### Organization
- Keep all product images in the root of `public/` folder
- Use consistent naming conventions
- Document any special naming rules
- Regular cleanup of unused images

## 🚀 Future Enhancements

Potential improvements for the future:

1. **Automatic Download**: Script to automatically download and save images
2. **Image Processing**: Automatic resizing and optimization
3. **Bulk Upload**: Upload multiple images at once
4. **Image Library**: Browse and reuse previously uploaded images
5. **CDN Integration**: Use a CDN for better image delivery

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Firebase configuration in `src/lib/firebase.ts`
3. Ensure Firebase Storage rules allow uploads
4. Check network connectivity for Firebase services

## 🔐 Firebase Storage Rules

Make sure your Firebase Storage rules allow uploads:

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

This system provides a robust, secure way to manage your product images while maintaining the flexibility of your current public folder setup.
