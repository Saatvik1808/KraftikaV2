
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Manage your products here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Product listing will be displayed here.</p>
          {/* We will add a data table here later */}
        </CardContent>
      </Card>
    </div>
  );
}
