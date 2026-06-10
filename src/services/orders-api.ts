import { apiClient } from "./api";
import type { Order, Vendor, VendorOrder, GSTInvoice, Payout, ProfitLoss } from "@/types/order";
import { VendorOrderStatus, InvoiceStatus, PayoutStatus, OrderStatus } from "@/types/order";

// Vendor APIs - Integrated with backend
export async function getAllVendors(): Promise<Vendor[]> {
  try {
    console.log("Fetching vendors from:", `${apiClient.baseUrl}/vendors`);
    const response = await apiClient.get<Vendor[]>("/vendors");
    console.log("Vendors response received:", response);
    
    if (!Array.isArray(response)) {
      console.error("Vendors response is not an array:", response);
      return [];
    }
    
    // Transform backend response to frontend format
    const vendors = response.map((v: any) => ({
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
    
    console.log("Transformed vendors:", vendors);
    return vendors;
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // Re-throw error so calling code can handle it
    throw error;
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

export async function getAllOrders(userId?: string): Promise<Order[]> {
  try {
    const params = userId ? `?userId=${userId}` : '';
    const response = await apiClient.get<any[]>(`/orders${params}`);
    
    // Transform backend response to frontend format
    return response.map((order: any) => ({
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status as OrderStatus,
      shippingAddress: typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress || {},
      paymentMethod: order.paymentMethod || "",
      orderItems: order.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      paymentId: order.paymentId ?? null,
      paidAt: order.paidAt ?? null,
      trackingNumber: order.trackingNumber ?? null,
      courierName: order.courierName ?? null,
      trackingUrl: order.trackingUrl ?? null,
      shippedAt: order.shippedAt ?? null,
      deliveredAt: order.deliveredAt ?? null,
      cancelledAt: order.cancelledAt ?? null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function createOrder(orderData: {
  shippingAddress: any;
  paymentMethod: string;
  couponCode?: string;
  orderItems: Array<{
    productId: string;
    quantity: number;
  }>;
}): Promise<Order> {
  try {
    const response = await apiClient.post<any>("/orders", {
      shippingAddress: typeof orderData.shippingAddress === 'string' 
        ? orderData.shippingAddress 
        : JSON.stringify(orderData.shippingAddress),
      paymentMethod: orderData.paymentMethod,
      orderItems: orderData.orderItems,
    });
    
    console.log("Order creation response:", response);
    
    // Validate response has required fields
    if (!response || !response.id) {
      console.error("Invalid order response - missing id:", response);
      throw new Error("Invalid order response: missing order ID");
    }
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      userId: response.userId,
      totalAmount: response.totalAmount,
      status: response.status as OrderStatus,
      shippingAddress: typeof response.shippingAddress === 'string' 
        ? JSON.parse(response.shippingAddress) 
        : response.shippingAddress || {},
      paymentMethod: response.paymentMethod || "",
      orderItems: (response.orderItems || []).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      paymentId: response.paymentId ?? null,
      paidAt: response.paidAt ?? null,
      trackingNumber: response.trackingNumber ?? null,
      courierName: response.courierName ?? null,
      trackingUrl: response.trackingUrl ?? null,
      shippedAt: response.shippedAt ?? null,
      deliveredAt: response.deliveredAt ?? null,
      cancelledAt: response.cancelledAt ?? null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    throw new Error(error.message || "Failed to create order");
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const response = await apiClient.get<any>(`/orders/${id}`);
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      userId: response.userId,
      totalAmount: response.totalAmount,
      status: response.status as OrderStatus,
      shippingAddress: typeof response.shippingAddress === 'string' 
        ? JSON.parse(response.shippingAddress) 
        : response.shippingAddress || {},
      paymentMethod: response.paymentMethod || "",
      orderItems: response.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      paymentId: response.paymentId ?? null,
      paidAt: response.paidAt ?? null,
      trackingNumber: response.trackingNumber ?? null,
      courierName: response.courierName ?? null,
      trackingUrl: response.trackingUrl ?? null,
      shippedAt: response.shippedAt ?? null,
      deliveredAt: response.deliveredAt ?? null,
      cancelledAt: response.cancelledAt ?? null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return null;
  }
}

/** Admin: set tracking info; backend marks the order SHIPPED and emails the customer. */
export async function shipOrder(
  orderId: string,
  shipment: { trackingNumber: string; courierName?: string; trackingUrl?: string; notify?: boolean },
): Promise<Order> {
  const response = await apiClient.put<any>(`/orders/${orderId}/shipment`, shipment);
  return {
    id: response.id,
    userId: response.userId,
    totalAmount: response.totalAmount,
    status: response.status as OrderStatus,
    shippingAddress: typeof response.shippingAddress === 'string'
      ? JSON.parse(response.shippingAddress)
      : response.shippingAddress || {},
    paymentMethod: response.paymentMethod || "",
    orderItems: response.orderItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    })),
    paymentId: response.paymentId ?? null,
    paidAt: response.paidAt ?? null,
    trackingNumber: response.trackingNumber ?? null,
    courierName: response.courierName ?? null,
    trackingUrl: response.trackingUrl ?? null,
    shippedAt: response.shippedAt ?? null,
    deliveredAt: response.deliveredAt ?? null,
    cancelledAt: response.cancelledAt ?? null,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  try {
    const response = await apiClient.put<any>(`/orders/${orderId}/status?status=${status}`, {});
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      userId: response.userId,
      totalAmount: response.totalAmount,
      status: response.status as OrderStatus,
      shippingAddress: typeof response.shippingAddress === 'string' 
        ? JSON.parse(response.shippingAddress) 
        : response.shippingAddress || {},
      paymentMethod: response.paymentMethod || "",
      orderItems: response.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      paymentId: response.paymentId ?? null,
      paidAt: response.paidAt ?? null,
      trackingNumber: response.trackingNumber ?? null,
      courierName: response.courierName ?? null,
      trackingUrl: response.trackingUrl ?? null,
      shippedAt: response.shippedAt ?? null,
      deliveredAt: response.deliveredAt ?? null,
      cancelledAt: response.cancelledAt ?? null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    throw new Error(error.message || "Failed to update order status");
  }
}

// Vendor Orders APIs
export async function getVendorOrders(vendorId?: string): Promise<VendorOrder[]> {
  try {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await apiClient.get<any[]>(`/vendor-orders${params}`);
    
    // Transform backend response to frontend format
    return response.map((order: any) => ({
      id: order.id,
      vendorId: order.vendorId,
      vendorName: order.vendorName,
      orderId: order.orderId,
      orderItems: order.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        wholesalePrice: item.wholesalePrice,
        retailPrice: item.retailPrice,
        margin: item.margin,
      })),
      totalAmount: order.totalAmount,
      salePrice: order.salePrice,
      margin: order.margin,
      status: order.status as VendorOrderStatus,
      sentDate: order.sentDate,
      soldDate: order.soldDate,
      createdAt: order.createdAt,
    }));
  } catch (error: any) {
    console.error("Error fetching vendor orders:", error);
    // Return empty array on error to avoid breaking the UI
    return [];
  }
}

export async function createVendorOrder(order: Omit<VendorOrder, "id" | "createdAt">): Promise<VendorOrder> {
  try {
    const response = await apiClient.post<any>("/vendor-orders", {
      vendorId: order.vendorId,
      orderId: order.orderId || undefined,
      orderItems: order.orderItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        wholesalePrice: item.wholesalePrice,
        retailPrice: item.retailPrice,
      })),
    });
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      vendorId: response.vendorId,
      vendorName: response.vendorName,
      orderId: response.orderId,
      orderItems: response.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        wholesalePrice: item.wholesalePrice,
        retailPrice: item.retailPrice,
        margin: item.margin,
      })),
      totalAmount: response.totalAmount,
      salePrice: response.salePrice,
      margin: response.margin,
      status: response.status as VendorOrderStatus,
      sentDate: response.sentDate,
      soldDate: response.soldDate,
      createdAt: response.createdAt,
    };
  } catch (error: any) {
    console.error("Error creating vendor order:", error);
    throw new Error(error.message || "Failed to create vendor order");
  }
}

