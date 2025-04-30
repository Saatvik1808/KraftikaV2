
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Send, Sparkles, Wand } from "lucide-react"; // Added Sparkles

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
import { CandleIcon } from "@/components/icons/candle-icon"; // Import CandleIcon

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

// --- Animation Variants ---
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
};

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const formContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } },
};

const successVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 15, delay: 0.1 } },
    exit: { opacity: 0, scale: 0.8, rotate: 10, transition: { duration: 0.3, ease: "easeIn" } },
};

const submitButtonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 },
};

const glowVariants = {
    animate: {
        boxShadow: [
            "0 0 0px hsla(var(--primary-hsl), 0)",
            "0 0 25px hsla(var(--primary-hsl), 0.5)", // Pulsing green glow for success
            "0 0 0px hsla(var(--primary-hsl), 0)",
        ],
        transition: {
            duration: 1.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
        },
    },
};

const floatingCandleVariants = {
    float: (i: number) => ({
        y: ["0%", "-8%", "0%", "8%", "0%"],
        rotate: [0, i % 2 === 0 ? 2 : -2, 0, i % 2 === 0 ? -2 : 2, 0],
        transition: {
            duration: 8 + i * 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.5,
        },
    }),
};
// --- End Animation Variants ---


export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
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
    setServerError(null);
    form.clearErrors();

    try {
      const result = await sendContactEmail(values);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
           className: "bg-primary/10 border-primary/30 text-primary-foreground", // Keep success style
        });
        setIsSuccess(true);
        form.reset();
         setTimeout(() => setIsSuccess(false), 5000); // Show success longer
      } else {
          if (result.fieldErrors) {
            (Object.keys(result.fieldErrors) as Array<keyof FormData>).forEach((field) => {
                const messages = result.fieldErrors?.[field];
                if (messages && messages.length > 0) {
                    form.setError(field, { type: "server", message: messages.join(", ") });
                }
            });
          }
          setServerError(result.error || "An unknown error occurred.");
          toast({
              title: "Submission Failed",
              description: result.error || "Please check the form for errors.",
              variant: "destructive",
          });
          setIsSuccess(false);
      }
    } catch (error) {
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


  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="relative container mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24 overflow-hidden bg-gradient-pink min-h-[calc(100vh-var(--navbar-height,4rem))] flex items-center justify-center" // Light Pink Gradient Background
    >
        {/* Floating Decorative Elements */}
        <motion.div
            className="absolute top-10 -left-10 opacity-50 -z-10"
            variants={floatingCandleVariants}
            animate="float"
            custom={1}
        >
            <CandleIcon className="h-24 w-24 text-primary/30 filter drop-shadow-lg" />
        </motion.div>
        <motion.div
             className="absolute bottom-10 -right-10 opacity-60 -z-10"
             variants={floatingCandleVariants}
             animate="float"
             custom={2}
        >
            <CandleIcon className="h-32 w-32 text-secondary/30 filter drop-shadow-lg" />
         </motion.div>
        <Sparkles className="absolute top-1/4 right-10 h-12 w-12 text-accent/20 opacity-70 animate-pulse -z-10" />


        <div className="w-full">
            <motion.div
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className="text-center mb-10 md:mb-12"
            >
            <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl mb-3">
                Let's Connect!
            </h1>
            <p className="text-lg text-muted-foreground/90 font-sans font-light">
                We'd love to hear from you. Send us a message below.
            </p>
            </motion.div>

            <div className="relative min-h-[520px]"> {/* Increased height */}
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                    <motion.div
                        key="form"
                        variants={formContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        // Apply vibrant glass-style form container
                        className="p-6 md:p-10 rounded-xl shadow-xl glassmorphism border border-[hsl(var(--muted-hsl)/0.3)] bg-[hsla(var(--muted-hsl),0.15)] backdrop-blur-md" // Enhanced glassmorphism
                    >
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    <FormLabel className="text-foreground/80 font-medium">Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Your Name" {...field} className="bg-background/60 focus:bg-background/80 border-border/40 focus:border-primary/50 focus:ring-primary/50 transition-colors duration-200" />
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
                                    <FormLabel className="text-foreground/80 font-medium">Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="your.email@example.com" {...field} className="bg-background/60 focus:bg-background/80 border-border/40 focus:border-primary/50 focus:ring-primary/50 transition-colors duration-200" />
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
                                <FormLabel className="text-foreground/80 font-medium">Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Share your thoughts or questions..."
                                    rows={5}
                                    {...field}
                                    className="bg-background/60 focus:bg-background/80 border-border/40 focus:border-primary/50 focus:ring-primary/50 transition-colors duration-200"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <motion.div
                                variants={submitButtonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="flex justify-end pt-2"
                            >
                            <Button type="submit" disabled={isSubmitting} size="lg" className="btn-primary min-w-[150px] shadow-lg hover:shadow-primary/50 transition-shadow duration-300"> {/* Added shadow */}
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
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 rounded-xl glassmorphism border border-[hsl(var(--primary-hsl)/0.4)] bg-[hsla(var(--primary-hsl),0.2)] backdrop-blur-lg shadow-xl" // Enhanced glassmorphism for success
                        >
                             <motion.div
                                variants={glowVariants}
                                animate="animate"
                                className="p-3 rounded-full mb-5"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <CheckCircle className="h-16 w-16 text-primary filter drop-shadow-lg" /> {/* Added drop shadow */}
                                </motion.div>
                            </motion.div>

                            <h2 className="text-2xl font-semibold text-foreground mb-2 font-heading">Message Sent Successfully!</h2>
                            <p className="text-muted-foreground/90 font-sans">Thank you for your message. We'll be in touch shortly.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
         </div>
    </motion.div>
  );
}
