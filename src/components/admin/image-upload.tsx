"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string;
  currentFirebaseUrl?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  currentImageUrl,
  currentFirebaseUrl,
  label = "Product Image",
  required = false,
  className
}: ImageUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setImagePreview(null);
    }
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onChange(file);
      }
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onChange(file);
    }
  };

  const removeImage = () => {
    onChange(null);
    setImagePreview(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-base font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Current Image Display */}
      {currentImageUrl && !value && (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={currentImageUrl}
                    alt="Current product image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">Current Image</p>
                  <p className="text-xs text-muted-foreground">Path: {currentImageUrl}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {currentFirebaseUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={currentFirebaseUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={currentImageUrl} download>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          value && "border-green-500 bg-green-50 dark:bg-green-950"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!value ? (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {dragActive ? "Drop your image here" : "Drag & drop an image here"}
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
              Choose Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 border rounded-lg overflow-hidden bg-white">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Image Selected
              </p>
              <p className="text-xs text-muted-foreground">
                {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="mx-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: PNG, JPEG, WebP</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Images are uploaded directly to your public folder</p>
        <p>• No external storage costs - completely free!</p>
        {!required && <p>• This field is optional - leave empty to keep current image</p>}
      </div>

      {/* Image Upload Instructions */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
          <strong>How it works:</strong> Images are automatically saved to your public/uploads folder and are immediately accessible on your website. 
          {required ? 'No manual file management needed!' : 'Upload a new image to replace the current one.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}
