import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper function to upload image to Cloudinary
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'kraftika-products'
): Promise<{ url: string; publicId: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64 string
    const base64String = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;
    
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

// Helper function to upload video to Cloudinary
export async function uploadVideoToCloudinary(
  file: File,
  folder: string = 'kraftika-products/videos'
): Promise<{ url: string; publicId: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64 string
    const base64String = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;
    
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder,
      resource_type: 'video',
      quality: 'auto',
      fetch_format: 'auto',
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
}

// Helper function to delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

// Helper function to delete video from Cloudinary
export async function deleteVideoFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    return true;
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error);
    return false;
  }
}
