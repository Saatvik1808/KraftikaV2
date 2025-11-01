
import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase-admin';
import type { Candle } from '@/types/candle';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use NEXT_PUBLIC_SITE_URL which should be set in your environment variables.
  // Fallback to a generic production URL if not set.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

  // Static routes with optimized priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    { 
      url: siteUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily', // Homepage updates frequently
      priority: 1.0 
    },
    { 
      url: `${siteUrl}/products`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', // Products page updates when new products added
      priority: 0.9 
    },
    { 
      url: `${siteUrl}/about`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.7 
    },
    { 
      url: `${siteUrl}/contact`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
    { 
      url: `${siteUrl}/quiz`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.7 
    },
    { 
      url: `${siteUrl}/faq`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
    // Low priority pages (noindex would be better, but keeping for completeness)
    { 
      url: `${siteUrl}/cart`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.1 
    },
    { 
      url: `${siteUrl}/wishlist`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.1 
    },
    { 
      url: `${siteUrl}/privacy-policy`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${siteUrl}/terms-of-service`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${siteUrl}/shipping-returns`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
  ];

  // Only fetch products if Firebase Admin is initialized
  if (db) {
    try {
      // Fetch products from Firestore
      const productsSnapshot = await db.collection('products').get();
      const products: Candle[] = [];
      
      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          price: Number(data.price) || 0,
          imageUrl: data.imageUrl || '',
          scentCategory: data.scentCategory || '',
          scentNotes: data.scentNotes || '',
          burnTime: data.burnTime || '',
          ingredients: data.ingredients || '',
          popularity: Number(data.popularity) || 0,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });

      // Dynamic product routes from Firestore data - optimized for SEO
      const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${siteUrl}/products/${product.id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly', // Products may have price/stock updates
        priority: 0.8, // High priority for product pages
      }));

      return [...staticRoutes, ...productRoutes];
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
      // Return only static routes if there's an error
      return staticRoutes;
    }
  }

  // Return only static routes if Firebase Admin is not initialized
  return staticRoutes;
}
