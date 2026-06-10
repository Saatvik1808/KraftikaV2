"use client";

import { CheckCircle2, Package, Truck, Home, XCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { Order } from "@/types/order";

const fmt = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

/**
 * Vertical fulfillment timeline: Placed → Confirmed → Shipped → Delivered,
 * with real timestamps and the tracking card when shipped.
 * Cancelled orders show a short cancelled timeline instead.
 */
export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "CANCELLED") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 p-4 flex items-start gap-3">
        <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-red-700">Order cancelled</p>
          {order.cancelledAt && (
            <p className="text-sm text-red-600/80">{fmt(order.cancelledAt)}</p>
          )}
          {order.paidAt && (
            <p className="text-sm text-red-600/80 mt-1">
              Paid orders are refunded to the original payment method within 5–7 business days.
            </p>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    {
      key: "placed",
      label: "Order placed",
      icon: Package,
      time: fmt(order.createdAt),
      done: true,
    },
    {
      key: "confirmed",
      label: order.paidAt ? "Payment confirmed" : "Confirmed",
      icon: CheckCircle2,
      time: fmt(order.paidAt) ?? null,
      done: ["CONFIRMED", "SHIPPED", "DELIVERED"].includes(order.status),
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
      time: fmt(order.shippedAt),
      done: ["SHIPPED", "DELIVERED"].includes(order.status),
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: Home,
      time: fmt(order.deliveredAt),
      done: order.status === "DELIVERED",
    },
  ];

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        return (
          <motion.div
            key={step.key}
            className="flex gap-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                  step.done
                    ? "border-primary bg-primary text-primary-foreground shadow-candle-glow"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[28px] ${
                    steps[i + 1].done ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <p className={`font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              {step.time && <p className="text-sm text-muted-foreground">{step.time}</p>}

              {/* Tracking card under the Shipped step */}
              {step.key === "shipped" && order.trackingNumber && (
                <div className="mt-2 rounded-lg bg-secondary/30 border border-secondary p-3 text-sm space-y-1">
                  {order.courierName && (
                    <p>
                      <span className="text-muted-foreground">Courier:</span>{" "}
                      <span className="font-medium">{order.courierName}</span>
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">Tracking #:</span>{" "}
                    <span className="font-mono font-medium">{order.trackingNumber}</span>
                  </p>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-foreground bg-primary hover:bg-primary/90 rounded-md px-3 py-1.5 mt-1 font-medium transition-colors"
                    >
                      Track package <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
