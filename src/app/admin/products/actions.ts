
"use server";

import { z } from "zod";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const productSchema = z.object({
  name: z.string().min(2),
  scentCategory: z.string().min(1),
  price: z.coerce.number().min(0),
  description: z.string().min(10),
  scentNotes: z.string().min(3),
  burnTime: z.string().min(3),
  ingredients: z.string().min(10),
});

type FormState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function addProduct(formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = productSchema.safeParse(rawData);
  if (!validatedFields.success) {
    console.error("Server-side validation failed:", validatedFields.error.flatten());
    return {
      success: false,
      error: "Invalid product data provided.",
    };
  }

  const imageFile = formData.get("image") as File;
  if (!imageFile || imageFile.size === 0) {
    return { success: false, error: "Product image is required." };
  }

  try {
    // 1. Upload image to Firebase Storage
    const imagePath = `products/${uuidv4()}-${imageFile.name}`;
    const storageRef = ref(storage, imagePath);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // 2. Add product data (including image URL) to Firestore
    const newProductData = {
      ...validatedFields.data,
      imageUrl,
      createdAt: new Date().toISOString(),
      popularity: 0, // Default popularity
    };

    await addDoc(collection(db, "products"), newProductData);

    return { success: true, message: "Product added successfully!" };
  } catch (error) {
    console.error("Error adding product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}
