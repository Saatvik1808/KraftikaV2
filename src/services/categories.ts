import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export interface ScentCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getCategories(): Promise<ScentCategory[]> {
  try {
    const q = query(collection(db, "categories"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const categories: ScentCategory[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name,
        description: data.description || "",
        color: data.color || "",
        icon: data.icon || "",
        isActive: data.isActive !== false, // Default to true
        productCount: data.productCount || 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      });
    });
    
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getActiveCategories(): Promise<ScentCategory[]> {
  try {
    const categories = await getCategories();
    return categories.filter(cat => cat.isActive);
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return [];
  }
}

export async function addCategory(categoryData: Omit<ScentCategory, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Promise<{
  success: boolean;
  categoryId?: string;
  error?: string;
}> {
  try {
    const newCategory = {
      ...categoryData,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "categories"), newCategory);
    
    return {
      success: true,
      categoryId: docRef.id
    };
  } catch (error) {
    console.error("Error adding category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add category"
    };
  }
}

export async function updateCategory(id: string, categoryData: Partial<ScentCategory>): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const categoryRef = doc(db, "categories", id);
    
    // Remove fields that shouldn't be updated
    const { id: _, createdAt, productCount, ...updateData } = categoryData;
    
    await updateDoc(categoryRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update category"
    };
  }
}

export async function deleteCategory(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if category has products
    const { getDocs, query, where } = await import("firebase/firestore");
    const productsQuery = query(collection(db, "products"), where("scentCategory", "==", id));
    const productsSnapshot = await getDocs(productsQuery);
    
    if (!productsSnapshot.empty) {
      return {
        success: false,
        error: "Cannot delete category that has products. Please reassign or delete the products first."
      };
    }
    
    await deleteDoc(doc(db, "categories", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category"
    };
  }
}

export async function updateCategoryProductCount(categoryId: string, increment: boolean = true): Promise<void> {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const incrementValue = increment ? 1 : -1;
    
    await updateDoc(categoryRef, {
      productCount: incrementValue,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating category product count:", error);
  }
}
