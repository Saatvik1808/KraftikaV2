"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface MultipleImageUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  currentImageUrls?: string[];
  onRemoveCurrentImage?: (index: number) => void;
  label?: string;
  required?: boolean;
  className?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  value = [],
  onChange,
  currentImageUrls = [],
  onRemoveCurrentImage,
  label = "Product Images",
  required = false,
  className,
  maxImages = 10
}: MultipleImageUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [imagePreviews, setImagePreviews] = React.useState<Map<number, string>>(new Map());
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Generate previews for selected files
  React.useEffect(() => {
    const previews = new Map<number, string>();
    value.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.set(index, e.target?.result as string);
        setImagePreviews(new Map(previews));
      };
      reader.readAsDataURL(file);
    });
  }, [value]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      addFiles(files);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      addFiles(fileArray);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const currentCount = value.length + currentImageUrls.length;
    const remainingSlots = maxImages - currentCount;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed. Please remove some images first.`);
      return;
    }

    const filesToAdd = newFiles.slice(0, remainingSlots);
    onChange([...value, ...filesToAdd]);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    const newPreviews = new Map(imagePreviews);
    newPreviews.delete(index);
    setImagePreviews(newPreviews);
  };

  const removeCurrentImage = (index: number) => {
    if (onRemoveCurrentImage) {
      onRemoveCurrentImage(index);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const totalImages = value.length + currentImageUrls.length;

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-base font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-sm text-muted-foreground ml-2">
          ({totalImages}/{maxImages} images)
        </span>
      </Label>

      {/* Current Images Display */}
      {currentImageUrls.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Images</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentImageUrls.map((url, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCurrentImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files Display */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">New Images to Upload</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {value.map((file, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {imagePreviews.get(index) ? (
                      <img
                        src={imagePreviews.get(index)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {file.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {totalImages < maxImages && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {dragActive ? "Drop your images here" : "Drag & drop images here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              className="mx-auto"
            >
              Choose Images
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple
        onChange={(e) => {
          handleFileSelect(e.target.files);
          // Reset input so same file can be selected again
          if (e.target) {
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: PNG, JPEG, WebP</p>
        <p>• Maximum file size: 10MB per image</p>
        <p>• Maximum {maxImages} images per product</p>
        <p>• Images are uploaded directly to your public folder</p>
        {!required && <p>• This field is optional - leave empty to keep current images</p>}
      </div>

      {/* Image Upload Instructions */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
          <strong>How it works:</strong> Images are automatically saved to your public/uploads folder and are immediately accessible on your website. 
          {required ? ' At least one image is required.' : ' Upload new images to add to the existing ones.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}

