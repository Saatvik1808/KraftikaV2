import { apiClient } from './api';

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

// Transform Spring Boot category response to ScentCategory interface
function transformCategoryResponse(category: any): ScentCategory {
  return {
    id: category.id,
    name: category.name,
    description: category.description || "",
    color: category.color || "",
    icon: category.icon || "",
    isActive: category.isActive !== false, // Default to true
    productCount: category.productCount || 0,
    createdAt: category.createdAt || new Date().toISOString(),
    updatedAt: category.updatedAt || new Date().toISOString(),
  };
}

export async function getCategories(): Promise<ScentCategory[]> {
  try {
    const categories = await apiClient.get<any[]>('/categories');
    return categories.map(transformCategoryResponse);
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

export async function getCategory(id: string): Promise<ScentCategory | null> {
  try {
    const category = await apiClient.get<any>(`/categories/${id}`);
    return transformCategoryResponse(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function addCategory(categoryData: Omit<ScentCategory, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Promise<{
  success: boolean;
  categoryId?: string;
  error?: string;
}> {
  try {
    const newCategory = {
      name: categoryData.name,
      description: categoryData.description || "",
      color: categoryData.color || "",
      icon: categoryData.icon || "",
      isActive: categoryData.isActive !== false,
    };

    const response = await apiClient.post<any>('/categories', newCategory);
    
    return {
      success: true,
      categoryId: response.id
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
    // Remove fields that shouldn't be updated
    const { id: _, createdAt, productCount, ...updateData } = categoryData;
    
    await apiClient.put(`/categories/${id}`, updateData);
    
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
    await apiClient.delete(`/categories/${id}`);
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
    // This would need to be implemented in the Spring Boot backend
    // For now, we'll just log it
    console.log(`Updating category ${categoryId} product count: ${increment ? 'increment' : 'decrement'}`);
  } catch (error) {
    console.error("Error updating category product count:", error);
  }
}

