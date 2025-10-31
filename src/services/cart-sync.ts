import { cartApi } from "./cart-api";

/**
 * Helper function to validate if a string is a valid UUID
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Sync localStorage cart to backend when user logs in
 */
export async function syncLocalStorageCartToBackend(): Promise<void> {
  try {
    const cartString = localStorage.getItem('kraftikaCart');
    if (!cartString) return; // No local cart to sync
    
    const localCart: Array<{ id: string; quantity: number }> = JSON.parse(cartString);
    if (localCart.length === 0) return; // Empty cart, nothing to sync
    
    // Filter out items with invalid UUIDs and sync valid ones
    const validItems = localCart.filter(item => isValidUUID(item.id));
    
    if (validItems.length === 0) {
      // No valid items to sync, clear localStorage
      localStorage.removeItem('kraftikaCart');
      return;
    }
    
    // Sync each valid item to backend
    for (const item of validItems) {
      try {
        await cartApi.addItem(item.id, item.quantity);
      } catch (error: any) {
        console.error(`Failed to sync item ${item.id} to backend:`, error);
        // Continue syncing other items even if one fails
        // Skip if it's an invalid UUID error
        if (error.message?.includes('Invalid product ID') || error.message?.includes('Invalid UUID')) {
          continue;
        }
      }
    }
    
    // Clear localStorage cart after successful sync
    localStorage.removeItem('kraftikaCart');
    
    console.log('Cart synced to backend successfully');
  } catch (error) {
    console.error('Error syncing cart to backend:', error);
    // Don't throw - this is a background sync operation
  }
}

/**
 * Add item to cart - uses backend if authenticated, localStorage otherwise
 */
export async function addItemToCart(
  productId: string, 
  quantity: number = 1,
  isAuthenticated: boolean,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    if (isAuthenticated) {
      // User is authenticated - use backend API
      await cartApi.addItem(productId, quantity);
      if (onSuccess) onSuccess();
    } else {
      // User not authenticated - use localStorage
      const cartString = localStorage.getItem('kraftikaCart');
      let currentCart: Array<{ id: string; quantity: number }> = cartString ? JSON.parse(cartString) : [];
      
      const existingItemIndex = currentCart.findIndex(item => item.id === productId);
      
      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push({ id: productId, quantity });
      }
      
      localStorage.setItem('kraftikaCart', JSON.stringify(currentCart));
      if (onSuccess) onSuccess();
    }
  } catch (error: any) {
    console.error('Failed to add item to cart:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error(error.message || 'Failed to add item to cart'));
    }
    throw error;
  }
}

