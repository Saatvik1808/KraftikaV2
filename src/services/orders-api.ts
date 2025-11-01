import { apiClient } from "./api";
import type { Order, Vendor, VendorOrder, GSTInvoice, Payout, ProfitLoss } from "@/types/order";

// Vendor APIs - Integrated with backend
export async function getAllVendors(): Promise<Vendor[]> {
  try {
    const response = await apiClient.get<Vendor[]>("/vendors");
    // Transform backend response to frontend format
    return response.map((v: any) => ({
      id: v.id,
      name: v.name,
      email: v.email || "",
      phone: v.phone || "",
      address: v.address,
      gstNumber: v.gstNumber,
      panNumber: v.panNumber || undefined,
      contactPerson: v.contactPerson,
      marginPercentage: v.marginPercentage || 0,
      isActive: v.isActive !== false,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching vendors:", error);
    // Return empty array if backend not available
    return [];
  }
}

export async function createVendor(vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">): Promise<Vendor> {
  try {
    const response = await apiClient.post<any>("/vendors", {
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      gstNumber: vendor.gstNumber,
      panNumber: vendor.panNumber,
      contactPerson: vendor.contactPerson,
      marginPercentage: vendor.marginPercentage || 0,
    });
    
    return {
      id: response.id,
      name: response.name,
      email: response.email || "",
      phone: response.phone || "",
      address: response.address,
      gstNumber: response.gstNumber,
      panNumber: response.panNumber || undefined,
      contactPerson: response.contactPerson,
      marginPercentage: response.marginPercentage || 0,
      isActive: response.isActive !== false,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error: any) {
    console.error("Error creating vendor:", error);
    throw new Error(error.message || "Failed to create vendor");
  }
}

export async function updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
  try {
    const response = await apiClient.put<any>(`/vendors/${id}`, {
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      gstNumber: vendor.gstNumber,
      panNumber: vendor.panNumber,
      contactPerson: vendor.contactPerson,
      marginPercentage: vendor.marginPercentage,
      isActive: vendor.isActive,
    });
    
    return {
      id: response.id,
      name: response.name,
      email: response.email || "",
      phone: response.phone || "",
      address: response.address,
      gstNumber: response.gstNumber,
      panNumber: response.panNumber || undefined,
      contactPerson: response.contactPerson,
      marginPercentage: response.marginPercentage || 0,
      isActive: response.isActive !== false,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error: any) {
    console.error("Error updating vendor:", error);
    throw new Error(error.message || "Failed to update vendor");
  }
}

export async function deleteVendor(id: string): Promise<void> {
  try {
    await apiClient.delete(`/vendors/${id}`);
  } catch (error: any) {
    console.error("Error deleting vendor:", error);
    throw new Error(error.message || "Failed to delete vendor");
  }
}

// Legacy function names for backward compatibility - redirect to Vendor functions
export const getAllMerchants = getAllVendors;
export const createMerchant = createVendor;
export const updateMerchant = updateVendor;

export async function getAllOrders(): Promise<Order[]> {
  try {
    // TODO: Replace with actual backend endpoint
    // For now, return mock data
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    // TODO: Replace with actual backend endpoint
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  try {
    // TODO: Replace with actual backend endpoint
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Vendor Orders APIs
export async function getVendorOrders(vendorId?: string): Promise<VendorOrder[]> {
  try {
    // TODO: Replace with actual backend endpoint when VendorOrder entity is created
    // For now, return empty array
    return [];
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    throw error;
  }
}

export async function createVendorOrder(order: Omit<VendorOrder, "id" | "createdAt">): Promise<VendorOrder> {
  try {
    // TODO: Replace with actual backend endpoint when VendorOrder entity is created
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error creating vendor order:", error);
    throw error;
  }
}

// Legacy function names for backward compatibility
export const getMerchantOrders = getVendorOrders;
export const createMerchantOrder = createVendorOrder;

// GST Invoice APIs
export async function getAllInvoices(): Promise<GSTInvoice[]> {
  try {
    // TODO: Replace with actual backend endpoint when GSTInvoice entity is created
    return [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
}

export async function createInvoice(invoice: Omit<GSTInvoice, "id" | "invoiceNumber" | "createdAt">): Promise<GSTInvoice> {
  try {
    // TODO: Replace with actual backend endpoint when GSTInvoice entity is created
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

export async function generateInvoicePDF(invoiceId: string): Promise<Blob> {
  try {
    // TODO: Replace with actual backend endpoint
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    throw error;
  }
}

// Payout APIs
export async function getAllPayouts(): Promise<Payout[]> {
  try {
    // TODO: Replace with actual backend endpoint
    return [];
  } catch (error) {
    console.error("Error fetching payouts:", error);
    throw error;
  }
}

export async function createPayout(payout: Omit<Payout, "id" | "createdAt">): Promise<Payout> {
  try {
    // TODO: Replace with actual backend endpoint
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error creating payout:", error);
    throw error;
  }
}

// Profit/Loss APIs
export async function getProfitLoss(period?: string, merchantId?: string): Promise<ProfitLoss[]> {
  try {
    // TODO: Replace with actual backend endpoint
    return [];
  } catch (error) {
    console.error("Error fetching profit/loss:", error);
    throw error;
  }
}

