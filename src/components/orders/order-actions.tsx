"use client";

import * as React from "react";
import { FileText, Undo2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { openInvoice, requestReturn, getReturns, type ReturnRequest } from "@/services/commerce-api";
import type { Order } from "@/types/order";

const RETURN_WINDOW_DAYS = 7;

/** Invoice download + return-request actions under the order timeline. */
export function OrderActions({ order }: { order: Order }) {
  const { toast } = useToast();
  const [returnOpen, setReturnOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [existingReturn, setExistingReturn] = React.useState<ReturnRequest | null>(null);

  React.useEffect(() => {
    if (order.status === "DELIVERED") {
      getReturns()
        .then((rs) => setExistingReturn(rs.find((r) => r.orderId === order.id) ?? null))
        .catch(() => {});
    }
  }, [order.id, order.status]);

  const withinWindow = (() => {
    if (order.status !== "DELIVERED") return false;
    const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt);
    return Date.now() - deliveredAt.getTime() <= RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  })();

  const submitReturn = async () => {
    if (!reason.trim()) {
      toast({ title: "Reason required", description: "Tell us why you'd like to return this order.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const r = await requestReturn(order.id, reason.trim());
      setExistingReturn(r);
      setReturnOpen(false);
      toast({ title: "Return requested", description: "We'll review it and get back to you by email." });
    } catch (e: any) {
      toast({ title: "Could not request return", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => openInvoice(order.id)}>
        <FileText className="mr-2 h-4 w-4" /> Invoice
      </Button>

      {order.status === "DELIVERED" && !existingReturn && withinWindow && (
        <Button variant="outline" size="sm" onClick={() => setReturnOpen(true)}>
          <Undo2 className="mr-2 h-4 w-4" /> Request return
        </Button>
      )}

      {existingReturn && (
        <span className="text-sm text-muted-foreground">
          Return request:{" "}
          <span className="font-medium">
            {existingReturn.status.charAt(0) + existingReturn.status.slice(1).toLowerCase()}
          </span>
          {existingReturn.status === "REFUNDED" && existingReturn.refundAmount != null && (
            <> · ₹{existingReturn.refundAmount.toFixed(2)} refunded</>
          )}
        </span>
      )}

      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request a return</DialogTitle>
            <DialogDescription>
              Returns are accepted within {RETURN_WINDOW_DAYS} days of delivery. Refunds go to your
              original payment method after we receive the items.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Reason *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Damaged in transit, wrong item, not as expected..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitReturn} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
