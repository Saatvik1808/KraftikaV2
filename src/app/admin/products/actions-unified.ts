"use server";

import { z } from "zod";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
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
  image: z.instanceof(File).refine(file => file.size > 0, "Product image is required."),
});

type AddFormState = {
  success: boolean;
  message?: string;
  error?: string;
  imageUrl?: string;
  fileName?: string;
};

export async function addProductAction(formData: FormData): Promise<AddFormState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = addProductSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid product data provided.",
    };
  }
  
  const { image, ...productData } = validatedFields.data;
  const imageFile = image as File;

  try {
    // Upload to Cloudinary
    const { url: imageUrl } = await uploadImageToCloudinary(imageFile, 'kraftika-products');

    const newProductData = {
      ...productData,
      imageUrl: imageUrl,
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
        imageUrl: newProductData.imageUrl,
        burnTime: newProductData.burnTime,
        popularity: newProductData.popularity,
        scentNotes: newProductData.scentNotes.split(',').map(note => note.trim()),
        ingredients: newProductData.ingredients.split(',').map(ingredient => ingredient.trim()),
        scentCategoryId: categoryId,
      };

      const result = await addProduct(springBootData);
      
      if (result.success) {
        return { 
          success: true, 
          message: "Product added successfully!",
          imageUrl: imageUrl
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
    imageUrl: z.string(), // Keep track of current/new URL
    popularity: z.coerce.number().min(0),
    image: z.any().optional(), // New image is optional - using z.any() to handle File or undefined
});

type UpdateFormState = {
  success: boolean;
  message?: string;
  error?: string;
  imageUrl?: string;
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
            popularity: rawData['1_popularity'] || rawData.popularity || '0',
        };

        // Get the image file (it might be named '1_image' or 'image')
        const imageFile = formData.get('1_image') as File || formData.get('image') as File;
        
        // Validate the extracted data
        const validatedFields = updateProductSchema.safeParse({
            ...productData,
            image: imageFile
        });

        if (!validatedFields.success) {
            console.error('Validation error:', validatedFields.error);
            return {
                success: false,
                error: "Invalid product data provided.",
            };
        }

        const { image, ...validatedProductData } = validatedFields.data;
        let finalImageUrl = validatedProductData.imageUrl;

        // If a new image is provided, upload it
        if (image && image.size > 0) {
            try {
                const { url } = await uploadImageToCloudinary(image, 'kraftika-products');
                finalImageUrl = url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return {
                    success: false,
                    error: "Failed to upload image. Please try again.",
                };
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
            const springBootData = {
                name: validatedProductData.name,
                description: validatedProductData.description,
                price: validatedProductData.price,
                imageUrl: finalImageUrl,
                burnTime: validatedProductData.burnTime,
                popularity: validatedProductData.popularity,
                scentNotes: validatedProductData.scentNotes.split(',').map(note => note.trim()),
                ingredients: validatedProductData.ingredients.split(',').map(ingredient => ingredient.trim()),
                scentCategoryId: categoryId,
            };

            const result = await updateProduct(id, springBootData);
            
            if (result.success) {
                return {
                    success: true,
                    message: "Product updated successfully!",
                    imageUrl: finalImageUrl
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
