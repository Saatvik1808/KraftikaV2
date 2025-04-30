
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Send, Sparkles } from "lucide-react";

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
import { sendContactEmail } from "./actions";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, { message: "Message cannot exceed 500 characters."}),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  // Store server-side errors separately
  const [serverError, setServerError] = React.useState<string | null>(null);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

   async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    setIsSuccess(false);
    setServerError(null); // Clear previous server errors
    form.clearErrors(); // Clear previous react-hook-form errors

    try {
       console.log("Form submitted with values:", values);
       // Directly pass the validated 'values' to the action
      const result = await sendContactEmail(values);
       console.log("Server action result:", result);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
           className: "bg-primary/10 border-primary/30 text-primary-foreground",
        });
        setIsSuccess(true);
        form.reset();
         // Keep success message visible for a while
         setTimeout(() => setIsSuccess(false), 4000);
      } else {
          // Handle errors returned from the server action
          if (result.fieldErrors) {
            // Set field-specific errors
            (Object.keys(result.fieldErrors) as Array<keyof FormData>).forEach((field) => {
                const messages = result.fieldErrors?.[field];
                if (messages && messages.length > 0) {
                    form.setError(field, { type: "server", message: messages.join(", ") });
                }
            });
          }
          // Set a general server error message if present
          setServerError(result.error || "An unknown error occurred.");
          toast({
              title: "Submission Failed",
              description: result.error || "Please check the form for errors.",
              variant: "destructive",
          });
          setIsSuccess(false); // Ensure success state is false
      }
    } catch (error) {
      // Catch unexpected errors during the action call itself
      console.error("Contact form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      setServerError(errorMessage);
      toast({
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
        variant: "destructive",
      });
       setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Animation Variants (keep existing)
  const formVariants = { /* ... */ };
  const successVariants = { /* ... */ };
  const submitButtonVariants = { /* ... */ };
  const glowVariants = { /* ... */ };


  return (
    // Apply light pink gradient background
    <div className="relative container mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24 overflow-hidden bg-gradient-pink min-h-[calc(100vh-var(--navbar-height,4rem))] flex items-center justify-center"> {/* Adjust height calc if needed */}
       {/* Decorative background elements */}
        <Sparkles className="absolute top-10 left-10 h-16 w-16 text-primary/20 opacity-50 -z-10 animate-pulse" />
        <Sparkles className="absolute bottom-10 right-10 h-20 w-20 text-secondary/20 opacity-50 -z-10 animate-pulse delay-500" />


        <div className="w-full"> {/* Wrapper to center content */}
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
            >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-3">
                Let's Connect!
            </h1>
            <p className="text-lg text-muted-foreground/90">
                We'd love to hear from you. Send us a message below.
            </p>
            </motion.div>

            <div className="relative min-h-[480px]"> {/* Adjusted height */}
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                    <motion.div
                        key="form"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        // Apply light pink glass-style form container
                        className="p-6 md:p-10 rounded-lg shadow-xl glassmorphism border border-[hsl(var(--muted-hsl)/0.3)] bg-[hsla(var(--muted-hsl),0.1)]" // Use muted (pink) HSL with transparency
                    >
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Display general server error message */}
                            {serverError && (
                                <div className="p-3 mb-4 rounded-md border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                                    {serverError}
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Your Name" {...field} className="bg-background/60 focus:bg-background/80 border-border/40 focus:border-primary/50 focus:ring-primary/50" />
                                    </FormControl>
                                    <FormMessage /> {/* Displays validation errors */}
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground/80">Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="your.email@example.com" {...field} className="bg-background/60 focus:bg-background/80 border-border/40 focus:border-primary/50 focus:ring-primary/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            </div>
                            <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-foreground/80">Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Share your thoughts or questions..."
                                    rows={5}
                                    {...field}
                                    className="bg-background/60 focus:bg-background/80 border-border/40 focus:border-primary/50 focus:ring-primary/50"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             {/* Animated Submit Button */}
                            <motion.div
                                variants={submitButtonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="flex justify-end pt-2"
                            >
                            <Button type="submit" disabled={isSubmitting} size="lg" className="btn-primary min-w-[150px]">
                                {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                <Send className="mr-2 h-4 w-4" />
                                )}
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                            </motion.div>
                        </form>
                        </Form>
                    </motion.div>
                    ) : (
                        // Success Message Pop-up Style
                        <motion.div
                            key="success"
                            variants={successVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 rounded-lg glassmorphism border border-[hsl(var(--primary-hsl)/0.4)] bg-[hsla(var(--primary-hsl),0.15)]" // Use primary (green) HSL for success
                        >
                             <motion.div // Glowing effect container
                                variants={glowVariants}
                                animate="animate"
                                className="p-3 rounded-full mb-5" // Add padding for glow visibility
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <CheckCircle className="h-16 w-16 text-primary" />
                                </motion.div>
                            </motion.div>

                            <h2 className="text-2xl font-semibold text-foreground mb-2">Message Sent Successfully!</h2>
                            <p className="text-muted-foreground/90">Thank you for your message. We'll be in touch shortly.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
         </div>


    </div>
  );
}
