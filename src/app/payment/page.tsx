"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Info, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Candle } from "@/types/candle";
import { getProducts } from "@/services/products";

// Define CartItem types consistent with other parts of the app
interface CartItem extends Candle {
  quantity: number;
}

interface CartStorageItem {
  id: string;
  quantity: number;
}

export default function PaymentPage() {
  const [allProducts, setAllProducts] = React.useState<Candle[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = React.useState(false);
  const { toast } = useToast();

  // Fetch all products from Firestore on component mount
  React.useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({ title: "Error", description: "Could not load product details.", variant: "destructive" });
      }
    };
    fetchAllProducts();
  }, [toast]);

  // Hydrate cart items from localStorage once allProducts are available
  React.useEffect(() => {
    if (allProducts.length > 0) {
      try {
        const cartString = localStorage.getItem('kraftikaCart');
        const storedCartItems: CartStorageItem[] = cartString ? JSON.parse(cartString) : [];
        
        const hydratedCartItems = storedCartItems.map(storedItem => {
          const productDetails = allProducts.find(p => p.id === storedItem.id);
          if (productDetails) {
            return { ...productDetails, quantity: storedItem.quantity };
          }
          return null;
        }).filter(item => item !== null) as CartItem[];
        
        setCartItems(hydratedCartItems);
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
        setCartItems([]);
        toast({ title: "Error", description: "Could not load your cart.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    } else if (!isLoading) {
        setIsLoading(false);
    }
  }, [allProducts, isLoading, toast]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 || cartItems.length === 0 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
    localStorage.removeItem('kraftikaCart'); // Clear the cart after confirmation
    toast({
        title: "Payment Confirmed!",
        description: "Thank you for your order. We'll process it shortly.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        Loading payment details...
      </div>
    );
  }

  if (paymentConfirmed) {
      return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto max-w-2xl px-4 py-16 text-center"
        >
            <Card className="glassmorphism p-8">
                <CardHeader className="items-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <CardTitle className="text-3xl">Thank You!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Your order has been received. We will begin processing it shortly.
                        A confirmation will be sent to you via WhatsApp or Email.
                    </p>
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
      )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl px-4 py-12 md:py-16"
    >
      <div className="mb-8">
        <Button variant="outline" asChild>
            <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* QR Code and Payment instructions */}
        <div className="space-y-6">
          <Card className="glassmorphism p-6 border border-[hsl(var(--border)/0.2)]">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl flex items-center">
                <QrCode className="mr-3 h-7 w-7 text-primary" />
                Scan to Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center space-y-4">
              <div className="relative w-64 h-64 bg-white p-4 rounded-lg shadow-md border">
                <Image
                  src="/qr-code.png" // IMPORTANT: User needs to place their QR code here
                  alt="Payment QR Code"
                  fill
                  sizes="256px"
                  className="object-contain"
                  data-ai-hint="payment qr code"
                />
              </div>
              <div className="text-center text-muted-foreground">
                  <p className="font-semibold text-lg text-primary">Total Amount: ₹{total.toFixed(2)}</p>
                  <p className="text-sm">Scan the QR code with any UPI app to complete your payment.</p>
              </div>
            </CardContent>
          </Card>
          <Alert>
              <Info className="h-4 w-4"/>
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                After completing the payment, please click the "Confirm Payment" button below.
                You will get an order confirmation on WhatsApp.
              </AlertDescription>
          </Alert>
          <Button size="lg" className="w-full btn-primary" onClick={handleConfirmPayment}>
              <CheckCircle className="mr-2 h-5 w-5"/>
              Confirm Payment
          </Button>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <Card className="glassmorphism p-4 border border-[hsl(var(--border)/0.1)]">
            <CardContent className="p-0 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                           <Image src={item.imageUrl} alt={item.name} fill className="object-cover"/>
                        </div>
                        <div>
                           <p className="font-medium text-foreground">{item.name}</p>
                           <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                    </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="glassmorphism p-4 border border-[hsl(var(--border)/0.1)]">
            <CardContent className="p-0 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <Separator className="my-2 bg-border/30" />
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
