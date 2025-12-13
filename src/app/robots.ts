
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Use NEXT_PUBLIC_SITE_URL which should be set in your environment variables.
  // Fallback to a generic production URL if not set.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow user-specific and admin pages from indexing
      disallow: [
        '/cart/',
        '/wishlist/',
        '/login/',
        '/payment/',
        '/orders/',
        '/admin/',
        '/admin/login/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
