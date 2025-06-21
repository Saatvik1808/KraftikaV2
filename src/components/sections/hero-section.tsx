
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        mass: 0.5 
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden h-[90vh] min-h-[650px] flex items-center sm:h-screen sm:min-h-[800px] max-h-[1200px]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-top -z-10"
        poster="/aesV2.jpeg"
      >
        <source src="/KraftikaHero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      
      {/* Enhanced overlay for better contrast */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black/70 via-black/20 to-transparent -z-5"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10 relative">
        <motion.div
          className="grid gap-12 lg:gap-16 md:grid-cols-2 md:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content and CTA */}
          <div className="space-y-8 md:space-y-10 text-center sm:text-left">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight font-heading"
              variants={itemVariants}
              style={{ 
                textShadow: '1px 1px 8px rgba(0,0,0,0.7)',
                lineHeight: '1.1'
              }} 
            >
              Where Scents{' '}
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#caa494] via-[#b8d4a8] to-[#b1e4c7]"
                style={{
                  display: 'inline-block',
                  padding: '0.05em 0',
                  backgroundSize: '200% auto',
                  animation: 'gradientShift 6s ease infinite',
                  textShadow: '0 0 20px rgba(177, 228, 199, 0.5), 0 0 40px rgba(202, 164, 148, 0.3)',
                }}
              >
                Spark Joy
              </span>
            </motion.h1>
            
            <motion.p
              className="max-w-lg text-lg text-white/90 md:text-xl leading-relaxed font-sans font-light mx-auto sm:mx-0"
              variants={itemVariants}
              style={{ 
                textShadow: '1px 1px 8px rgba(0,0,0,0.6)',
                lineHeight: '1.6'
              }} 
            >
              Indulge in handcrafted scented candles made with love, designed to brighten your space and soothe your soul.
            </motion.p>
            
            <motion.div
              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 justify-center sm:justify-start items-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                className="w-full sm:w-auto"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto px-10 py-6 text-lg font-medium bg-gradient-to-r from-[#caa494] to-[#b8d4a8] hover:from-[#b8a08e] hover:to-[#a8c498] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/products">Shop Now</Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-10 py-6 text-lg font-medium border-2 border-white/90 bg-transparent text-white hover:bg-white/10 hover:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300" 
                >
                  <Link href="/about">Explore Kraftika</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          {/* This empty div pushes the content to the left on medium screens and up */}
          <div className="hidden md:block"></div>
        </motion.div>
      </div>

      {/* Scrolling indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Global styles for animation */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
