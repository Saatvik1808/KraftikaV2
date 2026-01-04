# City-Specific Landing Page Template

This template shows you how to create SEO-optimized landing pages for major Indian cities. These pages will help you rank for "scented candles [city name]" searches.

## 📍 Example: Mumbai Landing Page

**File Location:** `src/app/scented-candles-mumbai/page.tsx`

```tsx
import { Metadata } from 'next';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Gift, Star } from 'lucide-react';
import Link from 'next/link';

// SEO Optimized Metadata
export const metadata: Metadata = {
  title: 'Premium Scented Candles in Mumbai | Kraftika - Handcrafted Soy Candles | Free Shipping',
  description: 'Buy premium handcrafted scented candles in Mumbai. Kraftika offers the finest collection of soy candles, aromatherapy candles, and luxury candles. Free shipping across Mumbai. Best scented candles shop in Mumbai.',
  keywords: [
    'scented candles mumbai',
    'handcrafted candles mumbai',
    'soy candles mumbai',
    'luxury candles mumbai',
    'buy candles online mumbai',
    'kraftika candles mumbai',
    'aromatherapy candles mumbai',
    'premium candles mumbai',
    'candle shop mumbai',
    'gift candles mumbai'
  ],
  openGraph: {
    title: 'Premium Scented Candles in Mumbai | Kraftika',
    description: 'Shop the finest handcrafted scented candles in Mumbai. Free shipping across Mumbai.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.kraftikastudio.com/scented-candles-mumbai',
  },
  alternates: {
    canonical: 'https://www.kraftikastudio.com/scented-candles-mumbai',
  },
};

export default function MumbaiCandlesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

  // LocalBusiness Schema for Mumbai
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kraftika - Scented Candles Mumbai',
    image: `${siteUrl}/KraftikaV2.png`,
    '@id': `${siteUrl}/scented-candles-mumbai`,
    url: `${siteUrl}/scented-candles-mumbai`,
    telephone: '+91-9625901437',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Mumbai',
    },
    sameAs: [
      'https://www.instagram.com/kraftika_studio/',
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Serving Mumbai & Surrounding Areas</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Scented Candles in Mumbai
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover Kraftika's handcrafted scented soy candles - the perfect addition to your Mumbai home. 
              Premium quality, authentic fragrances, and free shipping across Mumbai.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span>Free Shipping in Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <span>Perfect Gift Option</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Kraftika in Mumbai Section */}
        <section className="container mx-auto max-w-6xl px-4 md:px-6 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Mumbai Loves Kraftika Candles
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Handcrafted in India</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every candle is carefully handcrafted with premium soy wax, perfect for Mumbai's 
                  climate. Natural, eco-friendly, and long-lasting.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Free Shipping Across Mumbai</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer free shipping for all orders in Mumbai. Fast delivery to Andheri, 
                  Bandra, Powai, and all Mumbai areas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Perfect for Mumbai Homes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our candles are designed to complement Mumbai's vibrant lifestyle. 
                  From cozy apartments to spacious homes, Kraftika candles create the perfect ambiance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="container mx-auto max-w-6xl px-4 md:px-6 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Best-Selling Candles in Mumbai
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular scented candles loved by Mumbai customers
            </p>
          </div>
          <ProductShowcase />
        </section>

        {/* Content Section for SEO */}
        <section className="container mx-auto max-w-4xl px-4 md:px-6 py-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">
              Best Scented Candles Shop in Mumbai
            </h2>
            <p className="mb-4">
              Looking for premium scented candles in Mumbai? Kraftika offers the finest collection 
              of handcrafted soy candles, aromatherapy candles, and luxury candles perfect for 
              Mumbai homes. Our candles are carefully crafted with premium soy wax, ensuring a 
              clean burn and long-lasting fragrance.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-4">
              Why Choose Kraftika Candles in Mumbai?
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Premium Quality:</strong> Handcrafted with 100% soy wax, free from 
                harmful chemicals, perfect for Mumbai's health-conscious consumers.
              </li>
              <li>
                <strong>Wide Variety:</strong> From floral to citrus, we offer scents that 
                suit every Mumbai home and mood.
              </li>
              <li>
                <strong>Free Shipping:</strong> We deliver free across Mumbai - from Colaba 
                to Borivali, Andheri to Powai.
              </li>
              <li>
                <strong>Perfect Gifts:</strong> Our elegantly packaged candles make perfect 
                gifts for birthdays, anniversaries, or housewarming parties in Mumbai.
              </li>
              <li>
                <strong>Eco-Friendly:</strong> Sustainable and environmentally conscious, 
                aligning with Mumbai's growing eco-awareness.
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-4">
              Popular Areas We Serve in Mumbai
            </h3>
            <p className="mb-4">
              Kraftika delivers premium scented candles across Mumbai, including but not limited to:
              South Mumbai (Colaba, Fort, Marine Drive), Central Mumbai (Andheri, Bandra, 
              Juhu, Powai), North Mumbai (Borivali, Goregaon, Malad), and Western Suburbs. 
              Free shipping available for all Mumbai orders.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-4">
              Perfect for Mumbai Lifestyle
            </h3>
            <p className="mb-4">
              Mumbai's fast-paced lifestyle deserves moments of calm. Our aromatherapy candles 
              help create peaceful sanctuaries in your home. Whether you're unwinding after a 
              long day in Mumbai's bustling streets or creating ambiance for a special evening, 
              Kraftika candles are your perfect companion.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8">
                Shop All Candles
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto max-w-4xl px-4 md:px-6 py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions - Mumbai Customers
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you deliver to all areas in Mumbai?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes! We deliver to all areas in Mumbai including South Mumbai, Central Mumbai, 
                  North Mumbai, and suburbs. Free shipping is available for all Mumbai orders.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does delivery take in Mumbai?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Standard delivery in Mumbai takes 2-3 business days. For urgent orders, 
                  please contact us and we'll try our best to accommodate.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are Kraftika candles suitable for Mumbai's climate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Absolutely! Our soy candles are perfect for Mumbai's humid climate. 
                  They burn cleanly and provide consistent fragrance regardless of weather conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
```

