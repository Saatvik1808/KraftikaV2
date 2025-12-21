
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Droplet, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const features = [
  {
    icon: Leaf,
    title: 'Natural Soy Wax',
    description: 'Clean-burning, eco-friendly soy wax for a mindful experience.',
    color: 'text-emerald-500',
  },
  {
    icon: Sparkles,
    title: 'Hand-Poured in India',
    description: 'Lovingly crafted by hand in small batches for unique quality.',
    color: 'text-amber-500',
  },
  {
    icon: Droplet,
    title: 'Premium Fragrances',
    description: 'Infused with fine essential oils for authentic, cozy aromas.',
    color: 'text-violet-500',
  },
];

export function AboutSection() {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-[#faf8ff] to-[#f4f0ff]">
      <div className="container mx-auto max-w-6xl px-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Section Title */}
          <motion.div 
            variants={itemVariants} 
            className="mb-20 text-center"
          >
            <h2 className="mb-10 text-center text-4xl font-bold tracking-tight sm:text-5xl
             text-transparent bg-clip-text bg-gradient-to-r
             from-primary via-secondary to-accent
             filter brightness-75">
              Crafted with <span >Heart & Soul</span>
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-gray-300" />
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the passion behind every Kraftika candle
            </p>
          </motion.div>

          {/* Our Philosophy */}
          <motion.div 
            variants={itemVariants} 
            className="mb-24 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-8 text-center">
              Our Philosophy
            </h3>
            <div className="space-y-6 text-gray-600 leading-relaxed text-base font-light">
              <p>
                Welcome to Kraftika, where mindful living meets aromatic bliss. Born from a passion for craftsmanship in India, each candle is lovingly hand-poured using eco-friendly soy wax and premium fragrances. We believe in creating cozy moments and sparking joy through sustainable, beautifully scented candles that soothe the soul.
              </p>
              <p>
                At Kraftika, we understand that candles are more than just decorative items—they are tools for transformation. Each flicker of flame represents a moment of pause, an opportunity to breathe deeply, and a chance to reconnect with yourself and your surroundings. Our candles are designed to create ambiance, but they're also crafted to enhance your well-being through the power of aromatherapy.
              </p>
              <p>
                We are committed to sustainability not as a trend, but as a core value. Every candle we create is made with natural soy wax sourced from renewable soybean crops, ensuring that our products are not only safe for your home but also gentle on the planet. We believe that luxury and sustainability can coexist, and our candles prove that you don't have to compromise on quality to make eco-friendly choices.
              </p>
              <p>
                Our journey began with a simple observation: the Indian market was flooded with mass-produced, synthetic candles that filled rooms with chemicals rather than joy. We saw an opportunity to create something different—candles that would bring genuine pleasure, enhance mental well-being, and respect both your health and the environment. This vision drives everything we do, from ingredient selection to packaging choices.
              </p>
            </div>
          </motion.div>

          {/* Our Story */}
          <motion.div 
            variants={itemVariants} 
            className="mb-24 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-8 text-center">
              Our Story
            </h3>
            <div className="space-y-6 text-gray-600 leading-relaxed text-base font-light">
              <p>
                Kraftika was founded by Anamika Sinha, a passionate entrepreneur with a deep love for artisanal craftsmanship and sustainable living. After years of searching for high-quality, natural candles in India, Anamika realized that the market lacked what she was seeking—handcrafted candles made with care, natural ingredients, and attention to detail.
              </p>
              <p>
                What started as a personal quest to find better candles evolved into a mission to transform the Indian candle market. Anamika began experimenting in her kitchen, learning the art of candle making from scratch. She studied different wax types, tested countless fragrance combinations, and perfected the technique of hand-pouring candles in small batches.
              </p>
              <p>
                Through countless hours of experimentation and refinement, Kraftika was born. The name "Kraftika" reflects our commitment to craftsmanship—"Kraft" meaning craft or skill in German, combined with a personal touch that represents the care and artistry we pour into every single candle.
              </p>
              <p>
                Today, Kraftika has grown from a small kitchen operation to a beloved brand that serves customers across India. But our core values remain unchanged: every candle is still hand-poured in small batches, we continue to use only natural, sustainable ingredients, and we maintain the same level of care and attention to detail that defined our very first candle.
              </p>
            </div>
          </motion.div>

          {/* Meet the Maker */}
          <motion.div 
            variants={itemVariants} 
            className="mb-24"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-12 text-center">
              Meet the Maker
            </h3>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden">
                <Image
                  src="/anamika.jpeg" 
                  alt="Anamika Sinha" 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="128px"
                  priority
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-normal text-gray-800 mb-1">Anamika Sinha</h4>
                <p className="text-sm text-gray-500 mb-4 tracking-wider">FOUNDER & CANDLEMAKER</p>
                <p className="text-gray-600 leading-relaxed italic font-light">
                  "I started Kraftika to share the simple joy a beautiful scent can bring. It's about creating moments of peace and warmth, sustainably and with love."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            variants={itemVariants} 
            className="text-center mb-24"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-12">
              Why Choose Kraftika?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full text-center bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
                    <CardHeader className="items-center pb-6">
                      <div className={`p-3 mb-4 ${feature.color}`}>
                        <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="text-lg font-normal text-gray-800">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed text-base font-light text-left">
              <p>
                <strong className="text-gray-800">Premium Quality Ingredients:</strong> We source only the finest natural soy wax, which burns cleaner and longer than paraffin wax. Our fragrances are phthalate-free and carefully selected to ensure they're both luxurious and safe for your home. Every ingredient is chosen with care, ensuring that what goes into our candles is as good for you as it is for the environment.
              </p>
              <p>
                <strong className="text-gray-800">Handcrafted Excellence:</strong> Unlike mass-produced candles, each Kraftika candle receives individual attention. Our small-batch production process allows us to maintain quality control at every step, ensuring that every candle meets our high standards. This artisanal approach means that while no two candles are identical, every one is crafted with the same level of care and expertise.
              </p>
              <p>
                <strong className="text-gray-800">Sustainable Practices:</strong> Sustainability isn't just a buzzword for us—it's a commitment. Our soy wax comes from renewable sources, our packaging is designed to minimize environmental impact, and we continuously seek ways to reduce our carbon footprint. When you choose Kraftika, you're supporting a brand that cares about the planet as much as you do.
              </p>
              <p>
                <strong className="text-gray-800">Aromatherapy Benefits:</strong> Our candles are designed with aromatherapy principles in mind. Each fragrance is carefully selected not just for its pleasant scent, but for its potential to enhance mood, reduce stress, improve sleep, or boost energy. We believe that the candles in your home should contribute to your overall well-being.
              </p>
              <p>
                <strong className="text-gray-800">Superior Performance:</strong> Kraftika candles offer exceptional burn times, with each candle providing 40-55 hours of burn time depending on size. Our natural soy wax burns evenly, preventing the tunneling that plagues lower-quality candles, and our carefully selected wicks ensure a clean, consistent flame every time.
              </p>
            </div>
          </motion.div>

          {/* Our Commitment */}
          <motion.div 
            variants={itemVariants} 
            className="mb-24 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-8 text-center">
              Our Commitment to You
            </h3>
            <div className="space-y-6 text-gray-600 leading-relaxed text-base font-light">
              <p>
                When you choose Kraftika, you're not just buying a candle—you're investing in a product that has been created with intention, care, and respect for both you and the planet. We are committed to providing you with candles that exceed your expectations in every way: quality, performance, scent, and sustainability.
              </p>
              <p>
                We stand behind every candle we create. If you're not completely satisfied with your purchase, we want to hear from you. Your feedback helps us improve, and your satisfaction is our priority. We believe that building a brand means building relationships, and we're committed to maintaining the trust you place in us.
              </p>
              <p>
                As we continue to grow, our commitment to quality, sustainability, and craftsmanship remains unwavering. We promise to never compromise on our ingredients, our processes, or our values. Every candle that leaves our workshop carries the Kraftika promise: quality you can trust, scents you'll love, and a commitment to making the world a little brighter, one candle at a time.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
