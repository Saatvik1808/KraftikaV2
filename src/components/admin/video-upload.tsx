"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Video, Download, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  currentVideoUrl?: string;
  label?: string;
  required?: boolean;
  className?: string;
  onRemove?: () => void;
}

export function VideoUpload({
  value,
  onChange,
  currentVideoUrl,
  label = "Product Video",
  required = false,
  className,
  onRemove
}: VideoUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setVideoPreview(null);
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
      if (file.type.startsWith('video/')) {
        onChange(file);
      }
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      onChange(file);
    }
  };

  const removeVideo = () => {
    onChange(null);
    setVideoPreview(null);
    if (onRemove) {
      onRemove();
    }
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

      {/* Current Video Display */}
      {currentVideoUrl && !value && (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Current Video</p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {currentVideoUrl}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={currentVideoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
                {onRemove && (
                  <Button variant="outline" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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
                {dragActive ? "Drop your video here" : "Drag & drop a video here"}
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
              Choose Video
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <Video className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Video Selected
              </p>
              <p className="text-xs text-muted-foreground">
                {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeVideo}
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
        accept="video/mp4, video/webm, video/ogg, video/quicktime"
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
        <p>• Supported formats: MP4, WebM, OGG, QuickTime</p>
        <p>• Maximum file size: 100MB (recommended: under 50MB)</p>
        <p>• Videos are uploaded to Cloudinary for optimized delivery</p>
        {!required && <p>• This field is optional - leave empty to keep current video</p>}
      </div>

      {/* Video Upload Instructions */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
          <strong>Video Tips:</strong> Videos will automatically play on the product page. 
          Keep videos short (10-30 seconds) for best performance. {required ? 'Video is required for this product.' : 'Upload a new video to replace the current one.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}

