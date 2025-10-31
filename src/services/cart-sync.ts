import { cartApi } from "./cart-api";

/**
 * Sync localStorage cart to backend when user logs in
 */
export async function syncLocalStorageCartToBackend(): Promise<void> {
  try {
    const cartString = localStorage.getItem('kraftikaCart');
    if (!cartString) return; // No local cart to sync
    
    const localCart: Array<{ id: string; quantity: number }> = JSON.parse(cartString);
    if (localCart.length === 0) return; // Empty cart, nothing to sync
    
    // Sync each item to backend
    for (const item of localCart) {
      try {
        await cartApi.addItem(item.id, item.quantity);
      } catch (error) {
        console.error(`Failed to sync item ${item.id} to backend:`, error);
        // Continue syncing other items even if one fails
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