---

## 📋 Steps to Create City Pages

### Step 1: Create the Page File

1. Create a new folder in `src/app/` with the city name
   - Example: `src/app/scented-candles-mumbai/`
2. Create `page.tsx` inside the folder
3. Copy the template above and customize

### Step 2: Customize for Each City

**For each city, update:**
- City name (Mumbai → Delhi, Bangalore, etc.)
- SEO metadata (title, description, keywords)
- Structured data (addressLocality, addressRegion)
- Content (mentions of specific areas)
- FAQ section (city-specific questions)

### Step 3: Update Sitemap

Add city pages to `src/app/sitemap.ts`:

```tsx
{
  url: `${siteUrl}/scented-candles-mumbai`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
{
  url: `${siteUrl}/scented-candles-delhi`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
// ... add other cities
```

---

## 🎯 Priority Cities to Create Pages For

### High Priority (Create First):
1. ✅ Mumbai
2. ✅ Delhi
3. ✅ Bangalore
4. ✅ Hyderabad
5. ✅ Pune

### Medium Priority:
6. Kolkata
7. Chennai
8. Ahmedabad
9. Jaipur
10. Surat

---

## 🔍 SEO Optimization Tips

1. **Unique Content:** Each city page must have unique content (not duplicate)
2. **Local Keywords:** Include city name naturally in headings and content
3. **Local Areas:** Mention specific neighborhoods/areas in each city
4. **Testimonials:** Add customer testimonials from that city (if available)
5. **Internal Linking:** Link from homepage and products page to city pages
6. **Structured Data:** Always include LocalBusiness schema for each city

---

## 📊 Expected Results

**Month 1:**
- Pages indexed by Google
- Basic rankings for city-specific keywords

**Month 2-3:**
- Top 20 rankings for "scented candles [city name]"
- Increased organic traffic from target cities

**Month 4-6:**
- Top 10 rankings for city keywords
- Significant traffic increase from target cities
- Better overall India SEO performance

---

**Next Steps:**
1. Create Mumbai page first (highest priority)
2. Create Delhi page second
3. Create 3-5 more city pages this month
4. Monitor rankings in Google Search Console
5. Optimize based on performance data

Good luck! 🚀







