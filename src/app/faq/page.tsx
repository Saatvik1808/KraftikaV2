
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
      "Our candles are lovingly hand-poured using sustainable, natural wax blends, primarily soy and coconut wax. We use premium, phthalate-free fragrance oils and natural essential oils to create our delightful scents. Our wicks are typically cotton or wood, ensuring a clean and beautiful burn. All our ingredients are carefully selected to ensure they're safe for your home and family, and we never use paraffin wax or synthetic additives that could be harmful.",
  },
  {
    question: "Why choose handcrafted candles over mass-produced ones?",
    answer:
      "Handcrafted candles, like ours, are made in small batches with meticulous attention to detail. This allows for greater quality control, unique scent combinations, and the use of higher-quality, often more sustainable materials compared to mass-produced alternatives. Handcrafted candles burn more evenly, last longer, and have better scent throw. Plus, you're supporting artisanal craftsmanship and small businesses! Each candle is individually inspected and cared for throughout the production process.",
  },
  {
    question: "How do I choose the right scent for me?",
    answer:
      "Choosing a scent is personal! Consider the mood you want to create (relaxing, energizing, cozy) or the type of fragrance you typically enjoy (floral, fruity, fresh, sweet, woody). Our product descriptions detail the scent notes (top, middle, base) to help guide you. You can also try our 'Find Your Scent' quiz for personalized recommendations! We recommend starting with a smaller candle if you're unsure, or choosing scents based on the room where you'll use them. Bedrooms benefit from calming scents like lavender, while living rooms work well with warmer, more inviting fragrances.",
  },
  {
    question: "What is the expected burn time for Kraftika candles?",
    answer:
      "Burn times vary depending on the size of the candle. Our standard sizes typically offer between 40 to 55 hours of burn time. Please check the product details page for specific information. To maximize burn time, always trim the wick to 1/4 inch before each lighting and avoid burning for more than 4 hours at a time. The first burn is crucial—allow the candle to create a full melt pool across the entire surface to prevent tunneling and ensure even burning throughout the candle's life.",
  },
  {
    question: "How do I purchase Kraftika candles?",
    answer:
      "You can easily purchase our candles directly from this website! Browse our 'Products' page, select your desired candles, add them to your cart, and proceed to checkout. We accept various secure payment methods including credit cards, debit cards, and online payment gateways. All transactions are secure and encrypted for your protection. After placing your order, you'll receive a confirmation email with your order details.",
  },
  {
    question: "What is the estimated shipping time?",
    answer:
      "We typically process orders within 1-3 business days. Shipping times vary depending on your location and the shipping method selected at checkout. Standard shipping within India usually takes 3-7 business days, while express shipping takes 1-3 business days. You'll receive tracking information once your order ships, allowing you to monitor your package's journey. During peak seasons like holidays, processing times may be slightly longer.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes, we want you to be happy with your purchase! Please refer to our 'Shipping & Returns' policy (link usually found in the footer) for detailed information on eligibility, timelines, and how to initiate a return or exchange. We accept returns of unused, unopened candles in their original packaging within 14 days of delivery. For damaged or incorrect items, please contact us immediately and we'll arrange for a replacement or refund at no cost to you.",
  },
  {
    question: "Are your candles eco-friendly?",
    answer:
      "We prioritize sustainability by using natural, renewable wax sources like soy and coconut wax. We also strive to use recyclable or reusable packaging materials whenever possible. Our commitment is to create beautiful products that are kind to both you and the planet. Our soy wax is sourced from renewable soybean crops, our packaging is minimal and recyclable, and we continuously work to reduce our environmental footprint. When you choose Kraftika, you're making an eco-conscious choice.",
  },
  {
    question: "How should I care for my candles to make them last longer?",
    answer:
      "Proper candle care extends the life and performance of your candles significantly. Always trim the wick to 1/4 inch before each burn. Let the candle create a full melt pool on the first burn (this prevents tunneling). Never burn a candle for more than 4 hours at a time, and let it cool completely before relighting. Store candles in a cool, dry place away from direct sunlight to preserve their fragrance. Keep the wax pool free of debris, and extinguish the candle when about 1/2 inch of wax remains at the bottom.",
  },
  {
    question: "What makes soy candles better than paraffin candles?",
    answer:
      "Soy candles offer numerous advantages over paraffin candles. They burn cleaner with no soot production, making them better for indoor air quality. Soy wax is made from renewable soybeans, making it more sustainable than petroleum-based paraffin. Soy candles typically burn 30-50% longer than paraffin candles of the same size, providing better value. They also have better scent throw, meaning the fragrance disperses more effectively throughout the room. Most importantly, soy candles don't release harmful chemicals like toluene and benzene that paraffin candles can emit.",
  },
  {
    question: "Can I use Kraftika candles for aromatherapy?",
    answer:
      "Yes! Many of our candles incorporate essential oils and high-quality fragrance oils that offer aromatherapy benefits. Different scents provide different effects: lavender promotes relaxation and sleep, citrus scents boost energy and mood, eucalyptus helps clear the mind, and vanilla creates a calming atmosphere. We design our fragrances not just to smell good, but to enhance your well-being. For the best aromatherapy experience, burn candles in a well-ventilated room and allow the fragrance to fill the space before you begin your relaxation or meditation practice.",
  },
  {
    question: "Do you offer gift wrapping or gift sets?",
    answer:
      "Yes! We offer various gift options including gift sets that combine multiple candles, gift wrapping services, and gift messages. Our gift sets are perfect for special occasions and make thoughtful presents. You can add gift wrapping during checkout, and we'll include a personalized message with your gift. We also offer seasonal gift collections and themed sets that are specially curated for holidays and special occasions. Gift wrapping is available for an additional fee and can be selected during checkout.",
  },
  {
    question: "Are Kraftika candles safe for pets?",
    answer:
      "Our candles are made with natural ingredients and are generally safe for use around pets, but we recommend taking precautions. Ensure adequate ventilation when burning candles, and never leave a burning candle unattended around pets. Some pets may be sensitive to strong fragrances, so monitor your pet's behavior when first using a new candle. Keep candles out of reach of pets to prevent accidents, and extinguish candles when leaving the room. If you have birds, be extra cautious as they can be sensitive to fumes. Always consult your veterinarian if you have concerns about specific scents.",
  },
  {
    question: "Can I reuse the candle containers?",
    answer:
      "Absolutely! Our candle containers are designed to be reused. Once your candle has burned completely, clean out any remaining wax (you can use hot water or freeze the container to remove stubborn wax), remove any labels, and repurpose the container. Our glass jars make beautiful storage containers, planters, or even new candle containers if you're interested in making your own candles. We encourage creative reuse as part of our commitment to sustainability. Some customers even send us photos of their creative repurposing projects!",
  },
  {
    question: "Do you offer wholesale or bulk pricing?",
    answer:
      "Yes, we do offer wholesale pricing for businesses, events, and bulk orders. If you're interested in purchasing candles in larger quantities, please contact us directly through our contact page or email us at studiokraftika@gmail.com. We'll work with you to create a custom order that meets your needs and budget. Wholesale pricing is available for orders above a certain quantity threshold, and we can also offer custom scents or packaging for larger orders. We're happy to discuss your specific requirements.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept a variety of secure payment methods including major credit cards (Visa, Mastercard, American Express), debit cards, and popular online payment gateways available in India. All payment processing is handled securely through encrypted connections to ensure your financial information is protected. We also offer cash on delivery (COD) options in select areas. Payment information is never stored on our servers, and all transactions comply with PCI DSS standards for payment security.",
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
