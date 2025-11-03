import { API_BASE_URL } from "./config";

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
  const token = typeof window !== "undefined" ? localStorage.getItem("kraftikaToken") : null;
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
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please login to view your cart");
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
    const response = await fetch(`${API_BASE_URL}/cart/items?productId=${productId}&quantity=${quantity}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Please login to add items to cart");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to add item to cart");
    }

    return response.json();
  },

  /**
   * Update item quantity in cart
   */
  async updateItem(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}?quantity=${quantity}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update cart item");
    }

    return response.json();
  },

  /**
   * Remove item from cart
   */
  async removeItem(productId: string): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove item from cart");
    }

    return response.json();
  },

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to clear cart");
    }
  },

  /**
   * Get cart summary
   */
  async getSummary(): Promise<CartSummary> {
    const response = await fetch(`${API_BASE_URL}/cart/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { totalItems: 0, totalPrice: 0, itemCount: 0 };
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to load cart summary");
    }

    return response.json();
  },
};


