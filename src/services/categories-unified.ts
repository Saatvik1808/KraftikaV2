import { useSpringBootAPI } from './config';
import type { ScentCategory } from './categories';

// Import both Firebase and Spring Boot services
import * as firebaseCategories from './categories';
import * as springBootCategories from './categories-api';

// Unified category service that automatically chooses the right API
export async function getCategories(): Promise<ScentCategory[]> {
  if (useSpringBootAPI()) {
    return springBootCategories.getCategories();
  } else {
    return firebaseCategories.getCategories();
  }
}

export async function getActiveCategories(): Promise<ScentCategory[]> {
  if (useSpringBootAPI()) {
    return springBootCategories.getActiveCategories();
  } else {
    return firebaseCategories.getActiveCategories();
  }
}

export async function getCategory(id: string): Promise<ScentCategory | null> {
  if (useSpringBootAPI()) {
    return springBootCategories.getCategory(id);
  } else {
    // Firebase doesn't have getCategory, return null for now
    return null;
  }
}

export async function addCategory(categoryData: Omit<ScentCategory, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Promise<{
  success: boolean;
  categoryId?: string;
  error?: string;
}> {
  if (useSpringBootAPI()) {
    return springBootCategories.addCategory(categoryData);
  } else {
    return firebaseCategories.addCategory(categoryData);
  }
}

export async function updateCategory(id: string, categoryData: Partial<ScentCategory>): Promise<{
  success: boolean;
  error?: string;
}> {
  if (useSpringBootAPI()) {
    return springBootCategories.updateCategory(id, categoryData);
  } else {
    return firebaseCategories.updateCategory(id, categoryData);
  }
}

export async function deleteCategory(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (useSpringBootAPI()) {
    return springBootCategories.deleteCategory(id);
  } else {
    return firebaseCategories.deleteCategory(id);
  }
}

export async function updateCategoryProductCount(categoryId: string, increment: boolean = true): Promise<void> {
  if (useSpringBootAPI()) {
    return springBootCategories.updateCategoryProductCount(categoryId, increment);
  } else {
    return firebaseCategories.updateCategoryProductCount(categoryId, increment);
  }
}

