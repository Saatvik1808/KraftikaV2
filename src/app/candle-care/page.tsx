import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Flame, Scissors, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Candle Care Guide - How to Care for Your Kraftika Candles',
  description: 'Complete guide on how to properly care for your scented candles. Learn expert tips for maximizing burn time, preventing tunneling, and maintaining your candles for optimal performance.',
};

export default function CandleCarePage() {
  return (
    <div className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Complete Candle Care Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert tips to maximize the life and performance of your Kraftika candles
            </p>
          </div>

          <div className="space-y-12 prose prose-lg max-w-none dark:prose-invert">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Flame className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground m-0">
                  The Critical First Burn
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The first time you light your Kraftika candle is the most important burn. This initial burn determines how well your candle will perform throughout its entire life. When you first light your candle, allow it to burn until the entire top surface becomes a pool of liquid wax. This typically takes 1-2 hours depending on the candle size.
                </p>
                <p>
                  This first burn creates what candle experts call a "memory ring." The wax "remembers" the diameter of this first melt pool. If you extinguish the candle before the entire top melts, it will tunnel straight down on future burns, leaving a ring of unused wax around the edges. Once tunneling starts, it's very difficult to fix, so that first burn is crucial for getting the maximum value from your candle.
                </p>
                <p>
                  <strong className="text-foreground">Pro Tip:</strong> Set aside time for the first burn. Don't light a new candle when you only have 30 minutes—wait until you can allow it to burn for the full 1-2 hours needed to create a complete melt pool.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Scissors className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground m-0">
                  Proper Wick Maintenance
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Wick care is essential for a clean, safe, and efficient burn. Always trim your wick to 1/4 inch (approximately 6mm) before every single lighting. This simple step prevents several common problems:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Excess soot production that can stain walls and containers</li>
                  <li>Large, flickering flames that burn too hot</li>
                  <li>Smoke and black marks on the container</li>
                  <li>Rapid wax consumption that shortens burn time</li>
                </ul>
                <p>
                  Use a proper wick trimmer or small scissors dedicated to candle care. Never pinch off the wick with your fingers. If you notice a "mushroom" or carbon ball forming on your wick, trim it off completely. This buildup can cause smoking and reduce scent throw.
                </p>
                <p>
                  <strong className="text-foreground">Pro Tip:</strong> Keep a wick trimmer near your candles for easy access. Trim wicks when the candle is completely cool, before lighting.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground m-0">
                  Optimal Burning Practices
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Following proper burning practices ensures your candles perform optimally and last as long as possible:
                </p>
                <p>
                  <strong className="text-foreground">Burn Time Limits:</strong> Never burn a candle for more than 4 hours at a time. After 4 hours, extinguish the flame and allow the candle to cool completely for at least 2 hours before relighting. This prevents the candle from overheating, which can cause the wax to become unstable and the container to become dangerously hot.
                </p>
                <p>
                  <strong className="text-foreground">Safe Depth:</strong> Stop burning your candle when there's approximately 1/2 inch of wax remaining at the bottom. Burning beyond this point can cause the container to overheat and potentially break, creating a fire hazard.
                </p>
                <p>
                  <strong className="text-foreground">Placement Matters:</strong> Always place candles on heat-resistant surfaces, away from drafts, vents, ceiling fans, and air currents. Drafts can cause uneven burning, excessive flickering, smoking, and reduced scent throw. Keep candles away from direct sunlight, which can cause the wax to soften and discolor.
                </p>
                <p>
                  <strong className="text-foreground">Keep It Clean:</strong> Before each lighting, remove any debris, matches, wick trimmings, or foreign objects from the wax pool. This ensures a clean burn and prevents potential issues.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground m-0">
                  Extinguishing and Storage
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  How you put out your candle matters for both safety and candle care:
                </p>
                <p>
                  <strong className="text-foreground">Use a Snuffer:</strong> A candle snuffer is the best tool for extinguishing candles. It prevents hot wax from splattering and reduces smoke. If you don't have a snuffer, gently blow from a distance to avoid splattering wax.
                </p>
                <p>
                  <strong className="text-foreground">Don't Use the Lid:</strong> While it's tempting to use the lid to snuff out the flame, this can trap smoke and create unpleasant odors that linger in the wax. Always let the candle cool completely before covering with a lid.
                </p>
                <p>
                  <strong className="text-foreground">Proper Storage:</strong> Store your candles in a cool, dry place away from direct sunlight. Heat and light can cause the wax to soften, discolor, or lose fragrance. Keep candles covered when not in use to preserve their fragrance. Avoid storing candles near heat sources, in cars, or in areas with extreme temperature fluctuations.
                </p>
                <p>
                  Always store candles upright to maintain their shape and prevent wax from shifting. If storing for extended periods, keep them in their original packaging or wrap them in tissue paper to protect them from dust and light.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Troubleshooting Common Issues
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Tunneling</h3>
                  <p>
                    If your candle has already started tunneling (burning straight down the center), you can try to fix it:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Wrap aluminum foil around the top of the candle, leaving a small opening above the wick, and burn for a few hours to melt the surrounding wax</li>
                    <li>Use a candle warmer or hair dryer to melt the wax around the edges, then let it cool and reset</li>
                    <li>Once the wax pool reaches the edges, continue with normal burning practices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Soot on Container</h3>
                  <p>
                    If black soot builds up on your container:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Let the candle cool completely</li>
                    <li>Wipe with a dry paper towel or soft cloth</li>
                    <li>Trim your wick shorter on future burns</li>
                    <li>Consider switching to natural wax candles if sooting is excessive</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Weak Scent Throw</h3>
                  <p>
                    To improve fragrance:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Ensure proper first burn to maximize surface area</li>
                    <li>Keep the room well-ventilated but not drafty</li>
                    <li>Burn in smaller rooms for more concentrated fragrance</li>
                    <li>Allow candles to "rest" between burns for 24-48 hours to regain scent strength</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-primary/10 p-8 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Safety First
              </h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Safety should always be your top priority when burning candles:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Never leave a burning candle unattended</li>
                  <li>Keep candles out of reach of children and pets</li>
                  <li>Keep burning candles away from flammable materials</li>
                  <li>Don't move a candle while it's burning or while wax is liquid</li>
                  <li>Check containers for cracks before lighting</li>
                  <li>Don't burn candles in drafty areas</li>
                  <li>Always place candles on stable, heat-resistant surfaces</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Need more help? Check out our blog for detailed guides and tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/blog">Read Our Blog</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Shop Candles</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

