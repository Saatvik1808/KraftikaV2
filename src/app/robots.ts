
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Use NEXT_PUBLIC_SITE_URL which should be set in your environment variables.
  // Fallback to a generic production URL if not set.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow specific paths if needed, e.g., /cart, /wishlist
      // disallow: ['/cart/', '/wishlist/'], 
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
