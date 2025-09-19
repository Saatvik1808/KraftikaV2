
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import type { Candle } from "@/types/candle";
import { getActiveCategories } from "./categories";

// Helper function to format image URL for public folder
function formatImageUrl(imageUrl: string): string {
  if (!imageUrl) return '/placeholder-image.jpg';
  // If it's already a public folder path, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // If it's a Firebase Storage URL, we'll use a placeholder for now
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    return '/placeholder-image.jpg'; 
  }
  
  // Default to the provided URL, but handle potential errors
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
    return ["Citrus", "Floral", "Sweet", "Fresh", "Fruity"];
  }
}