export async function updateVendorOrderStatus(orderId: string, status: VendorOrderStatus): Promise<VendorOrder> {
  try {
    const response = await apiClient.put<any>(`/vendor-orders/${orderId}/status?status=${status}`, {});
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      vendorId: response.vendorId,
      vendorName: response.vendorName,
      orderId: response.orderId,
      orderItems: response.orderItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        wholesalePrice: item.wholesalePrice,
        retailPrice: item.retailPrice,
        margin: item.margin,
      })),
      totalAmount: response.totalAmount,
      salePrice: response.salePrice,
      margin: response.margin,
      status: response.status as VendorOrderStatus,
      sentDate: response.sentDate,
      soldDate: response.soldDate,
      createdAt: response.createdAt,
    };
  } catch (error: any) {
    console.error("Error updating vendor order status:", error);
    throw new Error(error.message || "Failed to update vendor order status");
  }
}

export async function deleteVendorOrder(orderId: string): Promise<void> {
  try {
    await apiClient.delete(`/vendor-orders/${orderId}`);
  } catch (error: any) {
    console.error("Error deleting vendor order:", error);
    throw new Error(error.message || "Failed to delete vendor order");
  }
}

// Legacy function names for backward compatibility
export const getMerchantOrders = getVendorOrders;
export const createMerchantOrder = createVendorOrder;

