"use server";

import { z } from "zod";
import { uploadImageToCloudinary, uploadVideoToCloudinary } from "@/lib/cloudinary";
import { addProduct, updateProduct } from "@/services/products-unified";
import { useSpringBootAPI } from "@/services/config";
import { getCategories } from "@/services/categories-unified";

// Helper function to get category ID from category name
async function getCategoryIdByName(categoryName: string): Promise<string | null> {
  try {
    const categories = await getCategories();
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : null;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

// --- ADD PRODUCT ---
const addProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  scentCategory: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price is required"),
  description: z.string().min(10, "Description is required"),
  scentNotes: z.string().min(3, "Scent notes are required"),
  burnTime: z.string().min(3, "Burn time is required"),
  ingredients: z.string().min(10, "Ingredients are required"),
  images: z.array(z.instanceof(File)).min(1, "At least one product image is required."),
  video: z.instanceof(File).optional(),
});

type AddFormState = {
  success: boolean;
  message?: string;
  error?: string;
  imageUrls?: string[];
  videoUrl?: string;
};

export async function addProductAction(formData: FormData): Promise<AddFormState> {
  const rawData = Object.fromEntries(formData.entries());
  
  // Extract images and video files separately
  const imageFiles: File[] = [];
  const images = formData.getAll('images');
  images.forEach((item) => {
    if (item instanceof File) {
      imageFiles.push(item);
    }
  });
  
  const videoFile = formData.get('video') as File | null;
  
  // Create a modified rawData with images array for validation
  const dataForValidation = {
    ...rawData,
    images: imageFiles
  };
  
  const validatedFields = addProductSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid product data provided.",
    };
  }
  
  const { images: validatedImages, video, ...productData } = validatedFields.data;

  try {
    // Upload all images to Cloudinary
    const imageUploadPromises = validatedImages.map((imageFile: File) => 
      uploadImageToCloudinary(imageFile, 'kraftika-products')
    );
    const imageUploadResults = await Promise.all(imageUploadPromises);
    const imageUrls = imageUploadResults.map(result => result.url);

    // Upload video to Cloudinary if provided
    let videoUrl: string | undefined;
    const videoToUpload = video || videoFile;
    if (videoToUpload && videoToUpload.size > 0) {
      try {
        const { url } = await uploadVideoToCloudinary(videoToUpload, 'kraftika-products/videos');
        videoUrl = url;
      } catch (videoError) {
        console.error('Video upload error:', videoError);
        // Continue without video if upload fails
      }
    }

    const newProductData = {
      ...productData,
      imageUrls: imageUrls,
      videoUrl: videoUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularity: 0,
    };

    if (useSpringBootAPI()) {
      // Get category ID from category name
      const categoryId = await getCategoryIdByName(newProductData.scentCategory);
      if (!categoryId) {
        return {
          success: false,
          error: `Category "${newProductData.scentCategory}" not found`
        };
      }

      // Transform data for Spring Boot API
      const springBootData = {
        name: newProductData.name,
        description: newProductData.description,
        price: newProductData.price,
        imageUrls: newProductData.imageUrls,
        burnTime: newProductData.burnTime,
        popularity: newProductData.popularity,
        scentNotes: newProductData.scentNotes.split(',').map(note => note.trim()),
        ingredients: newProductData.ingredients.split(',').map(ingredient => ingredient.trim()),
        scentCategoryId: categoryId,
      };

      const authTokenAdd = (formData.get('_authToken') as string) || undefined;
            const result = await addProduct(springBootData, authTokenAdd);
      
      if (result.success) {
        return { 
          success: true, 
          message: "Product added successfully!",
          imageUrls: imageUrls,
          videoUrl: videoUrl
        };
      } else {
        return { 
          success: false, 
          error: result.error || "Failed to add product"
        };
      }
    } else {
      // Fallback to Firebase (this would need to be implemented)
      return {
        success: false,
        error: "Firebase add product not implemented in unified actions"
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}

// --- UPDATE PRODUCT ---
const updateProductSchema = z.object({
    name: z.string().min(2, "Name is required"),
    scentCategory: z.string().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price is required"),
    description: z.string().min(10, "Description is required"),
    scentNotes: z.string().min(3, "Scent notes are required"),
    burnTime: z.string().min(3, "Burn time is required"),
    ingredients: z.string().min(10, "Ingredients are required"),
    imageUrl: z.string().optional(), // Keep for backward compatibility
    imageUrls: z.string().optional(), // Current image URLs as comma-separated string
    videoUrl: z.string().optional(), // Keep track of current/new video URL
    popularity: z.coerce.number().min(0),
    images: z.array(z.instanceof(File)).optional(), // New images are optional
    video: z.any().optional(), // New video is optional
});

type UpdateFormState = {
  success: boolean;
  message?: string;
  error?: string;
  imageUrls?: string[];
  videoUrl?: string;
};

export async function updateProductAction(id: string, formData: FormData): Promise<UpdateFormState> {
    try {
        // Handle Next.js serialized form data
        const rawData = Object.fromEntries(formData.entries());
        
        // Extract the actual data from serialized form (remove prefixes like "1_")
        const productData = {
            name: rawData['1_name'] || rawData.name || '',
            description: rawData['1_description'] || rawData.description || '',
            price: rawData['1_price'] || rawData.price || '0',
            scentCategory: rawData['1_scentCategory'] || rawData.scentCategory || '',
            scentNotes: rawData['1_scentNotes'] || rawData.scentNotes || '',
            burnTime: rawData['1_burnTime'] || rawData.burnTime || '',
            ingredients: rawData['1_ingredients'] || rawData.ingredients || '',
            imageUrl: rawData['1_imageUrl'] || rawData.imageUrl || '',
            imageUrls: rawData['1_imageUrls'] || rawData.imageUrls || '',
            videoUrl: rawData['1_videoUrl'] || rawData.videoUrl || '',
            popularity: rawData['1_popularity'] || rawData.popularity || '0',
        };

        // Get current image URLs from form data or parse from JSON
        let currentImageUrls: string[] = [];
        const currentImageUrlsStr = formData.get('currentImageUrls') as string | null;
        if (currentImageUrlsStr) {
            try {
                currentImageUrls = JSON.parse(currentImageUrlsStr);
            } catch {
                // If not JSON, try comma-separated string
                currentImageUrls = productData.imageUrls ? productData.imageUrls.split(',').filter(Boolean) : [];
            }
        } else if (productData.imageUrls) {
            currentImageUrls = productData.imageUrls.split(',').filter(Boolean);
        }

        // Get new image files
        const imageFiles: File[] = [];
        const images = formData.getAll('images');
        images.forEach((item) => {
            if (item instanceof File && item.size > 0) {
                imageFiles.push(item);
            }
        });
        
        // Get the video file (it might be named '1_video' or 'video')
        const videoFile = formData.get('1_video') as File || formData.get('video') as File;
        
        // Validate the extracted data
        const validatedFields = updateProductSchema.safeParse({
            ...productData,
            images: imageFiles.length > 0 ? imageFiles : undefined
        });

        if (!validatedFields.success) {
            console.error('Validation error:', validatedFields.error);
            return {
                success: false,
                error: "Invalid product data provided.",
            };
        }

        const { images: validatedImages, video, ...validatedProductData } = validatedFields.data;
        let finalImageUrls = currentImageUrls;
        let finalVideoUrl = validatedProductData.videoUrl;

        // Upload new images if provided
        if (validatedImages && validatedImages.length > 0) {
            try {
                const imageUploadPromises = validatedImages.map((imageFile: File) => 
                    uploadImageToCloudinary(imageFile, 'kraftika-products')
                );
                const imageUploadResults = await Promise.all(imageUploadPromises);
                const newImageUrls = imageUploadResults.map(result => result.url);
                finalImageUrls = [...currentImageUrls, ...newImageUrls];
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return {
                    success: false,
                    error: "Failed to upload images. Please try again.",
                };
            }
        }

        // If a new video is provided, upload it
        if (videoFile && videoFile.size > 0) {
            try {
                const { url } = await uploadVideoToCloudinary(videoFile, 'kraftika-products/videos');
                finalVideoUrl = url;
            } catch (uploadError) {
                console.error('Video upload error:', uploadError);
                // Continue without video if upload fails, but log the error
            }
        }

        if (useSpringBootAPI()) {
            // Get category ID from category name
            const categoryId = await getCategoryIdByName(validatedProductData.scentCategory);
            if (!categoryId) {
                return {
                    success: false,
                    error: `Category "${validatedProductData.scentCategory}" not found`
                };
            }

            // Transform data for Spring Boot API
            const springBootData: any = {
                name: validatedProductData.name,
                description: validatedProductData.description,
                price: validatedProductData.price,
                imageUrls: finalImageUrls,
                burnTime: validatedProductData.burnTime,
                popularity: validatedProductData.popularity,
                scentNotes: validatedProductData.scentNotes.split(',').map(note => note.trim()),
                ingredients: validatedProductData.ingredients.split(',').map(ingredient => ingredient.trim()),
                scentCategoryId: categoryId,
            };
            
            // Add videoUrl if it exists
            if (finalVideoUrl) {
                springBootData.videoUrl = finalVideoUrl;
            }

            const authToken = (formData.get('_authToken') as string) || undefined;
            const result = await updateProduct(id, springBootData, authToken);
            
            if (result.success) {
                return {
                    success: true,
                    message: "Product updated successfully!",
                    imageUrls: finalImageUrls,
                    videoUrl: finalVideoUrl
                };
            } else {
                return {
                    success: false,
                    error: result.error || "Failed to update product"
                };
            }
        } else {
            // Fallback to Firebase (this would need to be implemented)
            return {
                success: false,
                error: "Firebase update product not implemented in unified actions"
            };
        }

    } catch (error) {
        console.error('Update product error:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { 
            success: false, 
            error: `Failed to update product: ${errorMessage}` 
        };
    }
}
