export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  orderItems: OrderItem[];
  // Payment linkage
  paymentId?: string | null;
  paidAt?: string | null;
  // Shipment tracking
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  panNumber?: string;
  contactPerson: string;
  marginPercentage: number; // Margin vendor gets on each sale
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface VendorOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  orderId: string;
  orderItems: VendorOrderItem[];
  totalAmount: number; // Amount sent to vendor (wholesale price)
  salePrice: number; // Price vendor sells at (retail price)
  margin: number; // Margin vendor makes
  status: VendorOrderStatus;
  sentDate: string;
  soldDate?: string;
  createdAt: string;
}

export interface VendorOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  wholesalePrice: number; // Price you sold to vendor
  retailPrice: number; // Price vendor sells at
  margin: number;
}

export enum VendorOrderStatus {
  SENT = "SENT",
  PARTIALLY_SOLD = "PARTIALLY_SOLD",
  SOLD = "SOLD",
  RETURNED = "RETURNED"
}

export interface GSTInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGST: string;
  invoiceDate: string;
  dueDate: string;
  items: GSTInvoiceItem[];
  subtotal: number;
  cgst: number; // Central GST
  sgst: number; // State GST
  igst: number; // Integrated GST (for inter-state)
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: string;
}

export interface GSTInvoiceItem {
  id: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  gstRate: number; // GST rate percentage
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE"
}

export interface Payout {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceId: string;
  amount: number;
  status: PayoutStatus;
  paymentDate?: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export enum PayoutStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export interface ProfitLoss {
  id: string;
  vendorId?: string;
  vendorName?: string;
  period: string; // e.g., "2024-01"
  totalSales: number; // Total sales to vendor
  totalCost: number; // Cost of goods
  grossProfit: number;
  expenses: number; // Other expenses
  netProfit: number;
  netLoss: number;
  createdAt: string;
}