// GST Invoice APIs
export async function getAllInvoices(vendorId?: string): Promise<GSTInvoice[]> {
  try {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await apiClient.get<any[]>(`/gst-invoices${params}`);
    
    // Transform backend response to frontend format
    return response.map((invoice: any) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      vendorId: invoice.vendorId,
      vendorName: invoice.vendorName,
      vendorGST: invoice.vendorGST,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      items: invoice.items.map((item: any) => ({
        id: item.id,
        productName: item.productName,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
        taxableAmount: item.taxableAmount,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        total: item.total,
      })),
      subtotal: invoice.subtotal,
      cgst: invoice.cgst,
      sgst: invoice.sgst,
      igst: invoice.igst,
      totalAmount: invoice.totalAmount,
      status: invoice.status as InvoiceStatus,
      createdAt: invoice.createdAt,
    }));
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

export async function createInvoice(invoice: Omit<GSTInvoice, "id" | "invoiceNumber" | "createdAt">): Promise<GSTInvoice> {
  try {
    const response = await apiClient.post<any>("/gst-invoices", {
      vendorId: invoice.vendorId,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      isInterState: invoice.igst > 0, // If IGST > 0, it's inter-state
      items: invoice.items.map(item => ({
        productName: item.productName,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
      })),
    });
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      invoiceNumber: response.invoiceNumber,
      vendorId: response.vendorId,
      vendorName: response.vendorName,
      vendorGST: response.vendorGST,
      invoiceDate: response.invoiceDate,
      dueDate: response.dueDate,
      items: response.items.map((item: any) => ({
        id: item.id,
        productName: item.productName,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
        taxableAmount: item.taxableAmount,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        total: item.total,
      })),
      subtotal: response.subtotal,
      cgst: response.cgst,
      sgst: response.sgst,
      igst: response.igst,
      totalAmount: response.totalAmount,
      status: response.status as InvoiceStatus,
      createdAt: response.createdAt,
    };
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    throw new Error(error.message || "Failed to create invoice");
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<GSTInvoice> {
  try {
    const response = await apiClient.put<any>(`/gst-invoices/${invoiceId}/status?status=${status}`, {});
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      invoiceNumber: response.invoiceNumber,
      vendorId: response.vendorId,
      vendorName: response.vendorName,
      vendorGST: response.vendorGST,
      invoiceDate: response.invoiceDate,
      dueDate: response.dueDate,
      items: response.items.map((item: any) => ({
        id: item.id,
        productName: item.productName,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: item.gstRate,
        taxableAmount: item.taxableAmount,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        total: item.total,
      })),
      subtotal: response.subtotal,
      cgst: response.cgst,
      sgst: response.sgst,
      igst: response.igst,
      totalAmount: response.totalAmount,
      status: response.status as InvoiceStatus,
      createdAt: response.createdAt,
    };
  } catch (error: any) {
    console.error("Error updating invoice status:", error);
    throw new Error(error.message || "Failed to update invoice status");
  }
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  try {
    await apiClient.delete(`/gst-invoices/${invoiceId}`);
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    throw new Error(error.message || "Failed to delete invoice");
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
export async function getAllPayouts(vendorId?: string): Promise<Payout[]> {
  try {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await apiClient.get<any[]>(`/payouts${params}`);
    
    // Transform backend response to frontend format
    return response.map((payout: any) => ({
      id: payout.id,
      vendorId: payout.vendorId,
      vendorName: payout.vendorName,
      invoiceId: payout.invoiceId,
      amount: payout.amount,
      status: payout.status as PayoutStatus,
      paymentDate: payout.paymentDate,
      paymentMethod: payout.paymentMethod,
      transactionId: payout.transactionId,
      createdAt: payout.createdAt,
    }));
  } catch (error: any) {
    console.error("Error fetching payouts:", error);
    return [];
  }
}

export async function createPayout(payout: Omit<Payout, "id" | "createdAt">): Promise<Payout> {
  try {
    const response = await apiClient.post<any>("/payouts", {
      invoiceId: payout.invoiceId,
      paymentMethod: payout.paymentMethod,
      transactionId: payout.transactionId,
    });
    
    // Transform backend response to frontend format
    return {
      id: response.id,
      vendorId: response.vendorId,
      vendorName: response.vendorName,
      invoiceId: response.invoiceId,
      amount: response.amount,
      status: response.status as PayoutStatus,
      paymentDate: response.paymentDate,
      paymentMethod: response.paymentMethod,
      transactionId: response.transactionId,
      createdAt: response.createdAt,
    };
  } catch (error: any) {
    console.error("Error creating payout:", error);
    throw new Error(error.message || "Failed to create payout");
  }
}

// Profit/Loss APIs - Calculate from vendor orders
export async function getProfitLoss(period?: string, merchantId?: string): Promise<ProfitLoss[]> {
  try {
    // Get all vendor orders and calculate profit/loss from them
    const vendorOrders = await getVendorOrders(merchantId);
    
    if (vendorOrders.length === 0) {
      return [];
    }
    
    // Group orders by period (month-year) and vendor
    const profitMap = new Map<string, {
      vendorId?: string;
      vendorName?: string;
      period: string;
      totalSales: number;
      totalCost: number;
      expenses: number;
    }>();
    
    vendorOrders.forEach(order => {
      // Parse period from order date
      const orderDate = new Date(order.sentDate);
      const orderPeriod = period || `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      const key = `${orderPeriod}_${order.vendorId || 'all'}`;
      
      if (!profitMap.has(key)) {
        profitMap.set(key, {
          vendorId: order.vendorId,
          vendorName: order.vendorName,
          period: orderPeriod,
          totalSales: 0,
          totalCost: 0,
          expenses: 0,
        });
      }
      
      const profit = profitMap.get(key)!;
      
      // Total sales = what vendor sells at (retail price)
      profit.totalSales += order.salePrice;
      
      // Total cost = what we charge vendor (wholesale price)
      profit.totalCost += order.totalAmount;
      
      // For SOLD orders, add expenses (could be shipping, etc.)
      if (order.status === VendorOrderStatus.SOLD) {
        // Assuming 5% expenses on sold orders
        profit.expenses += order.salePrice * 0.05;
      }
    });
    
    // Convert to ProfitLoss array
    const profitLossData: ProfitLoss[] = Array.from(profitMap.values()).map((data, index) => {
      const grossProfit = data.totalSales - data.totalCost;
      const netProfit = grossProfit - data.expenses;
      const netLoss = netProfit < 0 ? Math.abs(netProfit) : 0;
      
      return {
        id: `pl_${index}_${Date.now()}`,
        vendorId: data.vendorId,
        vendorName: data.vendorName,
        period: data.period,
        totalSales: data.totalSales,
        totalCost: data.totalCost,
        grossProfit: grossProfit,
        expenses: data.expenses,
        netProfit: netProfit > 0 ? netProfit : 0,
        netLoss: netLoss,
        createdAt: new Date().toISOString(),
      };
    });
    
    // Filter by period if specified
    if (period && period !== 'all') {
      return profitLossData.filter(p => p.period === period);
    }
    
    return profitLossData.sort((a, b) => b.period.localeCompare(a.period));
  } catch (error) {
    console.error("Error fetching profit/loss:", error);
    // Return empty array on error
    return [];
  }
}

