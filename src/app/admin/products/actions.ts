
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}.${fileExtension}`;
    
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
    
    const suggestedPublicPath = `/uploads/${fileName}`;

    const newProductData = {
      ...productData,
      imageUrl: suggestedPublicPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularity: 0,
    };

    await addDoc(collection(db, "products"), newProductData);

    return { 
      success: true, 
      message: "Product added successfully!",
      imageUrl: suggestedPublicPath,
      fileName: fileName
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
    image: z.instanceof(File).optional(), // New image is optional
});

type UpdateFormState = {
  success: boolean;
  message?: string;
  error?: string;
  imageUrl?: string;
};

export async function updateProduct(id: string, formData: FormData): Promise<UpdateFormState> {
    const rawData = Object.fromEntries(formData.entries());

    const validatedFields = updateProductSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
          success: false,
          error: "Invalid product data provided.",
        };
    }

    const { image, ...productData } = validatedFields.data;
    const imageFile = image as File | undefined;
    let finalImageUrl = productData.imageUrl;

    try {
        // If a new image is provided, upload it
        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExtension = imageFile.name.split('.').pop() || 'jpg';
            const uniqueId = uuidv4();
            const fileName = `${uniqueId}.${fileExtension}`;
            
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            const filePath = join(uploadDir, fileName);

            await mkdir(uploadDir, { recursive: true });
            await writeFile(filePath, buffer);
            
            finalImageUrl = `/uploads/${fileName}`;
        }

        const productRef = doc(db, 'products', id);

        const updateData: Partial<Candle> = {
            ...productData,
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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to update product: ${errorMessage}` };
    }
}
