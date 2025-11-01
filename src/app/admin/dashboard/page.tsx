
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Users, TrendingUp, Package, PlusCircle, 
         Receipt, Wallet, TrendingDown, Store, FileText } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/services/products-unified";
import { getCategories } from "@/services/categories-unified";
import type { Candle } from "@/types/candle";
import {
  OrdersTab,
  VendorOrdersTab,
  ProfitTab,
  LossTab,
  PayoutsTab,
  GSTInvoicesTab,
} from "@/components/admin/dashboard-tabs";

export default function AdminDashboardPage() {
  const [products, setProducts] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalCategories: 0,
    avgPrice: 0,
    topCategory: ''
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        setProducts(fetchedProducts);
        
        // Calculate stats
        const activeCategories = fetchedCategories.filter(cat => cat.isActive);
        const avgPrice = fetchedProducts.length > 0 
          ? fetchedProducts.reduce((sum, p) => sum + p.price, 0) / fetchedProducts.length 
          : 0;
        
        // Find top category by popularity
        const categoryPopularity = fetchedProducts.reduce((acc, product) => {
          acc[product.scentCategory] = (acc[product.scentCategory] || 0) + product.popularity;
          return acc;
        }, {} as Record<string, number>);
        
        const topCategory = Object.entries(categoryPopularity)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
        
        setStats({
          totalProducts: fetchedProducts.length,
          totalCategories: activeCategories.length,
          avgPrice: Math.round(avgPrice * 100) / 100,
          topCategory
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Welcome back! Manage your store, track orders, and monitor business performance.
          </p>
        </div>
        <Button asChild className="shrink-0 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Total Products
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              {isLoading ? '...' : stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {isLoading ? 'Loading...' : 'Products in store'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-background to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Categories
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              {isLoading ? '...' : stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Active scent categories
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-br from-background to-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Avg Price
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              {isLoading ? '...' : `₹${stats.avgPrice}`}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Average product price
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-background to-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Top Category
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1 truncate">
              {isLoading ? '...' : stats.topCategory}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Most popular category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Interface */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-muted/50">
          <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Order Details</span>
            <span className="sm:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="merchants" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Vendor Orders</span>
            <span className="sm:hidden">Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="profit" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Profit</span>
          </TabsTrigger>
          <TabsTrigger value="loss" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Loss</span>
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Payouts</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">GST Invoices</span>
            <span className="sm:hidden">Invoices</span>
          </TabsTrigger>
        </TabsList>

        {/* Order Details Tab */}
        <TabsContent value="orders" className="space-y-4">
          <OrdersTab />
        </TabsContent>

        {/* Vendor Orders Tab */}
        <TabsContent value="merchants" className="space-y-4">
          <VendorOrdersTab />
        </TabsContent>

        {/* Profit Tab */}
        <TabsContent value="profit" className="space-y-4">
          <ProfitTab />
        </TabsContent>

        {/* Loss Tab */}
        <TabsContent value="loss" className="space-y-4">
          <LossTab />
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <PayoutsTab />
        </TabsContent>

        {/* GST Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <GSTInvoicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
