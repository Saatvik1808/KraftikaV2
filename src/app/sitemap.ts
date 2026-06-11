
import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog.posts';

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
    // Note: Cart, wishlist, login, payment, and orders pages are excluded from sitemap
    // as they should not be indexed (noindex tags added via layout.tsx files)
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
    { 
      url: `${siteUrl}/blog`, 
      lastModified: new Date(), 
      changeFrequency: 'weekly', 
      priority: 0.8 
    },
    { 
      url: `${siteUrl}/candle-care`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.7 
    },
  ];

  // Blog post routes (static content, always available)
  const blogPosts = getAllBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Product routes from the live database (was Firestore — stale/dead source).
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import('@/lib/prisma');
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });
    productRoutes = products.map((p) => ({
      url: `${siteUrl}/products/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: product fetch failed, serving without products:', error);
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
