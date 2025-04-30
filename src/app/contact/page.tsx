"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Send } from "lucide-react";

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
import { sendContactEmail } from "./actions"; // Import server action

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
          variant: "default", // Use default variant which maps to success style
        });
        setIsSuccess(true);
        form.reset(); // Reset form on success
         // Keep success message visible for a moment
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

  const formVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: "easeIn" } }
  }

  const successVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
      exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  }

  return (
    <div className="relative container mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24 overflow-hidden">
       {/* Subtle background gradient */}
       <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 opacity-50 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-14"
      >
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-3">
          Get In Touch
        </h1>
        <p className="text-lg text-muted-foreground">
          Have a question or just want to say hello? Drop us a message!
        </p>
      </motion.div>

      <div className="relative min-h-[450px]"> {/* Container for switching between form and success */}
           <AnimatePresence mode="wait">
            {!isSuccess ? (
            <motion.div
                key="form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 md:p-10 rounded-lg shadow-xl glassmorphism border border-[hsl(var(--border)/0.3)]"
             >
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} className="bg-background/80 focus:bg-background" />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} className="bg-background/80 focus:bg-background" />
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
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help..."
                              rows={5}
                              {...field}
                               className="bg-background/80 focus:bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <motion.div
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.98 }}
                       className="flex justify-end"
                     >
                      <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[120px]">
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
                <motion.div
                    key="success"
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 rounded-lg glassmorphism border border-[hsl(var(--primary)/0.4)] bg-primary/10"
                >
                    <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
                     >
                        <CheckCircle className="h-16 w-16 text-primary mb-4" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Message Sent Successfully!</h2>
                    <p className="text-muted-foreground">Thank you for your message. We'll be in touch shortly.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>


    </div>
  );
}
