"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { getProduct, updateProductWithImage, getProductCategories } from "@/services/products";
import type { Candle } from "@/types/candle";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/image-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [product, setProduct] = React.useState<Candle | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    price: "",
    scentCategory: "",
    scentNotes: "",
    burnTime: "",
    ingredients: "",
    imageUrl: "",
    popularity: ""
  });

  const [categories, setCategories] = React.useState<string[]>(["Citrus", "Floral", "Sweet", "Fresh", "Fruity"]);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await getProduct(params.id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setFormData({
            name: fetchedProduct.name,
            description: fetchedProduct.description,
            price: fetchedProduct.price.toString(),
            scentCategory: fetchedProduct.scentCategory,
            scentNotes: fetchedProduct.scentNotes,
            burnTime: fetchedProduct.burnTime,
            ingredients: fetchedProduct.ingredients,
            imageUrl: fetchedProduct.imageUrl,
            popularity: fetchedProduct.popularity.toString()
          });
          setImagePreview(fetchedProduct.imageUrl);
        } else {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist.",
            variant: "destructive"
          });
          router.push("/admin/products");
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, toast]);

  // Fetch categories on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getProductCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Keep default categories if fetch fails
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // If file is removed, revert to current image
      setImagePreview(formData.imageUrl);
    }
  };

  const handleRemoveCurrentImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      setIsSaving(true);
      
      const updatedProductData = {
        ...product,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        scentCategory: formData.scentCategory,
        scentNotes: formData.scentNotes,
        burnTime: formData.burnTime,
        ingredients: formData.ingredients,
        imageUrl: formData.imageUrl,
        popularity: parseInt(formData.popularity)
      };

      // Use updateProductWithImage if a new image is selected
      if (selectedImage) {
        const result = await updateProductWithImage(product.id, updatedProductData, selectedImage);
        if (result.success) {
          toast({
            title: "Success",
            description: `Product updated successfully! New image uploaded to ${result.imageUrl}`,
          });
        } else {
          toast({
            title: "Warning",
            description: "Product updated but image upload failed. Please try uploading the image again.",
            variant: "destructive"
          });
        }
      } else {
        // Use regular updateProduct if no new image
        await updateProduct(product.id, updatedProductData);
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
      }
      
      router.push("/admin/products");
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Product</h1>
          <p className="text-muted-foreground mt-1">
            Update product information and details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scentCategory">Scent Category *</Label>
                <Select value={formData.scentCategory} onValueChange={(value) => handleInputChange("scentCategory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scentNotes">Scent Notes *</Label>
                <Input
                  id="scentNotes"
                  value={formData.scentNotes}
                  onChange={(e) => handleInputChange("scentNotes", e.target.value)}
                  placeholder="e.g., Vanilla, Lavender, Citrus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="burnTime">Burn Time *</Label>
                <Input
                  id="burnTime"
                  value={formData.burnTime}
                  onChange={(e) => handleInputChange("burnTime", e.target.value)}
                  placeholder="e.g., 40-50 hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients *</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange("ingredients", e.target.value)}
                  placeholder="List the ingredients"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="popularity">Popularity Score</Label>
                <Input
                  id="popularity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.popularity}
                  onChange={(e) => handleInputChange("popularity", e.target.value)}
                  placeholder="0-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Management */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Image Display */}
            <div className="space-y-3">
              <Label>Current Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Current product image"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="hidden w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Invalid image</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Current path:</strong> {formData.imageUrl || 'No image set'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    This is the image currently displayed on your website.
                  </p>
                  {formData.imageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveCurrentImage}
                      className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50"
                    >
                      Remove Current Image
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload for New Image */}
            <div className="space-y-3">
              <Label>Upload New Image (Optional)</Label>
              <ImageUpload
                value={selectedImage}
                onChange={handleImageChange}
                required={false}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to keep the current image. If you upload a new image, it will replace the current one.
              </p>
            </div>

            {/* Image URL Override */}
            <div className="space-y-3">
              <Label htmlFor="imageUrl">Image URL Override</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  handleInputChange("imageUrl", e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="/path/to/image.jpeg"
              />
              <p className="text-sm text-muted-foreground">
                You can manually set a custom image path here. This will override both the current image and any newly uploaded image.
              </p>
            </div>

            {/* Image Upload Instructions */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                <strong>Image Priority:</strong> 1) Manual URL override (if set), 2) Newly uploaded image, 3) Current image. 
                New images are automatically saved to your public/uploads folder.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
