"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/config";

const leadFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name cannot exceed 50 characters.",
  }).optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
}).refine((data) => {
  const hasEmail = data.email && data.email.trim() !== "";
  const hasPhone = data.phone && data.phone.trim() !== "";
  return hasEmail || hasPhone;
}, {
  message: "Either email or phone number is required.",
  path: ["email"],
}).refine((data) => {
  // If phone is provided, it should be at least 10 characters
  if (data.phone && data.phone.trim() !== "") {
    return data.phone.trim().length >= 10;
  }
  return true;
}, {
  message: "Phone number must be at least 10 digits.",
  path: ["phone"],
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadCaptureDialog({ open, onOpenChange }: LeadCaptureDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  React.useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 300);
    }
  }, [open, form]);

  async function onSubmit(values: LeadFormData) {
    setIsSubmitting(true);
    setIsSuccess(false);
    form.clearErrors();

    try {
      // Prepare the lead data for backend API (array format to match backend expectation)
      const requestBody = [{
        name: values.name || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
      }];

      // Build the API URL using the base URL from config
      const leadUrl = `${API_BASE_URL || 'http://kraftika-env.eba-vyn62iv2.ap-south-1.elasticbeanstalk.com/api'}/leads`;
      
      console.log("Submitting lead to:", leadUrl);
      console.log("Lead data:", requestBody);

      // Call backend API to create lead and send email notification
      const response = await fetch(leadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok
      if (!response.ok) {
        console.error("Lead submission failed - HTTP status:", response.status, response.statusText);
        
        // Try to parse error response
        let errorMessage = "Failed to submit lead. Please try again later.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        
        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const responseData = await response.json();

      if (responseData.success) {
        console.log("Lead submission successful");
        toast({
          title: "Thank You!",
          description: responseData.message || "We've received your information. We'll contact you soon!",
          className: "bg-green-50 dark:bg-green-900/90 border-green-200 dark:border-green-700 text-green-900 dark:text-green-50",
        });
        setIsSuccess(true);
        form.reset();
        // Close dialog after 2 seconds
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        toast({
          title: "Submission Failed",
          description: responseData.error || "Please check the form for errors.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lead form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to server. Please check your connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#caa494] via-[#b8d4a8] to-[#b1e4c7] bg-clip-text text-transparent">
            Get in Touch
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Interested in our handcrafted scented candles? Leave your contact information and we'll reach out to you soon!
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 space-y-4"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
            <p className="text-lg font-semibold text-center text-green-600">
              Thank you for your interest!
            </p>
            <p className="text-sm text-muted-foreground text-center">
              We'll contact you soon.
            </p>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="6204605797"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Provide either email or phone number (or both)
                    </p>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#caa494] to-[#b8d4a8] hover:from-[#b8a08e] hover:to-[#a8c498]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

