"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Send, Sparkles } from "lucide-react"; // Added Sparkles

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

    try {
      const result = await sendContactEmail(values);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
           className: "bg-primary/10 border-primary/30 text-primary-foreground", // Custom toast style
        });
        setIsSuccess(true);
        form.reset();
         setTimeout(() => setIsSuccess(false), 4000);
      } else {
         throw new Error(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
       setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Animation Variants
  const formVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, 0.01, -0.05, 0.95] } }, // Smoother ease
      exit: { opacity: 0, y: -50, transition: { duration: 0.4, ease: [0.4, -0.01, 0.05, 0.95] } }
  }

  const successVariants = {
      hidden: { opacity: 0, scale: 0.7 },
      visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } }, // Bouncier spring
      exit: { opacity: 0, scale: 0.7, transition: { duration: 0.3 } }
  }

   const submitButtonVariants = {
     rest: { scale: 1 },
     hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
     tap: { scale: 0.95 }
   }

   const glowVariants = { // For success message glow
        animate: {
            boxShadow: [
                "0 0 0 0 hsla(var(--primary-hsl), 0.4)",
                "0 0 0 15px hsla(var(--primary-hsl), 0)",
            ],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
            }
        }
   }


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
                                    <FormMessage />
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
