import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

// Define BlogPost type and blogPosts array locally
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "complete-guide-to-scented-candles",
    title: "Complete Guide to Scented Candles",
    excerpt: "Everything you need to know about scented candles, from choosing the right wax to understanding fragrance notes.",
    date: "2024-01-15",
    image: "/placeholder-image.jpg",
  },
  {
    slug: "understanding-candle-scent-categories",
    title: "Understanding Candle Scent Categories",
    excerpt: "Learn about different scent categories and how to choose the perfect candle for your space.",
    date: "2024-01-20",
    image: "/placeholder-image.jpg",
  },
  {
    slug: "how-to-burn-candles-safely",
    title: "How to Burn Candles Safely",
    excerpt: "Essential safety guidelines for enjoying scented candles responsibly.",
    date: "2024-01-25",
    image: "/placeholder-image.jpg",
  },
  {
    slug: "product-faqs-answered",
    title: "Product FAQs Answered",
    excerpt: "Common questions about Kraftika candles answered by our experts.",
    date: "2024-02-01",
    image: "/placeholder-image.jpg",
  },
  {
    slug: "benefits-of-scented-candles",
    title: "Benefits of Scented Candles",
    excerpt: "Discover the therapeutic and wellness benefits of scented candles.",
    date: "2024-02-10",
    image: "/placeholder-image.jpg",
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Get blog post content based on slug
function getBlogContent(slug: string): string {
  const contentMap: Record<string, string> = {
    "complete-guide-to-scented-candles": `
      <h2>What Are Scented Candles?</h2>
      <p>Scented candles have become an essential part of modern home decor and wellness routines. These beautifully crafted candles combine the warmth of candlelight with the therapeutic benefits of fragrance, creating an atmosphere that can transform any space. Unlike traditional unscented candles, scented varieties are infused with essential oils or synthetic fragrance compounds that release aromatic molecules as the wax melts and the flame burns.</p>
      <p>The science behind scented candles involves the evaporation of fragrance oils into the air, where they interact with olfactory receptors in your nose, triggering emotional and physiological responses. This makes them powerful tools for aromatherapy and ambiance creation.</p>
      
      <h2>History and Evolution</h2>
      <p>Candles have been used for thousands of years, dating back to ancient Egypt around 3000 BC, where they were made from reeds dipped in tallow. The Romans advanced candle-making by using rolled papyrus and animal fats. Beeswax candles emerged in the Middle Ages, offering a cleaner burn and pleasant honey scent.</p>
      <p>Scented candles as we know them today evolved in the 19th century with the discovery of paraffin wax and the invention of braided wicks. The modern scented candle industry exploded in the 1990s with the rise of wellness culture. Today, premium brands like Kraftika focus on sustainable materials, clean-burning formulas, and sophisticated fragrance blending techniques borrowed from perfumery.</p>
      
      <h2>Types of Candle Wax</h2>
      <h3>Soy Wax</h3>
      <p>Soy wax is made from hydrogenated soybean oil and is one of the most popular choices for scented candles. It's natural, renewable, biodegradable, and burns cleaner than paraffin wax with minimal soot production. Soy wax has excellent fragrance retention and throws scent effectively even when cold. Our Kraftika candles use a proprietary soy wax blend optimized for hot throw (scent release when burning) and cold throw (scent when unlit), ensuring your space smells amazing from the moment you open the jar.</p>
      <p><strong>Pros:</strong> Eco-friendly, long burn time, strong scent throw.<br>
      <strong>Cons:</strong> Can develop frost marks (natural crystallization), softer texture.</p>
      
      <h3>Paraffin Wax</h3>
      <p>Paraffin wax is a petroleum byproduct refined from crude oil. It's the most common candle wax due to its low cost, excellent scent throw, and ability to hold vibrant colors. However, it produces more soot and releases trace amounts of toxins when burned.</p>
      <p><strong>Pros:</strong> Affordable, strong fragrance throw, smooth finish.<br>
      <strong>Cons:</strong> Not eco-friendly, potential health concerns with prolonged exposure.</p>
      
      <h3>Beeswax</h3>
      <p>Beeswax is a natural byproduct of honey production, filtered and purified for candle-making. It burns the cleanest of all waxes, naturally purifying the air by releasing negative ions that bind with pollutants. Beeswax has a subtle honey scent and golden hue.</p>
      <p><strong>Pros:</strong> Air-purifying, longest burn time, natural scent.<br>
      <strong>Cons:</strong> Expensive, weaker scent throw with added fragrances.</p>
      
      <h3>Coconut Wax (Premium Alternative)</h3>
      <p>Coconut wax is derived from coconut oil and often blended with other natural waxes. It offers superior scent throw, creamy texture, and ultra-clean burn. Kraftika's luxury line incorporates coconut-soy blends for the ultimate burning experience.</p>
      
      <h2>Understanding Fragrance Notes</h2>
      <p>Just like fine perfumes, scented candles have a pyramid structure of fragrance notes that unfold over time:</p>
      
      <h3>Top Notes (0-30 minutes)</h3>
      <p>These are the first scents you notice when lighting a candle. They're usually light, volatile molecules like citrus (bergamot, lemon), herbs (basil, mint), or green notes (grass, leaves). Top notes create the initial impression and evaporate within the first half hour.</p>
      
      <h3>Middle Notes (30 minutes - 2 hours)</h3>
      <p>Also called heart notes, these emerge as the candle reaches its optimal burning temperature. They're the core character of the fragrance—typically floral (rose, jasmine), fruity (apple, peach), or spiced (cinnamon, clove) notes that define the candle's personality.</p>
      
      <h3>Base Notes (2+ hours)</h3>
      <p>These are the deep, rich scents that linger longest and provide the fragrance foundation. Base notes include musk, vanilla, amber, patchouli, sandalwood, and oud. They become more prominent as the candle burns and create the lasting impression in your space.</p>
      
      <h2>How to Choose the Right Candle</h2>
      <h3>Consider Your Space</h3>
      <p>Different rooms benefit from different scents and sizes:</p>
      <ul>
        <li><strong>Bathroom:</strong> Fresh, clean scents like eucalyptus, linen, or citrus to combat odors</li>
        <li><strong>Bedroom:</strong> Calming lavender, chamomile, or vanilla for relaxation</li>
        <li><strong>Kitchen:</strong> Neutralizing scents like lemon, basil, or coffee to mask cooking smells</li>
        <li><strong>Living Room:</strong> Warm, inviting scents like sandalwood or fig for entertaining</li>
      </ul>
      
      <h3>Match Your Mood and Season</h3>
      <p>Seasonal scent selection enhances the experience:</p>
      <ul>
        <li><strong>Spring:</strong> Floral and green notes (lilac, hyacinth, fresh-cut grass)</li>
        <li><strong>Summer:</strong> Tropical and citrus (coconut, pineapple, sea salt)</li>
        <li><strong>Fall:</strong> Warm spices (pumpkin, cinnamon, apple cider)</li>
        <li><strong>Winter:</strong> Rich woods and sweets (pine, vanilla, frankincense)</li>
      </ul>
      
      <h3>Consider the Size and Throw</h3>
      <p>Scent throw refers to how far the fragrance travels:</p>
      <ul>
        <li><strong>Small candles (under 8oz):</strong> Ideal for bathrooms, desks, nightstands</li>
        <li><strong>Medium (8-12oz):</strong> Perfect for bedrooms, home offices</li>
        <li><strong>Large (12oz+):</strong> Best for open-concept living spaces</li>
      </ul>
      
      <h2>Proper Candle Care</h2>
      <h3>First Burn is Critical</h3>
      <p>Always let your candle burn long enough on the first burn to create a full melt pool across the entire surface (usually 2-4 hours depending on diameter). This prevents tunneling and ensures even burning throughout the candle's life. The general rule: 1 hour per inch of diameter.</p>
      
      <h3>Wick Maintenance</h3>
      <p>Keep your wick trimmed to about 1/4 inch before each burn. Use wick trimmers for a clean cut. Long wicks cause mushrooming (carbon buildup), excessive smoke, and uneven burning. For wooden wicks, trim to 1/8 inch and remove charred wood.</p>
      
      <h3>Burn Time and Temperature</h3>
      <p>Never burn a candle for more than 4 hours at a time. Allow it to cool completely (at least 2 hours) before relighting. Burn in a room temperature environment (68-75°F) for optimal performance. Cold rooms cause poor melt pools; hot rooms cause excessive melting.</p>
      
      <h3>Storage Tips</h3>
      <ul>
        <li>Store in a cool, dark place away from sunlight</li>
        <li>Keep lids on to preserve fragrance</li>
        <li>Store upright to prevent wax leakage</li>
        <li>Avoid extreme temperature fluctuations</li>
      </ul>
      
      <h2>Safety Guidelines</h2>
      <ul>
        <li>Always burn candles in well-ventilated areas with good airflow</li>
        <li>Keep candles away from drafts, children, and pets</li>
        <li>Never leave a burning candle unattended—even for a minute</li>
        <li>Place candles on heat-resistant, stable surfaces</li>
        <li>Keep the wax pool free of wick trimmings, matches, and debris</li>
        <li>Extinguish candles properly using a snuffer or lid (never blow)</li>
        <li>Stop burning when 1/2 inch of wax remains in containers</li>
        <li>Keep burning candles at least 3 inches apart</li>
      </ul>
      
      <h2>Benefits of Scented Candles</h2>
      <h3>Aromatherapy and Wellness</h3>
      <p>Scientific studies show certain scents can affect mood and mental state:</p>
      <ul>
        <li><strong>Lavender:</strong> Reduces anxiety by up to 20% (per Japanese studies)</li>
        <li><strong>Citrus:</strong> Increases alertness and reduces depression symptoms</li>
        <li><strong>Peppermint:</strong> Improves focus and cognitive performance</li>
        <li><strong>Rosemary:</strong> Enhances memory retention</li>
      </ul>
      
      <h3>Ambiance and Aesthetics</h3>
      <p>The warm glow of candlelight creates a cozy, inviting atmosphere that enhances any occasion—from romantic dinners to productive work sessions. Candlelight has a color temperature of ~1800K, much warmer than LED bulbs (2700-6500K), creating a relaxing environment.</p>
      
      <h3>Stress Relief and Mindfulness</h3>
      <p>The ritual of lighting a candle can serve as a mindfulness trigger, signaling the transition from work to relaxation. The combination of gentle light, pleasing fragrance, and soft crackling (with wooden wicks) engages multiple senses for deeper relaxation.</p>
      
      <h2>Troubleshooting Common Issues</h2>
      <h3>Weak Scent Throw</h3>
      <p>Solutions: Burn longer (scent builds over time), trim wick properly, close windows/drafts, use in smaller spaces, ensure proper first burn.</p>
      
      <h3>Tunneling</h3>
      <p>Fix: Create a foil tent over the candle to direct heat to sides, or use a candle warmer. Prevention is key with proper first burn.</p>
      
      <h3>Soot Production</h3>
      <p>Causes: Long/untrimmed wick, drafty location, low-quality fragrance oils. Use high-quality candles and maintain proper wick length.</p>
    `,
    "understanding-candle-scent-categories": `
      <h2>Introduction to Scent Categories</h2>
      <p>Understanding scent categories helps you choose the perfect candle for your space, mood, and occasion. Professional perfumers classify fragrances using the "fragrance wheel" developed by Michael Edwards, grouping scents by similar characteristics. Each category has unique properties, intensity levels, and best-use scenarios.</p>
      <p>Kraftika candles are crafted with IFRA-compliant, phthalate-free fragrance oils blended specifically for optimal hot and cold throw in soy wax.</p>
      
      <h2>Citrus Scents</h2>
      <p>Citrus fragrances are bright, fresh, and energizing—the olfactory equivalent of sunshine. Extracted from fruit peels through cold-pressing, these volatile oils provide immediate, uplifting aromas that excel in top notes.</p>
      <h3>Common Citrus Notes:</h3>
      <ul>
        <li><strong>Lemon:</strong> Fresh, zesty, clean—perfect for kitchen odor elimination</li>
        <li><strong>Orange/Blood Orange:</strong> Sweet, juicy, uplifting—great for morning routines</li>
        <li><strong>Grapefruit:</strong> Tart, bitter-sweet, sophisticated—ideal for modern spaces</li>
        <li><strong>Bergamot:</strong> Complex citrus with floral undertones (think Earl Grey tea)</li>
        <li><strong>Lime:</strong> Sharp, tropical, invigorating—excellent for summer</li>
        <li><strong>Yuzu:</strong> Japanese citrus hybrid—exotic, spa-like luxury</li>
      </ul>
      <p><strong>Best for:</strong> Kitchens, bathrooms, home offices, morning routines, post-workout refresh<br>
      <strong>Pairs well with:</strong> Fresh, herbal, or woody notes</p>
      <p><strong>Did you know?</strong> Citrus scents can increase serotonin levels and reduce symptoms of seasonal affective disorder (SAD).</p>
      
      <h2>Floral Scents</h2>
      <p>Floral fragrances are romantic, elegant, and timeless—the heart of classic perfumery. They range from delicate single-note blooms to complex bouquets mimicking fresh flower arrangements.</p>
      <h3>Common Floral Notes:</h3>
      <ul>
        <li><strong>Rose:</strong> Classic, romantic, slightly powdery—available in Bulgarian, Damask, or Tea varieties</li>
        <li><strong>Jasmine:</strong> Exotic, sweet, indolic—harvested at dawn for maximum potency</li>
        <li><strong>Lavender:</strong> Calming, herbaceous, proven to reduce anxiety in clinical studies</li>
        <li><strong>Lily of the Valley:</strong> Fresh, green, spring-like (synthetic due to toxicity)</li>
        <li><strong>Peony:</strong> Lush, romantic, slightly fruity—perfect for bridal aesthetics</li>
        <li><strong>Gardenia:</strong> Creamy, tropical, intense—challenges perfumers due to extraction difficulty</li>
      </ul>
      <p><strong>Best for:</strong> Bedrooms, living rooms, bathrooms, romantic dinners, bridal suites<br>
      <strong>Pairs well with:</strong> Sweet, fruity, or green notes</p>
      
      <h2>Sweet Scents (Gourmand)</h2>
      <p>Sweet or gourmand fragrances are warm, comforting, and indulgent—evoking fresh-baked goods and dessert. This category exploded in the 1990s with Angel by Thierry Mugler and remains hugely popular.</p>
      <h3>Common Sweet Notes:</h3>
      <ul>
        <li><strong>Vanilla:</strong> Warm, creamy, comforting—derived from orchid pods, available in Bourbon, Tahitian, or Mexican varieties</li>
        <li><strong>Caramel:</strong> Rich, buttery, slightly burnt sugar—creates addictive warmth</li>
        <li><strong>Chocolate/Cocoa:</strong> Decadent, powdery, luxurious—often paired with coffee or mint</li>
        <li><strong>Coffee:</strong> Bold, roasted, energizing—perfect for morning ambiance</li>
        <li><strong>Hazelnut:</strong> Nutty, creamy, sophisticated—evokes Nutella luxury</li>
        <li><strong>Marshmallow:</strong> Sweet, fluffy, nostalgic—reminds of childhood campfires</li>
      </ul>
      <p><strong>Best for:</strong> Living rooms, bedrooms, cozy corners, evening relaxation, fall/winter<br>
      <strong>Pairs well with:</strong> Woody, spicy, or coffee notes</p>
      
      <h2>Fresh Scents</h2>
      <p>Fresh fragrances are clean, crisp, and invigorating—designed to mimic the feeling of freshly laundered linens or ocean breezes. They're the most universally appealing category.</p>
      <h3>Common Fresh Notes:</h3>
      <ul>
        <li><strong>Clean Linen:</strong> Crisp, cotton-fresh, slightly powdery—hotel luxury vibe</li>
        <li><strong>Ocean/Sea Salt:</strong> Cool, breezy, mineral—evokes coastal vacations</li>
        <li><strong>Mint/Peppermint:</strong> Cool, refreshing, invigorating—great for focus</li>
        <li><strong>Rain/Water:</strong> Fresh, ozonic, post-storm clarity—uses calone molecule</li>
        <li><strong>Green Tea:</strong> Light, herbal, Zen-like—perfect for meditation spaces</li>
        <li><strong>Aloe/Cucumber:</strong> Cool, watery, spa-fresh—ultimate relaxation</li>
      </ul>
      <p><strong>Best for:</strong> Bedrooms, bathrooms, entryways, yoga studios, any space needing refresh<br>
      <strong>Pairs well with:</strong> Citrus, floral, or herbal notes</p>
      
      <h2>Fruity Scents</h2>
      <p>Fruity fragrances are vibrant, playful, and energizing—capturing the essence of ripe summer produce. They're less literal than citrus and more juicy/sweet.</p>
      <h3>Common Fruity Notes:</h3>
      <ul>
        <li><strong>Berry Blend:</strong> Sweet, tangy, summer-fresh (strawberry, raspberry, blackberry)</li>
        <li><strong>Apple:</strong> Crisp, green, autumnal—available in Granny Smith or Honeycrisp profiles</li>
        <li><strong>Peach/Nectarine:</strong> Soft, fuzzy, juicy—evokes Southern summers</li>
        <li><strong>Tropical:</strong> Mango, pineapple, passionfruit—vacation in a jar</li>
        <li><strong>Cherry:</strong> Sweet-tart, almond-like—classic soda fountain vibe</li>
        <li><strong>Fig:</strong> Green, earthy-sweet, Mediterranean luxury</li>
      </ul>
      <p><strong>Best for:</strong> Living rooms, kitchens, entertaining spaces, summer parties<br>
      <strong>Pairs well with:</strong> Floral, sweet, or green notes</p>
      
      <h2>Woody Scents</h2>
      <p>Woody fragrances are earthy, grounding, and sophisticated—forming the backbone of masculine and unisex perfumes. They provide depth and longevity.</p>
      <h3>Common Woody Notes:</h3>
      <ul>
        <li><strong>Sandalwood:</strong> Creamy, warm, slightly sweet—sacred in incense traditions</li>
        <li><strong>Cedarwood:</strong> Earthy, grounding, pencil-shavings freshness</li>
        <li><strong>Pine/Fir:</strong> Fresh, forest-like, Christmas tree nostalgia</li>
        <li><strong>Teak:</strong> Rich, exotic, slightly smoky—evokes antique furniture</li>
        <li><strong>Oud/Agarwood:</strong> Deep, resinous, animalic—most expensive perfume ingredient</li>
        <li><strong>Vetiver:</strong> Smoky, earthy, root-like—Haitian vetiver is cleaner, Javanese is smokier</li>
      </ul>
      <p><strong>Best for:</strong> Studies, living rooms, meditation spaces, fall/winter, masculine aesthetics<br>
      <strong>Pairs well with:</strong> Citrus, spicy, or fresh notes</p>
      
      <h2>Specialty Categories</h2>
      <h3>Herbal/Green</h3>
      <p>Think fresh herbs, crushed leaves, vegetable gardens. Notes: basil, tomato leaf, galbanum, violet leaf.</p>
      
      <h3>Spicy/Oriental</h3>
      <p>Warm spices and resins: cinnamon, clove, cardamom, frankincense, amber.</p>
      
      <h3>Smoky/Leather</h3>
      <p>Evokes fireplaces and luxury: birch tar, smoked woods, castoreum, leather accord.</p>
      
      <h2>Mixing and Matching Scents</h2>
      <p>Create layered fragrance experiences by burning multiple candles with complementary scents:</p>
      <ul>
        <li><strong>Citrus + Fresh:</strong> Ultimate clean, energizing atmosphere (Lemon + Sea Salt)</li>
        <li><strong>Floral + Sweet:</strong> Romantic, cozy feel (Rose + Vanilla)</li>
        <li><strong>Woody + Fresh:</strong> Sophisticated, natural ambiance (Sandalwood + Ocean)</li>
        <li><strong>Fruity + Floral:</strong> Playful, feminine vibe (Peach + Peony)</li>
        <li><strong>Spicy + Woody:</strong> Warm, masculine depth (Cinnamon + Cedar)</li>
      </ul>
      <p><strong>Pro tip:</strong> Place complementary candles in different areas of an open space for a dynamic scent journey as you move through rooms.</p>
    `,
    "how-to-burn-candles-safely": `
      <h2>Why Candle Safety Matters</h2>
      <p>While candles create beautiful ambiance, they are open flames that require respect. According to the National Fire Protection Association (NFPA), candles cause an average of 7,610 home fires annually in the US, resulting in 81 deaths and $278 million in property damage. Following these guidelines ensures you can enjoy your candles worry-free.</p>
      <p>Kraftika candles are designed with safety in mind—using lead-free cotton or wood wicks, stable glass containers, and proper wax formulations—but safe practices are still essential.</p>
      
      <h2>Before You Light</h2>
      <h3>Choose the Right Location</h3>
      <ul>
        <li>Place candles on stable, level, heat-resistant surfaces (never wood, plastic, or fabric)</li>
        <li>Keep candles away from flammable materials—maintain 12-inch clearance from curtains, papers, bedding, etc.</li>
        <li>Ensure at least 3 inches between burning candles to prevent heat buildup</li>
        <li>Avoid placing candles near air vents, fans, open windows, or high-traffic areas</li>
        <li>Use candle holders designed for the candle size—never place directly on surfaces</li>
      </ul>
      
      <h3>Inspect Your Candle</h3>
      <ul>
        <li>Check glass containers for cracks, chips, or weak spots</li>
        <li>Ensure the wick is centered and trimmed to 1/4 inch (1/8 inch for wood wicks)</li>
        <li>Remove all packaging, labels, and decorative elements before burning</li>
        <li>Verify the candle is stable and won't tip easily</li>
        <li>For multi-wick candles, ensure all wicks are properly spaced</li>
      </ul>
      
      <h2>While Burning</h2>
      <h3>Never Leave Unattended</h3>
      <p>This is the #1 candle safety rule. Always stay in the room with a burning candle. If you must leave—even to answer the door—extinguish it first. Consider using the "candle rule": if you wouldn't leave a stove burner on, don't leave a candle burning.</p>
      
      <h3>Keep Away from Children and Pets</h3>
      <p>Place candles out of reach—on high shelves or mantles. Curious children and pets can easily cause accidents. The Consumer Product Safety Commission reports hundreds of child injuries annually from candle-related incidents.</p>
      
      <h3>Watch for Proper Burning Signs</h3>
      <ul>
        <li><strong>Healthy flame:</strong> Steady, 1-inch tall, slight flicker</li>
        <li><strong>Melt pool:</strong> Even across entire surface, reaching edges within 2-4 hours</li>
        <li><strong>No excessive smoking:</strong> Brief puff when extinguishing is normal</li>
        <li><strong>Warning signs:</strong> Flame higher than 2 inches, excessive soot, container too hot to touch</li>
      </ul>
      
      <h2>Burn Time Limits</h2>
      <p><strong>Maximum 4 hours:</strong> Never burn a candle for more than 4 hours continuously. This prevents container overheating, wax leakage, and carbon buildup on wicks. Allow at least 2 hours cooling time before relighting.</p>
      <p><strong>Stop at 1/2 inch:</strong> Discontinue use when 1/2 inch of wax remains in container candles (1 inch for freestanding). Burning lower risks container cracking from heat.</p>
      
      <h2>Extinguishing Safely</h2>
      <h3>Use a Snuffer (Best Method)</h3>
      <p>A candle snuffer is the safest way to extinguish flames. It prevents hot wax splatter and reduces smoke. Simply place the bell over the flame until it's deprived of oxygen.</p>
      
      <h3>Use the Lid (Container Candles)</h3>
      <p>Most Kraftika candles come with metal lids. Place the lid on the jar to cut off oxygen supply—this method produces minimal smoke and contains any wax movement.</p>
      
      <h3>Dip the Wick (Advanced)</h3>
      <p>Use a wick dipper tool to bend the wick into the melt pool, then straighten it. This coats the wick in wax for easier relighting and eliminates smoke.</p>
      
      <h3>Never Blow Out</h3>
      <p>Avoid blowing out candles—this causes hot wax to splash, creates smoke, and can spread embers. It also pushes fragrance molecules away instead of containing them.</p>
      
      <h2>Common Safety Mistakes to Avoid</h2>
      <ul>
        <li>❌ Burning candles near drafts or vents (causes uneven burning and soot)</li>
        <li>❌ Moving a burning candle (risk of spilling hot wax)</li>
        <li>❌ Burning a candle all the way down (container can crack)</li>
        <li>❌ Using water to extinguish (causes violent steam explosion and glass shattering)</li>
        <li>❌ Burning multiple candles too close together (heat buildup)</li>
        <li>❌ Burning candles in inappropriate containers (use only heat-safe glass/ceramic)</li>
        <li>❌ Falling asleep with candles burning (leading cause of candle fires)</li>
        <li>❌ Placing candles under shelves or cabinets (heat damage)</li>
      </ul>
      
      <h2>Emergency Situations</h2>
      <h3>If a Candle Catches Fire</h3>
      <ol>
        <li><strong>Do NOT use water</strong>—it will spread the fire</li>
        <li>Smother the flame with a non-flammable lid, metal pot, or baking sheet</li>
        <li>For container candles, carefully place the lid to seal it</li>
        <li>Use a fire extinguisher rated for Class B fires if needed</li>
        <li>Evacuate and call 911 if the fire spreads beyond the candle</li>
        <li>Never attempt to move a burning candle container</li>
      </ol>
      
      <h3>If Wax Spills and Ignites</h3>
      <p>Smother with baking soda or a damp towel. Have a fire extinguisher accessible in your home.</p>
      
      <h2>Storage Safety</h2>
      <ul>
        <li>Store candles in a cool, dry place (below 80°F) to prevent melting</li>
        <li>Keep away from direct sunlight to prevent color fading and fragrance degradation</li>
        <li>Store upright to prevent wax leakage and wick damage</li>
        <li>Keep wicks trimmed and covered with lids to preserve scent</li>
        <li>Avoid storing near heat sources or in vehicles</li>
        <li>For long-term storage, wrap individually to prevent scent mixing</li>
      </ul>
      
      <h2>Special Safety Considerations</h2>
      <h3>Multi-Wick Candles</h3>
      <p>Larger candles with 2-3 wicks burn hotter and faster. Monitor closely and ensure proper spacing.</p>
      
      <h3>Wooden Wick Candles</h3>
      <p>Produce taller flames and crackling sounds. Trim to 1/8 inch and ensure even burning across all areas.</p>
      
      <h3>Essential Oil Safety</h3>
      <p>Some pets (especially cats) are sensitive to certain essential oils. Research pet-safe scents before use.</p>
    `,
    "product-faqs-answered": `
      <h2>Frequently Asked Questions About Kraftika Candles</h2>
      <p>Everything you need to know about our premium soy wax candles, from ingredients to care instructions.</p>
      
      <h2>General Questions</h2>
      <h3>What are Kraftika candles made from?</h3>
      <p>Our candles are hand-poured using a proprietary blend of 100% natural soy wax sourced from American farmers, premium phthalate-free fragrance oils that meet IFRA safety standards, and lead-free cotton or sustainably sourced wooden wicks. We never use paraffin, dyes, or harmful additives. Each candle is crafted in small batches to ensure quality and consistency.</p>
      <p><strong>Key features:</strong></p>
      <ul>
        <li>100% soy wax (renewical, biodegradable, renewable)</li>
        <li>Phthalate-free, paraben-free fragrances</li>
        <li>Clean-burning, lead-free wicks</li>
        <li>Recyclable amber glass jars with metal lids</li>
        <li>Vegan and cruelty-free</li>
      </ul>
      
      <h3>How long do Kraftika candles burn?</h3>
      <p>Burn times vary by size and wick type:</p>
      <ul>
        <li><strong>4oz Travel Tin:</strong> 20-25 hours</li>
        <li><strong>8oz Classic Jar:</strong> 45-55 hours</li>
        <li><strong>12oz Large Jar:</strong> 70-80 hours</li>
        <li><strong>16oz XL Jar:</strong> 90-100 hours</li>
        <li><strong>3-Wick Dough Bowl:</strong> 50-60 hours</li>
      </ul>
      <p>Actual burn time depends on proper care—trimming wicks, avoiding drafts, and following burn guidelines. Wooden wick candles may have slightly shorter burn times due to wider flames.</p>
      
      <h3>Are Kraftika candles safe for pets?</h3>
      <p>Our candles use pet-safe, phthalate-free fragrance oils, but individual pet sensitivity varies. Cats are particularly sensitive to essential oils due to liver metabolism differences. We recommend:</p>
      <ul>
        <li>Testing in well-ventilated areas</li>
        <li>Monitoring pets for signs of distress (sneezing, watery eyes)</li>
        <li>Avoiding strong citrus or tea tree oil scents around cats</li>
        <li>Never allowing pets to access burning candles</li>
        <li>Consulting your veterinarian for pet-specific concerns</li>
      </ul>
      
      <h2>Using Your Candle</h2>
      <h3>How do I get the best burn from my candle?</h3>
      <p>Follow our "Perfect Burn Protocol":</p>
      <ol>
        <li><strong>First Burn:</strong> Burn until full melt pool reaches all edges (2-4 hours). This is CRITICAL to prevent tunneling.</li>
        <li><strong>Wick Care:</strong> Trim to 1/4" (cotton) or 1/8" (wood) before EVERY burn.</li>
        <li><strong>Burn Time:</strong> 2-4 hours maximum per session.</li>
        <li><strong>Environment:</strong> Room temperature 68-75°F, no drafts.</li>
        <li><strong>Extinguishing:</strong> Use snuffer or lid—never blow.</li>
      </ol>
      
      <h3>Why is my candle tunneling?</h3>
      <p>Tunneling occurs when the wax doesn't melt to the edges, creating a tunnel down the center. Causes:</p>
      <ul>
        <li>Insufficient first burn time</li>
        <li>Drafty location</li>
        <li>Wick trimmed too short</li>
        <li>Burning in cold room</li>
      </ul>
      <p><strong>Fix it:</strong> Wrap aluminum foil around the jar top creating a tent, burn for 2-3 hours to melt sides. For severe tunneling, use a candle warmer.</p>
      
      <h3>How do I remove spilled wax from surfaces?</h3>
      <p><strong>For fabric (upholstery, carpet):</strong></p>
      <ol>
        <li>Let wax harden completely (use ice cube if needed)</li>
        <li>Gently scrape off excess with plastic card</li>
        <li>Place paper towel over wax and iron on low heat</li>
        <li>Wax transfers to paper—repeat as needed</li>
        <li>Clean residue with mild soap and water</li>
      </ol>
      <p><strong>For hard surfaces:</strong> Scrape, then use warm soapy water or goo gone.</p>
      
      <h2>Fragrance Questions</h2>
      <h3>How strong is the fragrance throw?</h3>
      <p>Kraftika candles are formulated for <strong>medium-strong hot throw</strong> and <strong>strong cold throw</strong>:</p>
      <ul>
        <li><strong>Cold throw:</strong> Noticeable scent when jar is opened (room-filling within 10-15 minutes)</li>
        <li><strong>Hot throw:</strong> Fills 200-400 sq ft within 30 minutes of burning</li>
        <li><strong>Peak throw:</strong> Reached after 1-2 hours of proper burning</li>
      </ul>
      <p>For larger spaces, use multiple candles or our 3-wick options.</p>
      
      <h3>Can I mix different Kraftika scents?</h3>
      <p>Yes! Create custom fragrance experiences:</p>
      <ul>
        <li><strong>Lavender + Vanilla:</strong> Ultimate relaxation blend</li>
        <li><strong>Citrus + Sea Salt:</strong> Coastal spa atmosphere</li>
        <li><strong>Pumpkin + Coffee:</strong> Cozy autumn morning</li>
        <li><strong>Sandalwood + Bergamot:</strong> Sophisticated luxury</li>
      </ul>
      <p>Start with complementary categories from the fragrance wheel for best results.</p>
      
      <h3>Why doesn't my candle smell as strong?</h3>
      <p>Common causes and solutions:</p>
      <ul>
        <li><strong>Nose blindness:</strong> Take a break and return—scent will be noticeable again</li>
        <li><strong>Room size:</strong> Use larger or multiple candles for big spaces</li>
        <li><strong>Drafts/AC:</strong> Close windows and vents</li>
        <li><strong>Burn time:</strong> Scent builds gradually over 1-2 hours</li>
        <li><strong>Wick issues:</strong> Trim properly and ensure full melt pool</li>
      </ul>
      
      <h2>Care and Maintenance</h2>
      <h3>How do I clean my candle jar for reuse?</h3>
      <p>Transform finished candles into storage containers:</p>
      <ol>
        <li>Burn until 1/2" wax remains</li>
        <li>Extinguish and let cool</li>
        <li>Place in freezer for 2 hours—wax contracts and pops out</li>
        <li>Scrape remaining wax with spoon</li>
        <li>Wash with hot, soapy water</li>
        <li>Remove label with goo gone if desired</li>
      </ol>
      <p>Uses: makeup brush holders, cotton ball storage, succulent planters, desk organizers.</p>
      
      <h3>How should I store unused candles?</h3>
      <p>Preserve fragrance and appearance:</p>
      <ul>
        <li>Cool, dark place (pantry or closet)</li>
        <li>Temperature 60-75°F</li>
        <li>Lids on to contain scent</li>
        <li>Upright position</li>
        <li>Away from heat sources and sunlight</li>
      </ul>
      <p>Properly stored, Kraftika candles maintain fragrance for 2+ years.</p>
      
      <h2>Product-Specific Questions</h2>
      <h3>What's the difference between wooden and cotton wicks?</h3>
      <table class="comparison-table">
        <tr><th>Feature</th><th>Wooden Wick</th><th>Cotton Wick</th></tr>
        <tr><td>Sound</td><td>Cozy crackling</td><td>Silent</td></tr>
        <tr><td>Flame</td><td>Wider, taller</td><td>Traditional</td></tr>
        <tr><td>Burn Rate</td><td>Faster</td><td>Slower</td></tr>
        <tr><td>Trimming</td><td>1/8 inch</td><td>1/4 inch</td></tr>
        <tr><td>Ambiance</td><td>Fireplace feel</td><td>Classic candle</td></tr>
      </table>
      
      <h3>Are all Kraftika candles the same size?</h3>
      <p>We offer multiple sizes for different needs:</p>
      <ul>
        <li><strong>Travel Tins (4oz):</strong> 2.5" diameter × 1.75" height</li>
        <li><strong>Classic Jars (8oz):</strong> 3" diameter × 3.5" height</li>
        <li><strong>Large Jars (12oz):</strong> 3.5" diameter × 4" height</li>
        <li><strong>XL Jars (16oz):</strong> 4" diameter × 4.5" height</li>
        <li><strong>Dough Bowls:</strong> 12" × 5" × 2" (3 wicks)</li>
      </ul>
      
      <h2>Shipping, Returns, and Support</h2>
      <h3>How are candles shipped?</h3>
      <p>We use temperature-controlled shipping with:</p>
      <ul>
        <li>Insulated packaging during summer months</li>
        <li>Double-boxed protection</li>
        <li>Secure wax stabilization</li>
        <li>Signature required for high-value orders</li>
      </ul>
      
      <h3>What if my candle arrives damaged or melted?</h3>
      <p>Contact us within 48 hours of delivery with photos. We'll replace your candle free of charge—no questions asked. We guarantee your candles arrive in perfect condition.</p>
      
      <h3>Do you offer wholesale or custom orders?</h3>
      <p>Yes! Contact wholesale@kraftikacandles.com for:</p>
      <ul>
        <li>Wedding favors and corporate gifting</li>
        <li>Custom scent development</li>
        <li>Private label manufacturing</li>
        <li>Bulk pricing for retailers</li>
      </ul>
    `,
    "benefits-of-scented-candles": `
      <h2>The Therapeutic Power of Scent</h2>
      <p>Scented candles offer far more than aesthetic appeal—they provide proven benefits for mental health, physical wellness, and environmental enhancement. The combination of aromatherapy, soft lighting, and ritual creates a multi-sensory experience that promotes holistic well-being.</p>
      <p>Scientific research validates what ancient cultures knew intuitively: scent profoundly affects our brain, emotions, and physiology through the limbic system—the brain's emotional center directly connected to olfactory receptors.</p>
      
      <h2>Mental Health Benefits</h2>
      <h3>Stress Reduction and Anxiety Relief</h3>
      <p>Clinical studies demonstrate significant stress reduction from specific scents:</p>
      <ul>
        <li><strong>Lavender:</strong> Reduces cortisol levels by 25% (Tokyo University study)</li>
        <li><strong>Chamomile:</strong> Lowers anxiety in generalized anxiety disorder patients</li>
        <li><strong>Vanilla:</strong> Decreases startle reflex and promotes calm</li>
      </ul>
      <p>The ritual of lighting a candle serves as a mindfulness anchor, signaling "relaxation time" to your brain.</p>
      
      <h3>Improved Sleep Quality</h3>
      <p>Using calming scented candles 30 minutes before bed establishes a sleep routine:</p>
      <ul>
        <li>Lavender increases deep sleep stages by 20%</li>
        <li>Chamomile reduces night wakings</li>
        <li>Combined with candlelight's warm color temperature (1800K), it suppresses melatonin-disrupting blue light</li>
      </ul>
      <p>Result: Faster sleep onset, longer sleep duration, improved sleep architecture.</p>
      
      <h3>Mood Enhancement and Emotional Regulation</h3>
      <p>Scent memory is powerful—specific aromas can trigger positive emotional states:</p>
      <ul>
        <li><strong>Citrus scents:</strong> Increase serotonin and dopamine</li>
        <li><strong>Rosemary:</strong> Improves mood in depression studies</li>
        <li><strong>Peppermint:</strong> Enhances alertness and reduces frustration</li>
      </ul>
      
      <h2>Physical Benefits</h2>
      <h3>Air Purification and Odor Neutralization</h3>
      <p>High-quality soy candles with proper wicks:</p>
      <ul>
        <li>Burn cleaner than paraffin (95% less soot)</li>
        <li>Neutralize odors through fragrance binding rather than masking</li>
        <li>Release negative ions (especially beeswax) that bind with pollutants</li>
      </ul>
      <p>Particularly effective for cooking smells, pet odors, and musty spaces.</p>
      
      <h3>Eye Comfort and Circadian Health</h3>
      <p>Candlelight has a color temperature of ~1800K with minimal blue light emission:</p>
      <ul>
        <li>Reduces eye strain from screens</li>
        <li>Supports natural melatonin production in evenings</li>
        <li>Creates relaxing visual environment</li>
      </ul>
      
      <h3>Respiratory Support</h3>
      <p>Certain essential oil-based candles provide therapeutic benefits:</p>
      <ul>
        <li><strong>Eucalyptus:</strong> Opens airways, supports sinus health</li>
        <li><strong>Peppermint:</strong> Cooling sensation, eases tension headaches</li>
        <li><strong>Tea Tree:</strong> Natural antimicrobial properties</li>
      </ul>
      
      <h2>Aromatherapy Benefits by Scent</h2>
      <div class="aromatherapy-grid">
        <div class="aroma-card">
          <h3>Lavender</h3>
          <p>Relaxation • Stress relief • Sleep support • Anxiety reduction</p>
        </div>
        <div class="aroma-card">
          <h3>Eucalyptus</h3>
          <p>Respiratory health • Mental clarity • Immune support • Focus</p>
        </div>
        <div class="aroma-card">
          <h3>Citrus Blend</h3>
          <p>Energizing • Mood-boosting • Cognitive enhancement • Uplifting</p>
        </div>
        <div class="aroma-card">
          <h3>Vanilla</h3>
          <p>Comforting • Stress-reducing • Appetite regulation • Warmth</p>
        </div>
        <div class="aroma-card">
          <h3>Rosemary</h3>
          <p>Memory enhancement • Concentration • Headache relief • Alertness</p>
        </div>
        <div class="aroma-card">
          <h3>Peppermint</h3>
          <p>Focus • Energy • Nausea relief • Mental clarity</p>
        </div>
      </div>
      
      <h2>Creating Atmosphere and Ritual</h2>
      <p>Candles transform ordinary moments into sacred rituals:</p>
      <ul>
        <li><strong>Work-to-home transition:</strong> Light a candle to signal end of workday</li>
        <li><strong>Self-care routines:</strong> Enhance baths, meditation, journaling</li>
        <li><strong>Social gatherings:</strong> Create intimate, welcoming environments</li>
        <li><strong>Seasonal celebrations:</strong> Mark holidays with signature scents</li>
      </ul>
      
      <h2>Mindfulness and Meditation Enhancement</h2>
      <p>The soft light and gentle fragrance of candles create ideal conditions for mindfulness practice:</p>
      <ul>
        <li><strong>Visual focus:</strong> Flame gazing (Trataka meditation) improves concentration</li>
        <li><strong>Olfactory anchor:</strong> Scent becomes associated with calm state</li>
        <li><strong>Multi-sensory engagement:</strong> Combines sight, smell, sound (wooden wicks)</li>
        <li><strong>Time awareness:</strong> Burning duration provides natural meditation timer</li>
      </ul>
      
      <h2>Productivity and Focus Benefits</h2>
      <p>Certain scents enhance cognitive performance:</p>
      <ul>
        <li><strong>Peppermint:</strong> Increases alertness by 30% in office studies</li>
        <li><strong>Lemon:</strong> Reduces typing errors by 54% (Japanese research)</li>
        <li><strong>Rosemary:</strong> Improves memory recall speed and accuracy</li>
      </ul>
      <p>Use focus-enhancing candles during work sessions for improved productivity.</p>
      
      <h2>Economic and Environmental Value</h2>
      <ul>
        <li><strong>Cost-effective luxury:</strong> Hours of ambiance for pennies per hour</li>
        <li><strong>Multi-functional:</strong> Decor, fragrance, therapy in one product</li>
        <li><strong>Sustainable choice:</strong> Soy wax supports American farmers, biodegradable</li>
        <li><strong>Reusable containers:</strong> Reduce waste with jar repurposing</li>
      </ul>
      
      <h2>Scientific Validation</h2>
      <p>Research supporting candle benefits:</p>
      <ul>
        <li>Journal of Alternative and Complementary Medicine: Aromatherapy reduces anxiety in clinical settings</li>
        <li>Chemical Senses: Olfactory stimulation affects autonomic nervous system</li>
        <li>Sleep Medicine: Lavender increases slow-wave sleep</li>
        <li>International Journal of Neuroscience: Rosemary enhances cognitive performance</li>
      </ul>
      
      <h2>Conclusion: The Kraftika Difference</h2>
      <p>Kraftika candles combine premium materials, expert fragrance blending, and therapeutic design to maximize these benefits. Each candle is a tool for wellness, creating moments of peace in our busy lives. Light one tonight and experience the transformation.</p>
    `
  };
  return contentMap[slug] || "";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | Kraftika Candles Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  const content = getBlogContent(slug);
  const readingTime = Math.ceil(content.split(" ").length / 200); // Approx words per minute
  
  return (
    <article className="min-h-screen bg-cream-light">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-4 hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-serif">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-white hover:text-gold"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div 
          className="prose prose-lg max-w-none 
                     prose-headings:font-serif prose-headings:text-brown-dark
                     prose-p:text-gray-700 prose-p:leading-relaxed
                     prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-700
                     prose-li:my-2
                     prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gold/20 prose-h2:pb-4
                     prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                     prose-strong:font-semibold prose-strong:text-brown-dark
                     prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
                     [&_*]:transition-colors"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <Separator className="my-12" />
        
        {/* Author & CTA */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-3">About the Author</h3>
            <p className="text-gray-600">
              Sarah Thompson is Kraftika's lead fragrance specialist with over 10 years of experience in aromatherapy and candle craftsmanship. She blends traditional techniques with modern wellness science to create candles that enhance your daily rituals.
            </p>
          </div>
          
          <div className="bg-gold/5 p-6 rounded-lg">
            <h3 className="text-xl font-serif mb-3">Ready to Experience the Difference?</h3>
            <p className="text-gray-600 mb-4">
              Transform your space with premium scented candles crafted for wellness and luxury.
            </p>
            <Button asChild className="w-full md:w-auto">
              <Link href="/shop">
                Shop Kraftika Collection
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-serif mb-6">Related Reading</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts
              .filter((p) => p.slug !== slug)
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-brown-dark group-hover:text-gold transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}