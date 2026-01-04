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
import { addProductAction } from "../actions-unified";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MultipleImageUpload } from "@/components/admin/multiple-image-upload";
import { VideoUpload } from "@/components/admin/video-upload";
import { Label } from "@/components/ui/label";
import { getProductCategories } from "@/services/products-unified";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  scentCategory: z.string().min(1, "Please select a scent category."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  scentNotes: z.string().min(3, "Scent notes are required."),
  burnTime: z.string().min(3, "Burn time is required."),
  ingredients: z.string().min(10, "Ingredients are required."),
  images: z.array(z.instanceof(File)).min(1, "At least one product image is required."),
  video: z.instanceof(File).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState<{
    imageUrls?: string[];
    videoUrl?: string;
  } | null>(null);
  const [scentCategories, setScentCategories] = React.useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = React.useState<File | null>(null);
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
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
      images: [],
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

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== 'images') {
        formData.append(key, value);
      }
    });
    
    // Add images
    selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    // Add video if selected
    if (selectedVideo) {
      formData.append('video', selectedVideo);
    }

    try {
      const result = await addProductAction(formData);

      if (result.success) {
        setUploadResult({
          imageUrls: result.imageUrls,
          videoUrl: result.videoUrl
        });
        
        toast({
          title: "Product Added!",
          description: `"${data.name}" has been successfully added.`,
        });
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 3000);
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

              <div className="space-y-2">
                <Label>
                  Product Images <span className="text-red-500">*</span>
                </Label>
                <MultipleImageUpload
                  value={selectedImages}
                  onChange={(files) => {
                    setSelectedImages(files);
                    form.setValue("images", files, { shouldValidate: true });
                  }}
                  required
                  maxImages={10}
                />
                {form.formState.errors.images && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.images.message as string}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="video"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormControl>
                      <VideoUpload
                        value={selectedVideo}
                        onChange={(file) => {
                          setSelectedVideo(file);
                          onChange(file);
                        }}
                        required={false}
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
            
            {uploadResult.imageUrls && uploadResult.imageUrls.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-800 dark:text-green-200">Uploaded Images:</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {uploadResult.imageUrls.map((url, index) => (
                    <div key={index} className="p-2 bg-green-100 dark:bg-green-900 rounded border border-green-200 dark:border-green-700">
                      <code className="text-sm text-green-800 dark:text-green-200 break-all">
                        {url}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Success:</strong> Your {uploadResult.imageUrls?.length || 0} image(s) have been uploaded and will be displayed on your website immediately. You will be redirected shortly.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
