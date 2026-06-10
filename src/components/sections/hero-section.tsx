"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LeadCaptureDialog } from "@/components/lead-capture-dialog";
import { Mail, Flame, Sparkles } from "lucide-react";
import { EmberField } from "@/components/candle/ember-field";

export function HeroSection() {
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        mass: 0.5,
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden h-[90vh] min-h-[650px] flex items-center sm:h-screen sm:min-h-[800px] max-h-[1200px]">
      {/* Optimized LCP image — shown first, video fades in over it */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image
          src="/aesV2.webp"
          alt="Kraftika handcrafted scented candles - premium soy candles India"
          fill
          priority
          fetchPriority="high"
          quality={85}
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover object-top -z-10 opacity-0 transition-opacity duration-1000"
        onLoadedData={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
        aria-label="Kraftika handcrafted scented candles video - premium soy candles India"
      >
        <source src="/KraftikaHero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Warm candlelit overlay: dark left for text, golden glow upper-right */}
      <div className="absolute inset-0 w-full h-full -z-5 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
      <div
        className="absolute inset-0 w-full h-full -z-5"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 75% 30%, hsla(36,90%,55%,0.18), transparent 65%), linear-gradient(to top, hsla(20,40%,5%,0.55), transparent 35%)",
        }}
      />

      {/* Rising embers across the hero */}
      <EmberField count={16} className="-z-[1]" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10 relative">
        <motion.div
          className="grid gap-12 lg:gap-16 md:grid-cols-2 md:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text content */}
          <div className="space-y-8 md:space-y-10 text-center sm:text-left">
            <motion.div className="flex items-center justify-center sm:justify-start gap-3 mb-2" variants={itemVariants}>
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: 1 }}
                style={{ willChange: "transform" }}
              >
                <Flame className="h-7 w-7 text-amber-400 fill-amber-400/80 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              </motion.div>
              <span className="text-amber-200/95 font-semibold text-base md:text-lg tracking-wide">
                Hand-poured in small batches · Natural soy wax
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight font-heading"
              variants={itemVariants}
              style={{ textShadow: "1px 1px 10px rgba(0,0,0,0.7)", lineHeight: "1.1" }}
            >
              Premium Home Made{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  display: "inline-block",
                  padding: "0.05em 0",
                  backgroundImage:
                    "linear-gradient(100deg, hsl(48 100% 78%), hsl(36 100% 62%) 40%, hsl(20 95% 58%) 75%, hsl(44 100% 72%))",
                  backgroundSize: "200% auto",
                  animation: "warm-shimmer 6s linear infinite",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 18px rgba(251,146,60,0.45))",
                }}
              >
                Scented Candles
              </span>{" "}
              by Kraftika
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg text-white/90 md:text-xl leading-relaxed font-sans font-light mx-auto sm:mx-0"
              variants={itemVariants}
              style={{ textShadow: "1px 1px 8px rgba(0,0,0,0.6)", lineHeight: "1.6" }}
            >
              Discover Kraftika's premium home made scented candles — handcrafted with love in
              India. Natural soy wax, hand-poured, perfect for creating cozy moments and warm
              hearts.{" "}
              <span className="font-semibold text-amber-100">
                Order online now — delivered across India!
              </span>
            </motion.p>

            <motion.div
              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center sm:justify-start items-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                className="w-full sm:w-auto"
                style={{ willChange: "transform" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto px-10 py-6 text-lg font-medium text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 hover:shadow-[0_0_32px_-4px_rgba(251,146,60,0.7)]"
                >
                  <Link href="/products">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Order Online Now
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                className="w-full sm:w-auto"
                style={{ willChange: "transform" }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-10 py-6 text-lg font-medium border-2 border-amber-100/80 bg-transparent text-white hover:bg-amber-100/10 hover:text-white hover:border-amber-200 backdrop-blur-sm shadow-lg transition-all duration-300"
                >
                  <Link href="/about">Explore Kraftika</Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                className="w-full sm:w-auto"
                style={{ willChange: "transform" }}
              >
                <Button
                  onClick={() => setIsLeadDialogOpen(true)}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-10 py-6 text-lg font-medium border-2 border-amber-100/80 bg-transparent text-white hover:bg-amber-100/10 hover:text-white hover:border-amber-200 backdrop-blur-sm shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  <span>Get Updates & Offers</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right column intentionally empty — lets the hero video breathe */}
          <div className="hidden md:block" />
        </motion.div>
      </div>

      {/* Scroll indicator: tiny flame inside */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        <div className="w-8 h-12 border-2 border-amber-100/60 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3.5 mt-2 rounded-full bg-gradient-to-t from-orange-500 to-amber-300"
            animate={{ opacity: [0.3, 1, 0.3], scaleY: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ willChange: "opacity, transform", boxShadow: "0 0 10px 2px rgba(251,191,36,0.6)" }}
          />
        </div>
      </motion.div>

      <LeadCaptureDialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen} />
    </section>
  );
}
