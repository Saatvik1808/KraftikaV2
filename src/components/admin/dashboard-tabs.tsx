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
import { getAllOrders, getVendorOrders, getAllPayouts, getAllInvoices, getProfitLoss, getAllVendors, createVendorOrder, createVendor } from "@/services/orders-api";
import type { Order, VendorOrder, Payout, GSTInvoice, ProfitLoss, Vendor, OrderStatus, VendorOrderStatus, InvoiceStatus, PayoutStatus } from "@/types/order";
import { format } from "date-fns";
import { getProducts } from "@/services/products-unified";
import { Label } from "@/components/ui/label";

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
          <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
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
        const [vendorsData, productsData] = await Promise.all([
          getAllVendors(),
          getProducts(),
        ]);
        setVendors(vendorsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching vendors/products:", error);
      }
    };
    fetchVendorsAndProducts();
  }, []);

  React.useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getVendorOrders();
        
        // If no data from API, try loading from localStorage (demo mode)
        if (data.length === 0) {
          const demoOrders = localStorage.getItem("demo_vendor_orders");
          if (demoOrders) {
            setVendorOrders(JSON.parse(demoOrders));
          } else {
            setVendorOrders([]);
          }
        } else {
          setVendorOrders(data);
        }
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
        // Try loading from localStorage as fallback
        const demoOrders = localStorage.getItem("demo_vendor_orders");
        if (demoOrders) {
          setVendorOrders(JSON.parse(demoOrders));
        }
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
      const newVendor = await createVendor(vendorFormData);
      
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
        await createVendorOrder(vendorOrder);
        
        // Reset form
        setFormData({
          vendorId: "",
          orderItems: [],
        });
        setShowCreateDialog(false);
        
        // Refresh orders list
        const updatedOrders = await getVendorOrders();
        setVendorOrders(updatedOrders);
        
        alert("Order created successfully!");
      } catch (apiError: any) {
        // If backend is not implemented, store locally for demo
        if (apiError.message?.includes("Not implemented") || apiError.message?.includes("not implemented")) {
          // Store in localStorage for demo purposes
          const existingOrders = JSON.parse(localStorage.getItem("demo_vendor_orders") || "[]");
          const newOrder = {
            ...vendorOrder,
            id: `demo_${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          existingOrders.push(newOrder);
          localStorage.setItem("demo_vendor_orders", JSON.stringify(existingOrders));
          
          // Add to local state
          setVendorOrders(prev => [...prev, newOrder as VendorOrder]);
          
          // Reset form
          setFormData({
            vendorId: "",
            orderItems: [],
          });
          setShowCreateDialog(false);
          
          alert("Order created successfully! (Stored locally - backend not connected yet)");
        } else {
          throw apiError;
        }
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
                    value={vendorFormData.marginPercentage}
                    onChange={(e) => setVendorFormData(prev => ({ ...prev, marginPercentage: parseFloat(e.target.value) || 0 }))}
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
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name} {vendor.gstNumber && `(${vendor.gstNumber})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {vendors.length === 0 && (
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
                              value={item.quantity}
                              onChange={(e) => handleOrderItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Wholesale Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.wholesalePrice}
                              onChange={(e) => handleOrderItemChange(index, "wholesalePrice", parseFloat(e.target.value) || 0)}
                              placeholder="Price you charge vendor"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Retail Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.retailPrice}
                              onChange={(e) => handleOrderItemChange(index, "retailPrice", parseFloat(e.target.value) || 0)}
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
          <div className="text-center py-8 text-muted-foreground">Loading vendor orders...</div>
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
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
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
          <div className="text-center py-8 text-muted-foreground">Loading profit data...</div>
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
          <div className="text-center py-8 text-muted-foreground">Loading loss data...</div>
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

  React.useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllPayouts();
        setPayouts(data);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayouts();
  }, []);

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
      </CardHeader>
      <CardContent>
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
          <div className="text-center py-8 text-muted-foreground">Loading payouts...</div>
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

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const data = await getAllInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

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
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
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
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement download invoice
                              alert("Download functionality coming soon");
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

