
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Users, TrendingUp, Package, PlusCircle, Edit3, Trash2, Eye, Tag } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import type { Candle } from "@/types/candle";

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

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Loading...' : 'Products in store'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              Scent categories
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Price
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : `₹${stats.avgPrice}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Average product price
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Category
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats.topCategory}
            </div>
            <p className="text-xs text-muted-foreground">
              Most popular category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/products/new">
                <PlusCircle className="h-6 w-6" />
                <span className="font-medium">Add Product</span>
                <span className="text-xs text-muted-foreground">Create new product</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/products">
                <ShoppingBag className="h-6 w-6" />
                <span className="font-medium">Manage Products</span>
                <span className="text-xs text-muted-foreground">Edit & delete products</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/admin/categories">
                <Tag className="h-6 w-6" />
                <span className="font-medium">Manage Categories</span>
                <span className="text-xs text-muted-foreground">Add & edit scent categories</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/products" target="_blank">
                <Eye className="h-6 w-6" />
                <span className="font-medium">View Store</span>
                <span className="text-xs text-muted-foreground">See customer view</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Your latest added products
              </CardDescription>
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href="/admin/products">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentProducts.length > 0 ? (
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.scentCategory}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products yet. Add your first product to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
