
"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldQuestion } from "lucide-react"; // Using Truck and RotateCcw for relevance

export default function ShippingReturnsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5" // Light green-ish gradient
    >
      <div className="container mx-auto max-w-4xl px-4 md:px-6 space-y-10">
        <div className="text-center">
          <Truck className="mx-auto h-12 w-12 text-primary mb-4 opacity-80" strokeWidth={1.5}/>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-3">
            Shipping & Returns
          </h1>
          <p className="text-lg text-muted-foreground/90">
            Information about how we ship your orders and handle returns.
          </p>
        </div>

        <div className="space-y-8 glassmorphism p-6 md:p-10 border border-[hsl(var(--border)/0.2)]">
          <section>
            <h2 className="text-2xl font-semibold font-heading text-foreground/90 mb-3">Shipping Policy</h2>
            <div className="space-y-3 text-muted-foreground/80 leading-relaxed font-sans">
              <p>
                We are committed to delivering your Kraftika Scents candles to you in a timely and safe manner.
                All orders are processed within 1-3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
              </p>
              <h3 className="text-lg font-medium text-foreground/85 mt-4">Domestic Shipping Rates and Estimates</h3>
              <p>
                Shipping charges for your order will be calculated and displayed at checkout. We offer standard and expedited shipping options.
                Standard shipping typically takes 3-7 business days. Expedited shipping typically takes 1-3 business days.
                Please note that these are estimates and actual delivery times may vary.
              </p>
              <h3 className="text-lg font-medium text-foreground/85 mt-4">International Shipping</h3>
              <p>
                Currently, we primarily ship to addresses within India. For international shipping inquiries, please contact us at <a href="mailto:saatvik.shrivastava08@gmail.com" className="text-primary hover:underline">saatvik.shrivastava08@gmail.com</a> before placing your order.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-3">
                <RotateCcw className="mr-3 h-8 w-8 text-secondary" />
                <h2 className="text-2xl font-semibold font-heading text-foreground/90">Returns & Exchanges Policy</h2>
            </div>
            <div className="space-y-3 text-muted-foreground/80 leading-relaxed font-sans">
              <p>
                We want you to love your Kraftika Scents experience. If you're not entirely satisfied with your purchase, we're here to help.
              </p>
              <h3 className="text-lg font-medium text-foreground/85 mt-4">Eligibility for Returns</h3>
              <p>
                You can return unused and unopened candles in their original packaging within 14 days of receiving your order for a full refund or exchange.
                Unfortunately, we cannot accept returns on used candles, sale items, or gift cards.
              </p>
              <h3 className="text-lg font-medium text-foreground/85 mt-4">Return Process</h3>
              <p>
                To initiate a return, please email us at <a href="mailto:saatvik.shrivastava08@gmail.com" className="text-primary hover:underline">saatvik.shrivastava08@gmail.com</a> with your order number and reason for return. We will provide you with instructions on how to send back your item(s).
                Customers are responsible for return shipping costs unless the item arrived damaged or incorrect.
              </p>
              <h3 className="text-lg font-medium text-foreground/85 mt-4">Refunds</h3>
              <p>
                Once we receive your returned item and inspect it, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.
              </p>
              <h3 className="text-lg font-medium text-foreground/85 mt-4">Damaged or Incorrect Items</h3>
              <p>
                If you received a damaged or incorrect item, please contact us immediately at <a href="mailto:saatvik.shrivastava08@gmail.com" className="text-primary hover:underline">saatvik.shrivastava08@gmail.com</a> with your order number and a photo of the item. We will arrange for a replacement or refund.
              </p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
