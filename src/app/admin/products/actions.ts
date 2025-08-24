
"use server";

import { z } from "zod";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// The schema now expects the image to be an ArrayBuffer-like object (any)
// and includes fileName and fileType.
const productSchema = z.object({
  name: z.string().min(2),
  scentCategory: z.string().min(1),
  price: z.coerce.number().min(0),
  description: z.string().min(10),
  scentNotes: z.string().min(3),
  burnTime: z.string().min(3),
  ingredients: z.string().min(10),
  image: z.any(), // We'll pass an ArrayBuffer here
  fileName: z.string().min(1),
  fileType: z.string().min(1),
});

type FormState = {
  success: boolean;
  message?: string;
  error?: string;
};

// The function now accepts a plain object instead of FormData
export async function addProduct(data: z.infer<typeof productSchema>): Promise<FormState> {
  
  const validatedFields = productSchema.safeParse(data);
  if (!validatedFields.success) {
    console.error("Server-side validation failed:", validatedFields.error.flatten());
    return {
      success: false,
      error: "Invalid product data provided.",
    };
  }
  
  const { image, fileName, fileType, ...productData } = validatedFields.data;

  if (!image) {
    return { success: false, error: "Product image data is required." };
  }

  try {
    // 1. Upload image to Firebase Storage
    const imagePath = `products/${uuidv4()}-${fileName}`;
    const storageRef = ref(storage, imagePath);
    // The ArrayBuffer is uploaded directly.
    const snapshot = await uploadBytes(storageRef, image, { contentType: fileType });
    const imageUrl = await getDownloadURL(snapshot.ref);

    // 2. Add product data (including image URL) to Firestore
    const newProductData = {
      ...productData,
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
