
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What are Kraftika scented candles made of?",
    answer:
      "Our candles are lovingly hand-poured using sustainable, natural wax blends, primarily soy and coconut wax. We use premium, phthalate-free fragrance oils and natural essential oils to create our delightful scents. Our wicks are typically cotton or wood, ensuring a clean and beautiful burn.",
  },
  {
    question: "Why choose handcrafted candles over mass-produced ones?",
    answer:
      "Handcrafted candles, like ours, are made in small batches with meticulous attention to detail. This allows for greater quality control, unique scent combinations, and the use of higher-quality, often more sustainable materials compared to mass-produced alternatives. Plus, you're supporting artisanal craftsmanship!",
  },
  {
    question: "How do I choose the right scent for me?",
    answer:
      "Choosing a scent is personal! Consider the mood you want to create (relaxing, energizing, cozy) or the type of fragrance you typically enjoy (floral, fruity, fresh, sweet, woody). Our product descriptions detail the scent notes (top, middle, base) to help guide you. You can also try our 'Find Your Scent' quiz for personalized recommendations!",
  },
  {
    question: "What is the expected burn time for Kraftika candles?",
    answer:
      "Burn times vary depending on the size of the candle. Our standard sizes typically offer between 40 to 55 hours of burn time. Please check the product details page for specific information. To maximize burn time, always trim the wick to 1/4 inch before each lighting and avoid burning for more than 4 hours at a time.",
  },
  {
    question: "How do I purchase Kraftika candles?",
    answer:
      "You can easily purchase our candles directly from this website! Browse our 'Products' page, select your desired candles, add them to your cart, and proceed to checkout. We accept various secure payment methods.",
  },
  {
    question: "What is the estimated shipping time?",
    answer:
      "We typically process orders within 1-3 business days. Shipping times vary depending on your location and the shipping method selected at checkout. Standard shipping within the country usually takes 3-7 business days. You'll receive tracking information once your order ships.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes, we want you to be happy with your purchase! Please refer to our 'Shipping & Returns' policy (link usually found in the footer) for detailed information on eligibility, timelines, and how to initiate a return or exchange.",
  },
    {
    question: "Are your candles eco-friendly?",
    answer:
      "We prioritize sustainability by using natural, renewable wax sources like soy and coconut wax. We also strive to use recyclable or reusable packaging materials whenever possible. Our commitment is to create beautiful products that are kind to both you and the planet.",
  },
];

export default function FaqPage() {
  return (
    <div className="w-full py-16 md:py-24 bg-gradient-yellow overflow-hidden"> {/* Yellow Gradient */}
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
           <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4 opacity-80" strokeWidth={1.5}/>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground/90">
            Find answers to common questions about our candles and services.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glassmorphism p-6 md:p-10 border border-[hsl(var(--border)/0.2)]" // Glassmorphism container for accordion
        >
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary/20 last:border-b-0">
                <AccordionTrigger className="py-4 text-left text-base md:text-lg font-medium text-foreground/90 hover:text-accent-foreground hover:no-underline [&[data-state=open]]:text-accent-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-4 text-sm md:text-base text-muted-foreground/80 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
