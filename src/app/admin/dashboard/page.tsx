
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
import { Spinner } from "@/components/ui/loader";
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1.5 text-sm">
            Overview of your store performance and key metrics
          </p>
        </div>
        <Button asChild size="default" className="shrink-0 font-semibold">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Products
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <Spinner size="sm" /> : stats.totalProducts}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? 'Loading...' : 'Products in store'}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Categories
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <Spinner size="sm" /> : stats.totalCategories}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active scent categories
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Price
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <Spinner size="sm" /> : `₹${stats.avgPrice}`}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average product price
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Top Category
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
              {isLoading ? <Spinner size="sm" /> : stats.topCategory}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Most popular category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Interface */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <TabsTrigger 
            value="orders" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
            <span className="sm:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger 
            value="merchants" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Vendors</span>
            <span className="sm:hidden">Vendors</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profit" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Profit</span>
            <span className="sm:hidden">Profit</span>
          </TabsTrigger>
          <TabsTrigger 
            value="loss" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Loss</span>
            <span className="sm:hidden">Loss</span>
          </TabsTrigger>
          <TabsTrigger 
            value="payouts" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Payouts</span>
            <span className="sm:hidden">Payouts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Invoices</span>
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
