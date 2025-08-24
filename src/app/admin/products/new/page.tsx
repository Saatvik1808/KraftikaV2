"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Info } from "lucide-react";
import { addProduct } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "@/components/admin/image-upload";
import { Label } from "@/components/ui/label";
import { getProductCategories } from "@/services/products";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  scentCategory: z.string().min(1, "Please select a scent category."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  scentNotes: z.string().min(3, "Scent notes are required."),
  burnTime: z.string().min(3, "Burn time is required."),
  ingredients: z.string().min(10, "Ingredients are required."),
  image: z.instanceof(File).refine(file => file.size > 0, "Product image is required."),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState<{
    imageUrl?: string;
    fileName?: string;
  } | null>(null);
  const [scentCategories, setScentCategories] = React.useState<string[]>(["Citrus", "Floral", "Sweet", "Fresh", "Fruity"]);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      scentCategory: "",
      price: 0,
      description: "",
      scentNotes: "",
      burnTime: "",
      ingredients: "",
    },
  });

  // Fetch categories on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getProductCategories();
        setScentCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Keep default categories if fetch fails
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setUploadResult(null);

    // Create a FormData object to send to the server action
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, String(value));
        }
    });

    try {
      const result = await addProduct(formData);

      if (result.success) {
        setUploadResult({
          imageUrl: result.imageUrl,
          fileName: result.fileName
        });
        
        toast({
          title: "Product Added!",
          description: `"${data.name}" has been successfully added with image.`,
        });
        
        // Don't redirect immediately, show the success message
        setTimeout(() => {
          router.push("/admin/products");
        }, 5000);
      } else {
        toast({
          title: "Error",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred while processing the form.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Product</h1>
        <p className="text-muted-foreground mt-1">
          Create a new product for your candle collection.
        </p>
      </div>

      {/* Image Upload Instructions */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Free Image Upload:</strong> Images are uploaded directly to your public folder using our local API. 
          No external storage costs, no Firebase Storage fees!
        </AlertDescription>
      </Alert>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunrise Citrus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 450" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="scentCategory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Scent Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {scentCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed product description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scentNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scent Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vanilla, Lavender, Citrus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="burnTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Burn Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Approx. 50-55 hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Natural Soy Wax, Fragrance..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Section */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={value}
                        onChange={onChange}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Product
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Upload Result Instructions */}
      {uploadResult && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">Product Added Successfully! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800 dark:text-green-200">Image Upload Complete!</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your image has been automatically saved to the public folder and is ready to use.
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-800 dark:text-green-200">Image Path:</Label>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded border border-green-200 dark:border-green-700">
                  <code className="text-sm text-green-800 dark:text-green-200 break-all">
                    {uploadResult.imageUrl}
                  </code>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-800 dark:text-green-200">File Name:</Label>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded border border-green-200 dark:border-green-700">
                  <code className="text-sm text-green-800 dark:text-green-200 break-all">
                    {uploadResult.fileName}
                  </code>
                </div>
              </div>
            </div>
            
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Success:</strong> Your image is now accessible at {uploadResult.imageUrl} and will be displayed on your website immediately.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> You'll be redirected to the products page in 5 seconds. 
                Your product is now live with the uploaded image!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
