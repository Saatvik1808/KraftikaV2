import { useSpringBootAPI } from './config';
import type { Candle } from '@/types/candle';

// Import both Firebase and Spring Boot services
import * as firebaseProducts from './products';
import * as springBootProducts from './products-api';

// Unified product service that automatically chooses the right API
export async function getProducts(): Promise<Candle[]> {
  if (useSpringBootAPI()) {
    return springBootProducts.getProducts();
  } else {
    return firebaseProducts.getProducts();
  }
}

export async function getProduct(id: string): Promise<Candle | null> {
  if (useSpringBootAPI()) {
    return springBootProducts.getProduct(id);
  } else {
    return firebaseProducts.getProduct(id);
  }
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Candle[]> {
  if (useSpringBootAPI()) {
    // For Spring Boot, we need to find the category ID first
    // For now, we'll use the category name as ID (this might need adjustment)
    return springBootProducts.getRelatedProducts(category, excludeId);
  } else {
    return firebaseProducts.getRelatedProducts(category, excludeId);
  }
}

export async function getProductsByCategory(category: string): Promise<Candle[]> {
  if (useSpringBootAPI()) {
    // For Spring Boot, we need to find the category ID first
    // For now, we'll use the category name as ID (this might need adjustment)
    return springBootProducts.getProductsByCategory(category);
  } else {
    return firebaseProducts.getProductsByCategory(category);
  }
}

export async function searchProducts(query: string): Promise<Candle[]> {
  if (useSpringBootAPI()) {
    return springBootProducts.searchProducts(query);
  } else {
    // Firebase doesn't have search implemented, return empty array
    return [];
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (useSpringBootAPI()) {
    return springBootProducts.deleteProduct(id);
  } else {
    return firebaseProducts.deleteProduct(id);
  }
}

export async function addProduct(productData: any): Promise<{
  success: boolean;
  productId?: string;
  error?: string;
}> {
  if (useSpringBootAPI()) {
    return springBootProducts.addProduct(productData);
  } else {
    // Firebase doesn't have addProduct in the service, return error
    return {
      success: false,
      error: "Add product not implemented for Firebase service"
    };
  }
}

export async function updateProduct(id: string, productData: any): Promise<{
  success: boolean;
  error?: string;
}> {
  if (useSpringBootAPI()) {
    return springBootProducts.updateProduct(id, productData);
  } else {
    // Firebase doesn't have updateProduct in the service, return error
    return {
      success: false,
      error: "Update product not implemented for Firebase service"
    };
  }
}

export async function getProductCategories(): Promise<string[]> {
  if (useSpringBootAPI()) {
    return springBootProducts.getProductCategories();
  } else {
    return firebaseProducts.getProductCategories();
  }
}

export async function bulkUpdateProducts(
  productIds: string[],
  updates: {
    price?: number;
    scentCategory?: string;
    isActive?: boolean;
    stockQuantity?: number;
    popularity?: number;
  }
): Promise<{
  success: boolean;
  updatedCount?: number;
  error?: string;
}> {
  if (useSpringBootAPI()) {
    // Update products one by one (Spring Boot doesn't have bulk update endpoint)
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const id of productIds) {
      try {
        const result = await springBootProducts.updateProduct(id, updates);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          if (result.error) {
            errors.push(result.error);
          }
        }
      } catch (error) {
        errorCount++;
        errors.push(error instanceof Error ? error.message : "Unknown error");
      }
    }

    if (errorCount === 0) {
      return {
        success: true,
        updatedCount: successCount,
      };
    } else {
      return {
        success: false,
        updatedCount: successCount,
        error: `Failed to update ${errorCount} product(s). ${errors.slice(0, 3).join(", ")}`,
      };
    }
  } else {
    return {
      success: false,
      error: "Bulk update not implemented for Firebase service",
    };
  }
}
