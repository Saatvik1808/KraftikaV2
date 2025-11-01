"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Receipt,
  Package,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Store,
  FileText,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { getAllOrders, getVendorOrders, getAllPayouts, getAllInvoices, getProfitLoss, getAllVendors, createVendorOrder, createVendor, updateVendorOrderStatus, deleteVendorOrder, createInvoice, createPayout, updateInvoiceStatus, deleteInvoice } from "@/services/orders-api";
import type { Order, VendorOrder, Payout, GSTInvoice, ProfitLoss, Vendor, OrderStatus } from "@/types/order";
import { InvoiceStatus, VendorOrderStatus, PayoutStatus } from "@/types/order";
import { format } from "date-fns";
import { getProducts } from "@/services/products-unified";
import { Label } from "@/components/ui/label";
import { Loader, Spinner } from "@/components/ui/loader";

// Orders Tab Component
export function OrdersTab() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      PENDING: { variant: "outline", className: "text-yellow-600 border-yellow-600" },
      CONFIRMED: { variant: "secondary", className: "text-blue-600 border-blue-600" },
      SHIPPED: { variant: "default", className: "text-purple-600 border-purple-600" },
      DELIVERED: { variant: "default", className: "text-green-600 border-green-600" },
      CANCELLED: { variant: "destructive", className: "" },
    };
    return variants[status] || { variant: "secondary", className: "" };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Details
            </CardTitle>
            <CardDescription>
              View and manage all customer orders
            </CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusBadge(order.status);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>{format(new Date(order.createdAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{order.orderItems.length} item(s)</TableCell>
                      <TableCell className="font-semibold">₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.paymentMethod || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.className}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                              <DialogDescription>Order ID: {order.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                                  <p>{format(new Date(order.createdAt), "PPP")}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                                  <Badge variant={statusConfig.variant} className={statusConfig.className}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                                <div className="space-y-2">
                                  {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between p-2 border rounded">
                                      <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                      </div>
                                      <p className="font-medium">₹{item.subtotal.toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Vendor Orders Tab Component
export function VendorOrdersTab() {
  const [vendorOrders, setVendorOrders] = React.useState<VendorOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [vendorFilter, setVendorFilter] = React.useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showCreateVendorDialog, setShowCreateVendorDialog] = React.useState(false);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmittingVendor, setIsSubmittingVendor] = React.useState(false);
  const [vendorsLoading, setVendorsLoading] = React.useState(true);
  const [vendorsError, setVendorsError] = React.useState<string | null>(null);
  
  // Vendor form state
  const [vendorFormData, setVendorFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    contactPerson: "",
    marginPercentage: 0,
  });
  
  // Order form state
  const [formData, setFormData] = React.useState({
    vendorId: "",
    orderItems: [] as Array<{
      productId: string;
      productName: string;
      quantity: number;
      wholesalePrice: number;
      retailPrice: number;
    }>,
  });

  React.useEffect(() => {
    const fetchVendorsAndProducts = async () => {
      try {
        setVendorsLoading(true);
        setVendorsError(null);
        console.log("🔄 Fetching vendors and products...");
        const [vendorsData, productsData] = await Promise.all([
          getAllVendors(),
          getProducts(),
        ]);
        console.log("✅ Vendors fetched:", vendorsData.length);
        console.log("✅ Products fetched:", productsData.length);
        setVendors(vendorsData);
        setProducts(productsData);
      } catch (error) {
        console.error("❌ Error fetching vendors/products:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch vendors";
        setVendorsError(errorMessage);
        console.error("Error details:", error);
        // Set empty arrays but keep error state
        setVendors([]);
        setProducts([]);
      } finally {
        setVendorsLoading(false);
      }
    };
    fetchVendorsAndProducts();
  }, []);

  React.useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        setIsLoading(true);
        // getVendorOrders now reads from localStorage automatically
        const data = await getVendorOrders();
        setVendorOrders(data || []);
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
        setVendorOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendorOrders();
  }, []);

  const filteredOrders = vendorOrders.filter((order) => {
    const matchesSearch = order.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = vendorFilter === "all" || order.vendorId === vendorFilter;
    return matchesSearch && matchesVendor;
  });

  // Get unique vendors from existing orders for filter dropdown
  const vendorOptions = React.useMemo(() => {
    const unique = new Map<string, string>();
    vendorOrders.forEach(order => {
      if (!unique.has(order.vendorId)) {
        unique.set(order.vendorId, order.vendorName);
      }
    });
    return Array.from(unique.entries());
  }, [vendorOrders]);

  const handleCreateVendor = async () => {
    if (!vendorFormData.name || !vendorFormData.address || !vendorFormData.gstNumber || !vendorFormData.contactPerson) {
      alert("Please fill in all required fields (Name, Address, GST Number, Contact Person)");
      return;
    }

    try {
      setIsSubmittingVendor(true);
      const newVendor = await createVendor({
        ...vendorFormData,
        isActive: true, // Default to active when creating
      });
      
      // Add to local state
      setVendors(prev => [...prev, newVendor]);
      
      // Reset form
      setVendorFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        gstNumber: "",
        panNumber: "",
        contactPerson: "",
        marginPercentage: 0,
      });
      setShowCreateVendorDialog(false);
      
      alert("Vendor created successfully!");
    } catch (error: any) {
      console.error("Error creating vendor:", error);
      alert(error.message || "Failed to create vendor. Please try again.");
    } finally {
      setIsSubmittingVendor(false);
    }
  };

  const handleAddOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      orderItems: [...prev.orderItems, {
        productId: "",
        productName: "",
        quantity: 1,
        wholesalePrice: 0,
        retailPrice: 0,
      }]
    }));
  };

  const handleRemoveOrderItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index)
    }));
  };

  const handleOrderItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.map((item, i) => {
        if (i === index) {
          if (field === "productId") {
            const product = products.find(p => p.id === value);
            return {
              ...item,
              productId: value,
              productName: product?.name || "",
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };

  const handleSubmitOrder = async () => {
    if (!formData.vendorId || formData.orderItems.length === 0) {
      alert("Please select a vendor and add at least one product");
      return;
    }

    const selectedVendor = vendors.find(v => v.id === formData.vendorId);
    if (!selectedVendor) {
      alert("Vendor not found");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const totalAmount = formData.orderItems.reduce((sum, item) => sum + (item.wholesalePrice * item.quantity), 0);
      const salePrice = formData.orderItems.reduce((sum, item) => sum + (item.retailPrice * item.quantity), 0);
      
      const vendorOrder: Omit<VendorOrder, "id" | "createdAt"> = {
        vendorId: formData.vendorId,
        vendorName: selectedVendor.name,
        orderId: "", // Will be generated by backend
        orderItems: formData.orderItems.map(item => ({
          id: "",
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          wholesalePrice: item.wholesalePrice,
          retailPrice: item.retailPrice,
          margin: item.retailPrice - item.wholesalePrice,
        })),
        totalAmount,
        salePrice,
        margin: salePrice - totalAmount,
        status: VendorOrderStatus.SENT,
        sentDate: new Date().toISOString(),
      };

      try {
        const createdOrder = await createVendorOrder(vendorOrder);
        
        // Reset form
        setFormData({
          vendorId: "",
          orderItems: [],
        });
        setShowCreateDialog(false);
        
        // Refresh orders list from API (which now reads from localStorage)
        const updatedOrders = await getVendorOrders();
        setVendorOrders(updatedOrders);
        
        alert("Order created successfully!");
      } catch (apiError: any) {
        console.error("Error creating vendor order:", apiError);
        alert(apiError.message || "Failed to create order. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      alert(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: VendorOrderStatus) => {
    const configs: Record<VendorOrderStatus, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      SENT: { variant: "outline", className: "text-blue-600 border-blue-600" },
      PARTIALLY_SOLD: { variant: "secondary", className: "text-yellow-600 border-yellow-600" },
      SOLD: { variant: "default", className: "text-green-600 border-green-600" },
      RETURNED: { variant: "destructive", className: "" },
    };
    return configs[status] || { variant: "secondary", className: "" };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Vendor Orders
            </CardTitle>
            <CardDescription>
              Track orders sent to vendors, sales, and margins
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateVendorDialog(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by vendor or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={vendorFilter} onValueChange={setVendorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {vendorOptions.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create Vendor Dialog */}
        <Dialog open={showCreateVendorDialog} onOpenChange={setShowCreateVendorDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Add a new vendor to track orders and manage GST invoices.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor-name">Vendor Name *</Label>
                  <Input
                    id="vendor-name"
                    value={vendorFormData.name}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter vendor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-contact">Contact Person *</Label>
                  <Input
                    id="vendor-contact"
                    value={vendorFormData.contactPerson}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Contact person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-email">Email</Label>
                  <Input
                    id="vendor-email"
                    type="email"
                    value={vendorFormData.email}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="vendor@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-phone">Phone</Label>
                  <Input
                    id="vendor-phone"
                    type="tel"
                    value={vendorFormData.phone}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-gst">GST Number *</Label>
                  <Input
                    id="vendor-gst"
                    value={vendorFormData.gstNumber}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                    placeholder="GSTIN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-pan">PAN Number</Label>
                  <Input
                    id="vendor-pan"
                    value={vendorFormData.panNumber}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, panNumber: e.target.value }))}
                    placeholder="PAN"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vendor-address">Address *</Label>
                  <Input
                    id="vendor-address"
                    value={vendorFormData.address}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-margin">Margin Percentage (%)</Label>
                  <Input
                    id="vendor-margin"
                    type="number"
                    min="0"
                    step="0.01"
                    value={vendorFormData.marginPercentage !== undefined && vendorFormData.marginPercentage !== null ? vendorFormData.marginPercentage : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const normalizedVal = val.replace(/^0+([1-9])/, "$1");
                      if (normalizedVal === "" || normalizedVal === "0") {
                        setVendorFormData(prev => ({ ...prev, marginPercentage: 0 }));
                        return;
                      }
                      const num = parseFloat(normalizedVal);
                      if (!isNaN(num) && num >= 0) {
                        setVendorFormData(prev => ({ ...prev, marginPercentage: num }));
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (!val || val === "0" || val === "") {
                        setVendorFormData(prev => ({ ...prev, marginPercentage: 0 }));
                      }
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateVendorDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateVendor}
                disabled={isSubmittingVendor || !vendorFormData.name || !vendorFormData.address || !vendorFormData.gstNumber || !vendorFormData.contactPerson}
              >
                {isSubmittingVendor ? "Creating..." : "Create Vendor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Order Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Vendor Order</DialogTitle>
              <DialogDescription>
                Create a new order to send to a vendor. Set wholesale and retail prices to track margins.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Select Vendor *</Label>
                <Select
                  value={formData.vendorId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vendorId: value }))}
                >
                  <SelectTrigger id="vendor">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorsLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Spinner size="sm" />
                          <span>Loading vendors...</span>
                        </div>
                      </SelectItem>
                    ) : vendorsError ? (
                      <SelectItem value="error" disabled>Error: {vendorsError}</SelectItem>
                    ) : vendors.length === 0 ? (
                      <SelectItem value="empty" disabled>No vendors available</SelectItem>
                    ) : (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name} {vendor.gstNumber && `(${vendor.gstNumber})`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {vendorsError && (
                  <p className="text-sm text-red-600 mt-1">⚠️ Error loading vendors: {vendorsError}</p>
                )}
                {!vendorsLoading && !vendorsError && vendors.length === 0 && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">No vendors available.</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setShowCreateVendorDialog(true);
                      }}
                    >
                      Create vendor first
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Order Items *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddOrderItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {formData.orderItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No products added. Click "Add Product" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.orderItems.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Product *</Label>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => handleOrderItemChange(index, "productId", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - ₹{product.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Remove leading zeros but preserve single "0" for user to continue typing
                                // If value is "05", convert to "5"
                                if (val.match(/^0+[1-9]/)) {
                                  const normalizedVal = val.replace(/^0+/, "");
                                  const num = parseInt(normalizedVal, 10);
                                  if (!isNaN(num) && num > 0) {
                                    handleOrderItemChange(index, "quantity", num);
                                  }
                                  return;
                                }
                                // Allow empty string for user to continue typing
                                if (val === "" || val === "0") {
                                  return;
                                }
                                // Parse and update if valid
                                const num = parseInt(val, 10);
                                if (!isNaN(num) && num > 0) {
                                  handleOrderItemChange(index, "quantity", num);
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (!val || val === "0" || parseInt(val, 10) < 1) {
                                  handleOrderItemChange(index, "quantity", 1);
                                }
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Wholesale Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.wholesalePrice !== undefined && item.wholesalePrice !== null ? item.wholesalePrice : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Remove leading zeros from integer part (e.g., "05.50" becomes "5.50")
                                const normalizedVal = val.replace(/^0+([1-9])/, "$1");
                                if (normalizedVal === "" || normalizedVal === "0") {
                                  handleOrderItemChange(index, "wholesalePrice", 0);
                                  return;
                                }
                                const num = parseFloat(normalizedVal);
                                if (!isNaN(num) && num >= 0) {
                                  handleOrderItemChange(index, "wholesalePrice", num);
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (!val || val === "0" || val === "") {
                                  handleOrderItemChange(index, "wholesalePrice", 0);
                                }
                              }}
                              placeholder="Price you charge vendor"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Retail Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.retailPrice !== undefined && item.retailPrice !== null ? item.retailPrice : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Remove leading zeros from integer part (e.g., "05.50" becomes "5.50")
                                const normalizedVal = val.replace(/^0+([1-9])/, "$1");
                                if (normalizedVal === "" || normalizedVal === "0") {
                                  handleOrderItemChange(index, "retailPrice", 0);
                                  return;
                                }
                                const num = parseFloat(normalizedVal);
                                if (!isNaN(num) && num >= 0) {
                                  handleOrderItemChange(index, "retailPrice", num);
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (!val || val === "0" || val === "") {
                                  handleOrderItemChange(index, "retailPrice", 0);
                                }
                              }}
                              placeholder="Price vendor sells at"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Subtotal: ₹{(item.wholesalePrice * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Margin: ₹{((item.retailPrice - item.wholesalePrice) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOrderItem(index)}
                            className="text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {formData.orderItems.length > 0 && (
                <Card className="p-4 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total Wholesale Amount:</p>
                      <p className="text-2xl font-bold">
                        ₹{formData.orderItems.reduce((sum, item) => sum + (item.wholesalePrice * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Retail Value:</p>
                      <p className="text-2xl font-bold">
                        ₹{formData.orderItems.reduce((sum, item) => sum + (item.retailPrice * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Total Margin:</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{(
                          formData.orderItems.reduce((sum, item) => sum + (item.retailPrice * item.quantity), 0) -
                          formData.orderItems.reduce((sum, item) => sum + (item.wholesalePrice * item.quantity), 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !formData.vendorId || formData.orderItems.length === 0}
              >
                {isSubmitting ? "Creating..." : "Create Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading vendor orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No vendor orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Wholesale Amount</TableHead>
                  <TableHead>Retail Value</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusBadge(order.status);
                  const marginAmount = order.salePrice - order.totalAmount;
                  const marginPercent = order.totalAmount > 0 ? (marginAmount / order.totalAmount) * 100 : 0;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.orderId || order.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{order.vendorName}</TableCell>
                      <TableCell>{format(new Date(order.sentDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="font-semibold">₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>₹{order.salePrice.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ₹{marginAmount.toFixed(2)} ({marginPercent.toFixed(1)}%)
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.className}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={async (newStatus) => {
                              try {
                                await updateVendorOrderStatus(order.id, newStatus as VendorOrderStatus);
                                // Refresh orders list
                                const updatedOrders = await getVendorOrders();
                                setVendorOrders(updatedOrders);
                              } catch (error: any) {
                                alert(error.message || "Failed to update order status");
                              }
                            }}
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={VendorOrderStatus.SENT}>SENT</SelectItem>
                              <SelectItem value={VendorOrderStatus.PARTIALLY_SOLD}>PARTIALLY_SOLD</SelectItem>
                              <SelectItem value={VendorOrderStatus.SOLD}>SOLD</SelectItem>
                              <SelectItem value={VendorOrderStatus.RETURNED}>RETURNED</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete order ${order.orderId}?`)) {
                                try {
                                  await deleteVendorOrder(order.id);
                                  // Refresh orders list
                                  const updatedOrders = await getVendorOrders();
                                  setVendorOrders(updatedOrders);
                                  alert("Order deleted successfully!");
                                } catch (error: any) {
                                  alert(error.message || "Failed to delete order");
                                }
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Profit Tab Component
export function ProfitTab() {
  const [profitData, setProfitData] = React.useState<ProfitLoss[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [periodFilter, setPeriodFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const fetchProfit = async () => {
      try {
        setIsLoading(true);
        const data = await getProfitLoss(periodFilter !== "all" ? periodFilter : undefined);
        // Filter to show only profit entries
        const profits = data.filter(p => p.netProfit > 0);
        setProfitData(profits);
      } catch (error) {
        console.error("Error fetching profit data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfit();
  }, [periodFilter]);

  const totalProfit = profitData.reduce((sum, p) => sum + p.netProfit, 0);
  const totalSales = profitData.reduce((sum, p) => sum + p.totalSales, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Profit Analysis
            </CardTitle>
            <CardDescription>
              Track your business profits by vendor and period
            </CardDescription>
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-03">March 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Profit</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                    ₹{totalProfit.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-3xl font-bold mt-2">₹{totalSales.toFixed(2)}</p>
                </div>
                <DollarSign className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                  <p className="text-3xl font-bold mt-2">
                    {totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading profit data..." />
          </div>
        ) : profitData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No profit data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Gross Profit</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Net Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.period}</TableCell>
                    <TableCell>{data.vendorName || "All Vendors"}</TableCell>
                    <TableCell className="font-semibold">₹{data.totalSales.toFixed(2)}</TableCell>
                    <TableCell>₹{data.totalCost.toFixed(2)}</TableCell>
                    <TableCell className="text-green-600">₹{data.grossProfit.toFixed(2)}</TableCell>
                    <TableCell>₹{data.expenses.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-green-600">₹{data.netProfit.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loss Tab Component
export function LossTab() {
  const [lossData, setLossData] = React.useState<ProfitLoss[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLoss = async () => {
      try {
        setIsLoading(true);
        const data = await getProfitLoss();
        // Filter to show only loss entries
        const losses = data.filter(p => p.netLoss > 0);
        setLossData(losses);
      } catch (error) {
        console.error("Error fetching loss data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoss();
  }, []);

  const totalLoss = lossData.reduce((sum, p) => sum + p.netLoss, 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Loss Analysis
          </CardTitle>
          <CardDescription>
            Track losses and identify areas for improvement
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Loss</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
                    ₹{totalLoss.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading loss data..." />
          </div>
        ) : lossData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No loss data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Net Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lossData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.period}</TableCell>
                    <TableCell>{data.vendorName || "All Vendors"}</TableCell>
                    <TableCell className="font-semibold">₹{data.totalSales.toFixed(2)}</TableCell>
                    <TableCell>₹{data.totalCost.toFixed(2)}</TableCell>
                    <TableCell>₹{data.expenses.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-red-600">₹{data.netLoss.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Payouts Tab Component
export function PayoutsTab() {
  const [payouts, setPayouts] = React.useState<Payout[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [invoices, setInvoices] = React.useState<GSTInvoice[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [payoutFormData, setPayoutFormData] = React.useState({
    invoiceId: "",
    paymentMethod: "BANK_TRANSFER",
    transactionId: "",
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [payoutsData, invoicesData] = await Promise.all([
          getAllPayouts(),
          getAllInvoices(),
        ]);
        setPayouts(payoutsData);
        setInvoices(invoicesData.filter(inv => inv.status === InvoiceStatus.PAID || inv.status === InvoiceStatus.SENT));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleCreatePayout = async () => {
    if (!payoutFormData.invoiceId) {
      alert("Please select an invoice");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const selectedInvoice = invoices.find(inv => inv.id === payoutFormData.invoiceId);
      if (!selectedInvoice) {
        alert("Invoice not found");
        return;
      }
      
      const payoutData: Omit<Payout, "id" | "createdAt"> = {
        vendorId: selectedInvoice.vendorId,
        vendorName: selectedInvoice.vendorName,
        invoiceId: payoutFormData.invoiceId,
        amount: selectedInvoice.totalAmount,
        status: "PENDING" as PayoutStatus,
        paymentMethod: payoutFormData.paymentMethod,
        transactionId: payoutFormData.transactionId || undefined,
      };
      
      await createPayout(payoutData);
      
      // Reset form
      setPayoutFormData({
        invoiceId: "",
        paymentMethod: "BANK_TRANSFER",
        transactionId: "",
      });
      setShowCreateDialog(false);
      
      // Refresh payouts
      const updatedPayouts = await getAllPayouts();
      setPayouts(updatedPayouts);
      
      alert("Payout created successfully!");
    } catch (error: any) {
      console.error("Error creating payout:", error);
      alert(error.message || "Failed to create payout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPayouts = payouts.filter(p => statusFilter === "all" || p.status === statusFilter);

  const getStatusBadge = (status: PayoutStatus) => {
    const configs: Record<PayoutStatus, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode, className: string }> = {
      PENDING: { variant: "outline", icon: <Clock className="h-3 w-3" />, className: "text-yellow-600 border-yellow-600" },
      PROCESSING: { variant: "secondary", icon: <Clock className="h-3 w-3" />, className: "text-blue-600 border-blue-600" },
      COMPLETED: { variant: "default", icon: <CheckCircle className="h-3 w-3" />, className: "text-green-600 border-green-600" },
      FAILED: { variant: "destructive", icon: <XCircle className="h-3 w-3" />, className: "" },
    };
    return configs[status] || { variant: "secondary", icon: null, className: "" };
  };

  const totalPayouts = filteredPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payouts
            </CardTitle>
            <CardDescription>
              Track payments made to vendors
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Payout
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create Payout Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Payout</DialogTitle>
              <DialogDescription>
                Create a payout for a paid invoice
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Invoice *</Label>
                <Select
                  value={payoutFormData.invoiceId}
                  onValueChange={(value) => setPayoutFormData(prev => ({ ...prev, invoiceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.vendorName} - ₹{invoice.totalAmount.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select
                  value={payoutFormData.paymentMethod}
                  onValueChange={(value) => setPayoutFormData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Transaction ID (Optional)</Label>
                <Input
                  value={payoutFormData.transactionId}
                  onChange={(e) => setPayoutFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="Transaction reference number"
                />
              </div>
              
              {payoutFormData.invoiceId && (
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Invoice Amount:</p>
                    <p className="text-2xl font-bold">
                      ₹{invoices.find(inv => inv.id === payoutFormData.invoiceId)?.totalAmount.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </Card>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePayout}
                disabled={isSubmitting || !payoutFormData.invoiceId}
              >
                {isSubmitting ? "Creating..." : "Create Payout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                  <p className="text-3xl font-bold mt-2">₹{totalPayouts.toFixed(2)}</p>
                </div>
                <Wallet className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading payouts..." />
          </div>
        ) : filteredPayouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payouts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => {
                  const statusConfig = getStatusBadge(payout.status);
                  return (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-xs">{payout.id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-medium">{payout.vendorName}</TableCell>
                      <TableCell className="font-mono text-xs">{payout.invoiceId.slice(0, 8)}...</TableCell>
                      <TableCell className="font-semibold">₹{payout.amount.toFixed(2)}</TableCell>
                      <TableCell>{payout.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={`flex items-center gap-1 w-fit ${statusConfig.className}`}>
                          {statusConfig.icon}
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payout.paymentDate ? format(new Date(payout.paymentDate), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// GST Invoices Tab Component
export function GSTInvoicesTab() {
  const [invoices, setInvoices] = React.useState<GSTInvoice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [vendorOrders, setVendorOrders] = React.useState<VendorOrder[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<GSTInvoice | null>(null);
  const [vendorsError, setVendorsError] = React.useState<string | null>(null);
  
  const [invoiceFormData, setInvoiceFormData] = React.useState({
    vendorId: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isInterState: false,
    items: [] as Array<{
      productName: string;
      hsnCode: string;
      quantity: number;
      unitPrice: number;
      gstRate: number;
    }>,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setVendorsError(null);
        console.log("🔄 Fetching invoices, vendors, and orders...");
        const [invoicesData, vendorsData, ordersData] = await Promise.all([
          getAllInvoices(),
          getAllVendors(),
          getVendorOrders(),
        ]);
        console.log("✅ Invoices fetched:", invoicesData.length);
        console.log("✅ Vendors fetched:", vendorsData.length);
        console.log("✅ Orders fetched:", ordersData.length);
        setInvoices(invoicesData);
        setVendors(vendorsData);
        setVendorOrders(ordersData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        if (error instanceof Error && error.message.includes("vendors")) {
          setVendorsError(error.message);
        }
        // Continue with empty arrays for other data
        setInvoices([]);
        setVendors([]);
        setVendorOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleAddInvoiceItem = () => {
    setInvoiceFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productName: "",
        hsnCode: "",
        quantity: 1,
        unitPrice: 0,
        gstRate: 18, // Default 18% GST
      }]
    }));
  };
  
  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  const handleInvoiceItemChange = (index: number, field: string, value: any) => {
    setInvoiceFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };
  
  const handleCreateInvoice = async () => {
    if (!invoiceFormData.vendorId || invoiceFormData.items.length === 0) {
      alert("Please select a vendor and add at least one item");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const invoiceData: Omit<GSTInvoice, "id" | "invoiceNumber" | "createdAt"> = {
        vendorId: invoiceFormData.vendorId,
        vendorName: vendors.find(v => v.id === invoiceFormData.vendorId)?.name || "",
        vendorGST: vendors.find(v => v.id === invoiceFormData.vendorId)?.gstNumber || "",
        invoiceDate: invoiceFormData.invoiceDate,
        dueDate: invoiceFormData.dueDate,
        items: invoiceFormData.items.map(item => ({
          id: "",
          productName: item.productName,
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          gstRate: item.gstRate,
          taxableAmount: item.unitPrice * item.quantity,
          cgst: invoiceFormData.isInterState ? 0 : (item.unitPrice * item.quantity * item.gstRate / 100 / 2),
          sgst: invoiceFormData.isInterState ? 0 : (item.unitPrice * item.quantity * item.gstRate / 100 / 2),
          igst: invoiceFormData.isInterState ? (item.unitPrice * item.quantity * item.gstRate / 100) : 0,
          total: item.unitPrice * item.quantity * (1 + item.gstRate / 100),
        })),
        subtotal: invoiceFormData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
        cgst: invoiceFormData.items.reduce((sum, item) => 
          sum + (invoiceFormData.isInterState ? 0 : (item.unitPrice * item.quantity * item.gstRate / 100 / 2)), 0),
        sgst: invoiceFormData.items.reduce((sum, item) => 
          sum + (invoiceFormData.isInterState ? 0 : (item.unitPrice * item.quantity * item.gstRate / 100 / 2)), 0),
        igst: invoiceFormData.items.reduce((sum, item) => 
          sum + (invoiceFormData.isInterState ? (item.unitPrice * item.quantity * item.gstRate / 100) : 0), 0),
        totalAmount: invoiceFormData.items.reduce((sum, item) => 
          sum + (item.unitPrice * item.quantity * (1 + item.gstRate / 100)), 0),
        status: InvoiceStatus.DRAFT,
      };
      
      await createInvoice(invoiceData);
      
      // Reset form
      setInvoiceFormData({
        vendorId: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isInterState: false,
        items: [],
      });
      setShowCreateDialog(false);
      
      // Refresh invoices
      const updatedInvoices = await getAllInvoices();
      setInvoices(updatedInvoices);
      
      alert("Invoice created successfully!");
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      alert(error.message || "Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    const configs: Record<InvoiceStatus, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      DRAFT: { variant: "outline", className: "text-gray-600 border-gray-600" },
      SENT: { variant: "secondary", className: "text-blue-600 border-blue-600" },
      PAID: { variant: "default", className: "text-green-600 border-green-600" },
      OVERDUE: { variant: "destructive", className: "" },
    };
    return configs[status] || { variant: "secondary", className: "" };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              GST Invoices
            </CardTitle>
            <CardDescription>
              Create and manage GST invoices for vendors
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by invoice number or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create Invoice Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create GST Invoice</DialogTitle>
              <DialogDescription>
                Create a new GST invoice for a vendor
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Select Vendor *</Label>
                  <Select
                    value={invoiceFormData.vendorId}
                    onValueChange={(value) => setInvoiceFormData(prev => ({ ...prev, vendorId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <Spinner size="sm" />
                            <span>Loading vendors...</span>
                          </div>
                        </SelectItem>
                      ) : vendorsError ? (
                        <SelectItem value="error" disabled>Error: {vendorsError}</SelectItem>
                      ) : vendors.length === 0 ? (
                        <SelectItem value="empty" disabled>No vendors available</SelectItem>
                      ) : (
                        vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name} ({vendor.gstNumber})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {vendorsError && (
                    <p className="text-sm text-red-600 mt-1">⚠️ Error loading vendors: {vendorsError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Invoice Date *</Label>
                  <Input
                    type="date"
                    value={invoiceFormData.invoiceDate}
                    onChange={(e) => setInvoiceFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Due Date *</Label>
                  <Input
                    type="date"
                    value={invoiceFormData.dueDate}
                    onChange={(e) => setInvoiceFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isInterState"
                    checked={invoiceFormData.isInterState}
                    onChange={(e) => setInvoiceFormData(prev => ({ ...prev, isInterState: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isInterState">Inter-State (IGST) / Intra-State (CGST+SGST)</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Invoice Items *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddInvoiceItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {invoiceFormData.items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items added. Click "Add Item" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoiceFormData.items.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="space-y-2">
                            <Label>Product Name *</Label>
                            <Input
                              value={item.productName}
                              onChange={(e) => handleInvoiceItemChange(index, "productName", e.target.value)}
                              placeholder="Product name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>HSN Code *</Label>
                            <Input
                              value={item.hsnCode}
                              onChange={(e) => handleInvoiceItemChange(index, "hsnCode", e.target.value)}
                              placeholder="HSN code"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity || ""}
                              onChange={(e) => handleInvoiceItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Unit Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice || ""}
                              onChange={(e) => handleInvoiceItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>GST Rate (%) *</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={item.gstRate || ""}
                              onChange={(e) => handleInvoiceItemChange(index, "gstRate", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            <p>Subtotal: ₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                            <p>GST: ₹{(item.unitPrice * item.quantity * item.gstRate / 100).toFixed(2)}</p>
                            <p className="font-semibold">Total: ₹{(item.unitPrice * item.quantity * (1 + item.gstRate / 100)).toFixed(2)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInvoiceItem(index)}
                            className="text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {invoiceFormData.items.length > 0 && (
                <Card className="p-4 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Subtotal:</p>
                      <p className="text-2xl font-bold">
                        ₹{invoiceFormData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Total GST:</p>
                      <p className="text-2xl font-bold">
                        ₹{invoiceFormData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * item.gstRate / 100), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Amount:</p>
                      <p className="text-2xl font-bold">
                        ₹{invoiceFormData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * (1 + item.gstRate / 100)), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateInvoice}
                disabled={isSubmitting || !invoiceFormData.vendorId || invoiceFormData.items.length === 0}
              >
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Loading invoices..." />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const statusConfig = getStatusBadge(invoice.status);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-semibold">{invoice.invoiceNumber}</TableCell>
                      <TableCell className="font-medium">{invoice.vendorName}</TableCell>
                      <TableCell className="font-mono text-xs">{invoice.vendorGST}</TableCell>
                      <TableCell>{format(new Date(invoice.invoiceDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell>₹{invoice.subtotal.toFixed(2)}</TableCell>
                      <TableCell>₹{(invoice.cgst + invoice.sgst + invoice.igst).toFixed(2)}</TableCell>
                      <TableCell className="font-bold">₹{invoice.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.className}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={invoice.status}
                            onValueChange={async (newStatus) => {
                              try {
                                await updateInvoiceStatus(invoice.id, newStatus as InvoiceStatus);
                                // Refresh invoices list
                                const updatedInvoices = await getAllInvoices();
                                setInvoices(updatedInvoices);
                              } catch (error: any) {
                                alert(error.message || "Failed to update invoice status");
                              }
                            }}
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={InvoiceStatus.DRAFT}>DRAFT</SelectItem>
                              <SelectItem value={InvoiceStatus.SENT}>SENT</SelectItem>
                              <SelectItem value={InvoiceStatus.PAID}>PAID</SelectItem>
                              <SelectItem value={InvoiceStatus.OVERDUE}>OVERDUE</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
                                try {
                                  await deleteInvoice(invoice.id);
                                  // Refresh invoices list
                                  const updatedInvoices = await getAllInvoices();
                                  setInvoices(updatedInvoices);
                                  alert("Invoice deleted successfully!");
                                } catch (error: any) {
                                  alert(error.message || "Failed to delete invoice");
                                }
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Invoice Details Dialog */}
        {selectedInvoice && (
          <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogDescription>
                  Invoice Number: {selectedInvoice.invoiceNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Vendor</Label>
                    <p className="font-semibold">{selectedInvoice.vendorName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">GST Number</Label>
                    <p className="font-mono text-sm">{selectedInvoice.vendorGST}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Invoice Date</Label>
                    <p>{format(new Date(selectedInvoice.invoiceDate), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p>{format(new Date(selectedInvoice.dueDate), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant={getStatusBadge(selectedInvoice.status).variant} className={getStatusBadge(selectedInvoice.status).className}>
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Invoice Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>HSN Code</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>GST Rate</TableHead>
                        <TableHead>Taxable Amount</TableHead>
                        <TableHead>CGST</TableHead>
                        <TableHead>SGST</TableHead>
                        <TableHead>IGST</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="font-mono text-xs">{item.hsnCode}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>{item.gstRate}%</TableCell>
                          <TableCell>₹{item.taxableAmount.toFixed(2)}</TableCell>
                          <TableCell>₹{item.cgst.toFixed(2)}</TableCell>
                          <TableCell>₹{item.sgst.toFixed(2)}</TableCell>
                          <TableCell>₹{item.igst.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">₹{item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">₹{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGST:</span>
                    <span>₹{selectedInvoice.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SGST:</span>
                    <span>₹{selectedInvoice.sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IGST:</span>
                    <span>₹{selectedInvoice.igst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span>₹{selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement PDF generation
                    alert("PDF download functionality coming soon");
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

