
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import type { Candle } from "@/types/candle";

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

export async function addProduct(formData: FormData): Promise<AddFormState> {
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

    await addDoc(collection(db, "products"), newProductData);

    return { 
      success: true, 
      message: "Product added successfully!",
      imageUrl: imageUrl
    };
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

export async function updateProduct(id: string, formData: FormData): Promise<UpdateFormState> {
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

        const productRef = doc(db, 'products', id);

        const updateData: Partial<Candle> = {
            ...validatedProductData,
            imageUrl: finalImageUrl,
            updatedAt: new Date().toISOString()
        };

        await updateDoc(productRef, updateData);

        return {
            success: true,
            message: "Product updated successfully!",
            imageUrl: finalImageUrl
        };

    } catch (error) {
        console.error('Update product error:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { 
            success: false, 
            error: `Failed to update product: ${errorMessage}` 
        };
    }
}
