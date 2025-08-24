
"use server";

import { z } from "zod";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  image: z.instanceof(File).refine(file => file.size > 0, "Image is required."),
});

type FormState = {
  success: boolean;
  message?: string;
  error?: string;
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

  console.log("Validation successful. Processing file:", imageFile.name);

  if (!imageFile || imageFile.size === 0) {
    console.error("Image file is missing or empty.");
    return { success: false, error: "Product image is required." };
  }

  try {
    // 1. Upload image to Firebase Storage
    const imagePath = `products/${uuidv4()}-${imageFile.name}`;
    const storageRef = ref(storage, imagePath);

    console.log(`Attempting to upload to Firebase Storage at path: ${imagePath}`);
    // Convert File to ArrayBuffer for uploadBytes
    const imageBuffer = await imageFile.arrayBuffer();
    const snapshot = await uploadBytes(storageRef, imageBuffer, { contentType: imageFile.type });
    console.log("Image upload successful. Snapshot:", snapshot);

    const imageUrl = await getDownloadURL(snapshot.ref);
    console.log("Successfully got download URL:", imageUrl);

    // 2. Add product data (including image URL) to Firestore
    const newProductData = {
      ...productData,
      imageUrl,
      createdAt: new Date().toISOString(),
      popularity: 0, // Default popularity
    };

    console.log("Attempting to add document to Firestore with data:", newProductData);
    await addDoc(collection(db, "products"), newProductData);
    console.log("Successfully added document to Firestore.");

    return { success: true, message: "Product added successfully!" };
  } catch (error) {
    console.error("❌ Error adding product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}
