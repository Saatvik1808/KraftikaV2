"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2,
  Palette,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  type ScentCategory 
} from "@/services/categories";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<ScentCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ScentCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    color: "",
    icon: "",
    isActive: true
  });

  // Predefined color options
  const colorOptions = [
    { value: "bg-blue-500", label: "Blue", preview: "bg-blue-500" },
    { value: "bg-green-500", label: "Green", preview: "bg-green-500" },
    { value: "bg-purple-500", label: "Purple", preview: "bg-purple-500" },
    { value: "bg-pink-500", label: "Pink", preview: "bg-pink-500" },
    { value: "bg-yellow-500", label: "Yellow", preview: "bg-yellow-500" },
    { value: "bg-red-500", label: "Red", preview: "bg-red-500" },
    { value: "bg-indigo-500", label: "Indigo", preview: "bg-indigo-500" },
    { value: "bg-orange-500", label: "Orange", preview: "bg-orange-500" },
  ];

  // Predefined icon options
  const iconOptions = [
    { value: "flower", label: "Flower", icon: "🌸" },
    { value: "leaf", label: "Leaf", icon: "🍃" },
    { value: "star", label: "Star", icon: "⭐" },
    { value: "heart", label: "Heart", icon: "❤️" },
    { value: "sun", label: "Sun", icon: "☀️" },
    { value: "moon", label: "Moon", icon: "🌙" },
    { value: "fire", label: "Fire", icon: "🔥" },
    { value: "droplet", label: "Droplet", icon: "💧" },
  ];

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "",
      icon: "",
      isActive: true
    });
    setEditingCategory(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && editingCategory) {
        // Update existing category
        setIsEditing(true);
        const result = await updateCategory(editingCategory.id, formData);
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Category updated successfully!",
          });
          await fetchCategories();
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update category.",
            variant: "destructive",
          });
        }
      } else {
        // Add new category
        setIsAdding(true);
        const result = await addCategory(formData);
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Category added successfully!",
          });
          await fetchCategories();
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add category.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
      setIsEditing(false);
    }
  };

  const handleEdit = (category: ScentCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "",
      icon: category.icon || "",
      isActive: category.isActive
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: ScentCategory) => {
    try {
      const result = await deleteCategory(category.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        });
        await fetchCategories();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete category.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (category: ScentCategory) => {
    try {
      const result = await updateCategory(category.id, { isActive: !category.isActive });
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Category ${!category.isActive ? 'activated' : 'deactivated'} successfully!`,
        });
        await fetchCategories();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update category.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Scent Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage scent categories for your products.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Update the category information below." 
                  : "Create a new scent category for your products."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Citrus, Floral, Sweet"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this scent category"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color Theme</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <span>{icon.icon}</span>
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active (visible to customers)</Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || isEditing}>
                  {isAdding || isEditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {isEditing ? "Update Category" : "Add Category"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {category.icon && (
                    <span className="text-lg">{iconOptions.find(icon => icon.value === category.icon)?.icon || "🏷️"}</span>
                  )}
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {category.productCount} products
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
              
              <div className="flex items-center gap-2">
                {category.color && (
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                )}
                <span className="text-xs text-muted-foreground">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(category)}
                  className={category.isActive ? "text-orange-600" : "text-green-600"}
                >
                  {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={category.productCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{category.name}"? This action cannot be undone.
                        {category.productCount > 0 && (
                          <span className="block mt-2 text-red-600">
                            ⚠️ This category has {category.productCount} products and cannot be deleted.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category)}
                        disabled={category.productCount > 0}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="text-center p-10">
          <CardContent>
            <Tag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first scent category to organize your products.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
