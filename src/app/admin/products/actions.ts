
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// This schema is for form validation, the action will receive FormData
const productSchema = z.object({
  name: z.string().min(2),
  scentCategory: z.string().min(1),
  price: z.coerce.number().min(0),
  description: z.string().min(10),
  scentNotes: z.string().min(3),
  burnTime: z.string().min(3),
  ingredients: z.string().min(10),
  image: z.instanceof(File).refine(file => file.size > 0, "Product image is required."),
});

type FormState = {
  success: boolean;
  message?: string;
  error?: string;
  imageUrl?: string;
  fileName?: string;
};

// The function now accepts FormData
export async function addProduct(formData: FormData): Promise<FormState> {
  console.log("addProduct server action started with FormData.");

  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error("Server-side validation failed:", validatedFields.error.flatten());
    return {
      success: false,
      error: "Invalid product data provided.",
    };
  }
  
  const { image, ...productData } = validatedFields.data;
  const imageFile = image as File;

  console.log("Validation successful. Processing image:", imageFile.name);

  try {
    // 1. Upload image to local public folder via API
    const uploadFormData = new FormData();
    uploadFormData.append('image', imageFile);
    
    console.log("Uploading image to local public folder...");
    
    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    });
    
    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json();
      throw new Error(`Image upload failed: ${uploadError.error}`);
    }
    
    const uploadResult = await uploadResponse.json();
    console.log("Image upload successful:", uploadResult);
    
    // 2. Generate a user-friendly image path
    const originalName = imageFile.name.replace(/\s+/g, '-').toLowerCase();
    const suggestedPublicPath = `/uploads/${uploadResult.fileName}`;
    
    // 3. Add product data (including image URL) to Firestore
    const newProductData = {
      ...productData,
      imageUrl: suggestedPublicPath, // Path to image in public folder
      originalImageName: originalName, // Keep original filename for reference
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      popularity: 0, // Default popularity
    };

    console.log("Attempting to add document to Firestore with data:", newProductData);
    await addDoc(collection(db, "products"), newProductData);
    console.log("Successfully added document to Firestore.");

    return { 
      success: true, 
      message: "Product added successfully! Image saved to public folder.",
      imageUrl: suggestedPublicPath,
      fileName: uploadResult.fileName
    };
  } catch (error) {
    console.error("❌ Error adding product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}
