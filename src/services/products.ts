import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { Candle } from "@/types/candle";
import { getActiveCategories } from "./categories";

// Helper function to format image URL for public folder
function formatImageUrl(imageUrl: string): string {
  // If it's already a public folder path, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // If it's a Firebase Storage URL, we'll use a placeholder for now
  // In the future, you can download these to public folder
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    return '/placeholder-image.jpg'; // You can add a placeholder image
  }
  
  // Default to the provided URL
  return imageUrl;
}

export async function getProducts(): Promise<Candle[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Candle[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        scentCategory: data.scentCategory,
        price: data.price,
        description: data.description,
        scentNotes: data.scentNotes,
        burnTime: data.burnTime,
        ingredients: data.ingredients,
        imageUrl: formatImageUrl(data.imageUrl || ''),
        popularity: data.popularity || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Candle | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        scentCategory: data.scentCategory,
        price: data.price,
        description: data.description,
        scentNotes: data.scentNotes,
        burnTime: data.burnTime,
        ingredients: data.ingredients,
        imageUrl: formatImageUrl(data.imageUrl || ''),
        popularity: data.popularity || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Candle[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("scentCategory", "==", category)
    );
    
    const querySnapshot = await getDocs(q);
    const products: Candle[] = [];
    
    querySnapshot.forEach((doc) => {
      if (doc.id !== excludeId) {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          scentCategory: data.scentCategory,
          price: data.price,
          description: data.description,
          scentNotes: data.scentNotes,
          burnTime: data.burnTime,
          ingredients: data.ingredients,
          imageUrl: formatImageUrl(data.imageUrl || ''),
          popularity: data.popularity || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      }
    });
    
    // Return up to 4 related products
    return products.slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Candle[]> {
  try {
    const products = await getProducts();
    if (category === 'All') return products;
    return products.filter(product => product.scentCategory === category);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function updateProduct(id: string, productData: Partial<Candle>): Promise<boolean> {
  try {
    const productRef = doc(db, 'products', id);
    
    // Remove the id field if it exists in the data
    const { id: _, ...updateData } = productData;
    
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

export async function updateProductWithImage(id: string, productData: Partial<Candle>, imageFile?: File): Promise<{
  success: boolean;
  imageUrl?: string;
  fileName?: string;
}> {
  try {
    const productRef = doc(db, 'products', id);
    
    let imageUrl = productData.imageUrl;
    let fileName: string | undefined;
    
    // If a new image is provided, upload it to local public folder
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'}/api/upload`, {
        method: 'POST',
        body: uploadFormData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload new image');
      }
      
      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.publicPath;
      fileName = uploadResult.fileName;
    }
    
    // Remove the id field if it exists in the data
    const { id: _, ...updateData } = productData;
    
    await updateDoc(productRef, {
      ...updateData,
      imageUrl,
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      imageUrl,
      fileName
    };
  } catch (error) {
    console.error('Error updating product with image:', error);
    return { success: false };
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "products", id));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const categories = await getActiveCategories();
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    // Fallback to default categories
    return ["Citrus", "Floral", "Sweet", "Fresh", "Fruity"];
  }
}
