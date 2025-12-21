import { API_BASE_URL } from "./config";
import { getValidToken, clearAuthData } from "@/lib/jwt-utils";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  itemCount: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token = getValidToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const cartApi = {
  /**
   * Get user's cart
   */
  async getCart(): Promise<CartItem[]> {
    const token = getValidToken();
    if (!token) {
      throw new Error("NOT_AUTHENTICATED");
    }
    
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthData();
        throw new Error("NOT_AUTHENTICATED");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to load cart");
    }

    return response.json();
  },

  /**
   * Add item to cart
   */
  async addItem(productId: string, quantity: number = 1): Promise<CartItem[]> {
    const token = getValidToken();
    
    // If no valid token, throw a specific error that can be caught and handled
    if (!token) {
      throw new Error("NOT_AUTHENTICATED");
    }
    
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/items?productId=${productId}&quantity=${quantity}`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Clear invalid/expired token
        clearAuthData();
        throw new Error("NOT_AUTHENTICATED");
      }
      const error = await response.json().catch(() => ({ message: "Failed to add item to cart" }));
      throw new Error(error.message || "Failed to add item to cart");
    }

    return response.json();
  },

  /**
   * Update item quantity in cart
   */
  async updateItem(productId: string, quantity: number): Promise<CartItem[]> {
    const token = getValidToken();
    if (!token) {
      throw new Error("NOT_AUTHENTICATED");
    }
    
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}?quantity=${quantity}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthData();
        throw new Error("NOT_AUTHENTICATED");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to update cart item");
    }

    return response.json();
  },

  /**
   * Remove item from cart
   */
  async removeItem(productId: string): Promise<CartItem[]> {
    const token = getValidToken();
    if (!token) {
      throw new Error("NOT_AUTHENTICATED");
    }
    
    console.log('[Cart API] Removing item:', productId);
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    console.log('[Cart API] Remove response status:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.log('[Cart API] Auth error, clearing auth data');
        clearAuthData();
        throw new Error("NOT_AUTHENTICATED");
      }
      let errorMessage = "Failed to remove item from cart";
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
        console.error('[Cart API] Remove error:', error);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
        console.error('[Cart API] Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    // Handle empty response (empty cart) - return empty array
    const text = await response.text();
    console.log('[Cart API] Remove response text:', text);
    
    if (!text || text.trim() === '' || text.trim() === 'null') {
      console.log('[Cart API] Empty response, returning empty array');
      return [];
    }

    try {
      const parsed = JSON.parse(text);
      console.log('[Cart API] Parsed response:', parsed);
      // Ensure it's an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('[Cart API] Failed to parse removeItem response:', e, 'Response text:', text);
      // If parsing fails but status was ok, return empty array (cart might be empty)
      return [];
    }
  },

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    const token = getValidToken();
    if (!token) {
      throw new Error("NOT_AUTHENTICATED");
    }
    
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthData();
        throw new Error("NOT_AUTHENTICATED");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to clear cart");
    }
  },

  /**
   * Get cart summary
   */
  async getSummary(): Promise<CartSummary> {
    const token = getValidToken();
    if (!token) {
      return { totalItems: 0, totalPrice: 0, itemCount: 0 };
    }
    
    const response = await fetch(`${API_BASE_URL}/cart/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthData();
        return { totalItems: 0, totalPrice: 0, itemCount: 0 };
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to load cart summary");
    }

    return response.json();
  },
};




