"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle, Loader2, Send, Sparkles, Wand } from "lucide-react";

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
import { CandleIcon } from "@/components/icons/candle-icon";

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

// Animation Variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

const formContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      delay: 0.2, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { 
      duration: 0.3, 
      ease: "easeIn" 
    } 
  },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15, 
      delay: 0.1 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    transition: { 
      duration: 0.3, 
      ease: "easeIn" 
    } 
  },
};

const floatingCandleVariants: Variants = {
    float: {
      y: ["0%", "-10%", "0%", "10%", "0%"],
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    }
  };
  

  const glowVariants: Variants = {
    animate: {
      boxShadow: [
        "0 0 0px hsla(var(--primary-hsl), 0)",
        "0 0 20px hsla(var(--primary-hsl), 0.4)",
        "0 0 0px hsla(var(--primary-hsl), 0)",
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

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
          className: "bg-primary/10 border-primary/30 text-primary-foreground",
        });
        setIsSuccess(true);
        form.reset();
        setTimeout(() => setIsSuccess(false), 5000);
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="relative w-full min-h-[calc(100vh-var(--navbar-height))] py-12 md:py-24 bg-gradient-to-br from-background via-[#fef6f6] to-background"
    >
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 opacity-20 -z-10"
        variants={floatingCandleVariants}
        animate="float"
        custom={1}
      >
        <CandleIcon className="h-24 w-24 text-primary/20" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 opacity-20 -z-10"
        variants={floatingCandleVariants}
        animate="float"
        custom={2}
      >
        <CandleIcon className="h-32 w-32 text-secondary/20" />
      </motion.div>
      <Sparkles className="absolute top-1/4 right-1/4 h-12 w-12 text-accent/10 opacity-70 animate-pulse -z-10" />

      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-4">
            Let's Connect
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                variants={formContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 dark:border-gray-800"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {serverError && (
                      <div className="p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300">
                        {serverError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                {...field} 
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your.email@example.com" 
                                {...field} 
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your message..."
                              rows={6}
                              {...field}
                              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full sm:w-auto px-8 py-6 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 border border-gray-100 dark:border-gray-800"
              >
                <motion.div
                  variants={glowVariants}
                  animate="animate"
                  className="p-4 rounded-full mb-6 bg-primary/10"
                >
                  <CheckCircle className="h-16 w-16 text-primary" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Message Sent!
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Send another message
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}