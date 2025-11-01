import { apiClient } from './api';
import type { Candle } from '@/types/candle';

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

// Transform Spring Boot product response to Candle interface
function transformProductResponse(product: any): Candle {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    imageUrl: formatImageUrl(product.imageUrl || ''),
    scentCategory: product.scentCategoryName || product.scentCategory || '',
    scentNotes: Array.isArray(product.scentNotes) ? product.scentNotes.join(', ') : product.scentNotes || '',
    burnTime: product.burnTime || '',
    ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients || '',
    popularity: product.popularity || 0,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  };
}

export async function getProducts(): Promise<Candle[]> {
  try {
    const products = await apiClient.get<any[]>('/products');
    return products.map(transformProductResponse);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Candle | null> {
  try {
    const product = await apiClient.get<any>(`/products/${id}`);
    return transformProductResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRelatedProducts(categoryName: string, excludeId: string): Promise<Candle[]> {
  try {
    // First, try to get all products and filter by category name
    // This works because the backend returns scentCategoryName in the response
    const allProducts = await apiClient.get<any[]>('/products');
    const relatedProducts = allProducts
      .filter(product => {
        const productCategory = product.scentCategoryName || product.scentCategory || '';
        return productCategory.toLowerCase() === categoryName.toLowerCase() && product.id !== excludeId;
      })
      .slice(0, 4)
      .map(transformProductResponse);
    
    return relatedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    // Return empty array instead of throwing to prevent server errors
    return [];
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Candle[]> {
  try {
    const products = await apiClient.get<any[]>(`/products/category/${categoryId}`);
    return products.map(transformProductResponse);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Candle[]> {
  try {
    const products = await apiClient.get<any[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return products.map(transformProductResponse);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/products/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

export async function addProduct(productData: any): Promise<{
  success: boolean;
  productId?: string;
  error?: string;
}> {
  try {
    const response = await apiClient.post<any>('/products', productData);
    
    return {
      success: true,
      productId: response.id
    };
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add product"
    };
  }
}

export async function updateProduct(id: string, productData: any): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiClient.put(`/products/${id}`, productData);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product"
    };
  }
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const categories = await apiClient.get<any[]>('/categories');
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return ["Citrus", "Floral", "Sweet", "Fresh", "Fruity"];
  }
}
