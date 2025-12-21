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
 * This merges localStorage cart with backend cart (takes max quantity)
 */
export async function syncLocalStorageCartToBackend(): Promise<void> {
  try {
    const cartString = localStorage.getItem('kraftikaCart');
    if (!cartString) return; // No local cart to sync
    
    const localCart: Array<{ id: string; quantity: number }> = JSON.parse(cartString);
    if (localCart.length === 0) {
      // Clear localStorage if empty
      localStorage.removeItem('kraftikaCart');
      return;
    }
    
    // Filter out items with invalid UUIDs and sync valid ones
    const validItems = localCart.filter(item => isValidUUID(item.id));
    
    if (validItems.length === 0) {
      // No valid items to sync, clear localStorage
      localStorage.removeItem('kraftikaCart');
      return;
    }
    
    try {
      // Get existing backend cart to merge quantities
      const existingBackendCart = await cartApi.getCart();
      const existingItemsMap = new Map(
        existingBackendCart.map((item: any) => [item.productId, item.quantity])
      );
      
      // Sync each valid item - merge quantities (use max of local and backend)
      for (const item of validItems) {
        try {
          const existingQuantity = existingItemsMap.get(item.id) || 0;
          const newQuantity = Math.max(existingQuantity, item.quantity);
          
          // Only update if quantity is different
          if (newQuantity !== existingQuantity) {
            // Use updateItem instead of addItem to avoid duplicates
            await cartApi.updateItem(item.id, newQuantity);
          }
        } catch (error: any) {
          console.error(`Failed to sync item ${item.id} to backend:`, error);
          // Continue syncing other items even if one fails
          // Skip if it's an invalid UUID error
          if (error.message?.includes('Invalid product ID') || error.message?.includes('Invalid UUID') || error.message?.includes('NOT_AUTHENTICATED')) {
            continue;
          }
        }
      }
    } catch (error: any) {
      // If we can't get backend cart (maybe cart empty), just add items normally
      if (error.message !== "NOT_AUTHENTICATED") {
        console.error('Failed to get backend cart for merge:', error);
      }
      
      // Fall back to adding items directly
      for (const item of validItems) {
        try {
          await cartApi.addItem(item.id, item.quantity);
        } catch (addError: any) {
          console.error(`Failed to add item ${item.id} to backend:`, addError);
          if (addError.message?.includes('Invalid product ID') || addError.message?.includes('Invalid UUID') || addError.message?.includes('NOT_AUTHENTICATED')) {
            continue;
          }
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
      // User is authenticated - try backend API first
      try {
        await cartApi.addItem(productId, quantity);
        if (onSuccess) onSuccess();
        return;
      } catch (error: any) {
        // If authentication failed (401/403 or NOT_AUTHENTICATED), fall back to localStorage
        if (error.message === "NOT_AUTHENTICATED" || error.message?.includes("login") || error.message?.includes("authenticated")) {
          console.log('Authentication failed, falling back to localStorage');
          // Fall through to localStorage logic below
        } else {
          // Other errors (network, server error, etc.) - throw to be handled by onError
          throw error;
        }
      }
    }
    
    // User not authenticated OR auth failed - use localStorage
    const cartString = localStorage.getItem('kraftikaCart');
    let currentCart: Array<{ id: string; quantity: number }> = cartString ? JSON.parse(cartString) : [];
    
    const existingItemIndex = currentCart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({ id: productId, quantity });
    }
    
    localStorage.setItem('kraftikaCart', JSON.stringify(currentCart));
    
    // Trigger cart update event for cart page to refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    if (onSuccess) onSuccess();
  } catch (error: any) {
    console.error('Failed to add item to cart:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error(error.message || 'Failed to add item to cart'));
    }
    throw error;
  }
}

