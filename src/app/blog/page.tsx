"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/lib/blog.posts";

// Blog posts data - In a real app, this would come from a CMS or database
const blogPosts = [
  {
    slug: "best-scented-candles-india-complete-guide-2025",
    title: "Best Scented Candles in India: Complete Guide 2025",
    description: "Discover the finest handcrafted scented candles in India. Learn about soy candles, aromatherapy benefits, and how to choose the perfect fragrance for your home.",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Guides",
    image: "/candleImage.jpeg",
  },
  {
    slug: "why-choose-soy-candles-over-paraffin",
    title: "Why Choose Soy Candles Over Paraffin: Health and Environmental Benefits",
    description: "Explore the significant health and environmental advantages of soy candles. Learn why natural soy wax is better for your home and the planet than traditional paraffin candles.",
    date: "2025-01-10",
    readTime: "6 min read",
    category: "Wellness",
    image: "/candleImage.jpeg",
  },
  {
    slug: "candle-care-tips-maximize-burn-time",
    title: "Candle Care Tips: How to Maximize Burn Time and Scent Throw",
    description: "Master the art of candle care with expert tips on wick trimming, proper burning techniques, and storage methods to ensure your candles last longer and smell better.",
    date: "2025-01-05",
    readTime: "5 min read",
    category: "Tips",
    image: "/candleImage.jpeg",
  },
  {
    slug: "aromatherapy-candles-benefits-mental-health",
    title: "Aromatherapy Candles: Benefits for Mental Health and Relaxation",
    description: "Discover how aromatherapy candles can improve your mental health, reduce stress, enhance sleep quality, and create a calming atmosphere in your home.",
    date: "2024-12-28",
    readTime: "7 min read",
    category: "Wellness",
    image: "/candleImage.jpeg",
  },
  {
    slug: "choosing-right-candle-scent-every-room",
    title: "Choosing the Right Candle Scent for Every Room in Your Home",
    description: "Learn how to select the perfect scented candles for each room - from energizing citrus for kitchens to calming lavender for bedrooms. Create the ideal ambiance for every space.",
    date: "2024-12-20",
    readTime: "6 min read",
    category: "Home Decor",
    image: "/candleImage.jpeg",
  },
  {
    slug: "handcrafted-vs-mass-produced-candles",
    title: "Handcrafted vs Mass-Produced Candles: What Makes the Difference?",
    description: "Understand the key differences between handcrafted and mass-produced candles. Discover why artisan candles offer superior quality, unique scents, and better value.",
    date: "2024-12-15",
    readTime: "7 min read",
    category: "Education",
    image: "/candleImage.jpeg",
  },
  {
    slug: "sustainable-candles-eco-friendly-home-decor",
    title: "Sustainable Candles: Building an Eco-Friendly Home Decor Collection",
    description: "Explore how to create an eco-friendly home decor collection with sustainable candles. Learn about natural waxes, recyclable packaging, and supporting ethical brands.",
    date: "2024-12-10",
    readTime: "8 min read",
    category: "Sustainability",
    image: "/candleImage.jpeg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function BlogPage() {
  const blogPosts = getAllBlogPosts();
  
  return (
    <div className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Kraftika Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover tips, guides, and insights about scented candles, aromatherapy, home decor, and sustainable living.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post, index) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
                <CardHeader className="flex-1">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-2 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full group">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Stay updated with our latest articles and candle care tips
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              Shop Our Candles
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

