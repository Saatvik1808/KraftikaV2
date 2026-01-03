"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/ui/loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BulkUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onUpdate: (updates: BulkUpdateFields) => Promise<void>;
}

export interface BulkUpdateFields {
  price?: number;
  scentCategory?: string;
  isActive?: boolean;
  stockQuantity?: number;
  popularity?: number;
}

export function BulkUpdateDialog({
  open,
  onOpenChange,
  selectedCount,
  onUpdate,
}: BulkUpdateDialogProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [updates, setUpdates] = React.useState<BulkUpdateFields>({
    price: undefined,
    scentCategory: undefined,
    isActive: undefined,
    stockQuantity: undefined,
    popularity: undefined,
  });

  const categories = ["Citrus", "Floral", "Sweet", "Fresh", "Fruity", "Woody"];

  const handleFieldChange = (field: keyof BulkUpdateFields, value: any) => {
    setUpdates((prev) => ({
      ...prev,
      [field]: value === "" || value === undefined ? undefined : value,
    }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Check if at least one field is being updated
    const hasUpdates = Object.values(updates).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasUpdates) {
      setError("Please select at least one field to update.");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await onUpdate(updates);
      // Reset form
      setUpdates({
        price: undefined,
        scentCategory: undefined,
        isActive: undefined,
        stockQuantity: undefined,
        popularity: undefined,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update products. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      setUpdates({
        price: undefined,
        scentCategory: undefined,
        isActive: undefined,
        stockQuantity: undefined,
        popularity: undefined,
      });
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Update Products</DialogTitle>
          <DialogDescription>
            Update {selectedCount} selected product{selectedCount > 1 ? "s" : ""}. Leave fields empty to keep current values.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="bulk-price">Price (₹)</Label>
            <Input
              id="bulk-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Leave empty to keep current"
              value={updates.price || ""}
              onChange={(e) =>
                handleFieldChange("price", e.target.value ? parseFloat(e.target.value) : undefined)
              }
              disabled={isUpdating}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="bulk-category">Scent Category</Label>
            <Select
              value={updates.scentCategory || "__keep_current__"}
              onValueChange={(value) => handleFieldChange("scentCategory", value === "__keep_current__" ? undefined : value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="bulk-category">
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__keep_current__">Keep current</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="bulk-stock">Stock Quantity</Label>
            <Input
              id="bulk-stock"
              type="number"
              min="0"
              placeholder="Leave empty to keep current"
              value={updates.stockQuantity || ""}
              onChange={(e) =>
                handleFieldChange("stockQuantity", e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={isUpdating}
            />
          </div>

          {/* Popularity */}
          <div className="space-y-2">
            <Label htmlFor="bulk-popularity">Popularity (0-100)</Label>
            <Input
              id="bulk-popularity"
              type="number"
              min="0"
              max="100"
              placeholder="Leave empty to keep current"
              value={updates.popularity || ""}
              onChange={(e) =>
                handleFieldChange("popularity", e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={isUpdating}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="bulk-active">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Toggle to update product visibility
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={updates.isActive === undefined ? "__keep_current__" : updates.isActive ? "true" : "false"}
                onValueChange={(value) => {
                  if (value === "__keep_current__") {
                    handleFieldChange("isActive", undefined);
                  } else {
                    handleFieldChange("isActive", value === "true");
                  }
                }}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Keep current" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__keep_current__">Keep current</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              `Update ${selectedCount} Product${selectedCount > 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

