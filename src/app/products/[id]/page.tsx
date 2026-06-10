
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { cache } from 'react';

import type { Candle } from '@/types/candle';
import type { Review } from '@/types/review';
import { getProductDirect, getRelatedDirect } from '@/lib/server-products';
import { ProductDetailClient } from './product-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ISR: each product page renders on first visit (in the same region as the
// DB), is served from the CDN afterwards, and re-generates in the background
// every 5 minutes. Live data (reviews form, cart) is fetched client-side.
// NOTE: deliberately no generateStaticParams — build-time prerendering ran in
// a build container whose parallel DB connections flaked and baked 404s.
export const revalidate = 300;

// Cache the product fetch to avoid duplicate calls (for metadata + page)
// This ensures we only fetch once even if both generateMetadata and page component need it
const getProductData = cache(async (id: string): Promise<Candle | null> => {
  return await getProductDirect(id);
});

async function getRelatedProductsData(currentCategory: string, currentId: string): Promise<Candle[]> {
  return await getRelatedDirect(currentCategory, currentId);
}

async function getReviewsForProduct(productId: string): Promise<Review[]> {
  // Server component: read straight from the database (feeds the JSON-LD
  // aggregateRating for rich snippets).
  try {
    const { prisma } = await import('@/lib/prisma');
    const rows = await prisma.productReview.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } },
      take: 50,
    });
    return rows.map((r) => {
      const name =
        [r.user?.firstName, r.user?.lastName ? `${r.user.lastName[0]}.` : null]
          .filter(Boolean)
          .join(' ') || 'Kraftika Customer';
      return {
        id: r.id,
        productId: r.productId,
        authorName: name,
        authorAvatarUrl: '',
        authorAvatarFallback: name[0]?.toUpperCase() ?? 'K',
        rating: r.rating,
        reviewText: [r.title, r.comment].filter(Boolean).join(' — '),
        reviewDate: r.createdAt.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    });
  } catch (e) {
    console.error('Failed to load reviews:', e);
    return [];
  }
}

// Dynamic metadata generation for SEO
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductData(id);

  if (!product) {
    return {
      title: 'Product Not Found | Kraftika',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';
  const productUrl = `${siteUrl}/products/${product.id}`;
  
  // SEO Optimized title and description with keywords
  const pageTitle = `${product.name} - ${product.scentCategory} Scented Candle | Kraftika India`;
  const pageDescription = `Buy ${product.name} - Premium handcrafted ${product.scentCategory.toLowerCase()} scented soy candle from Kraftika. ${product.description.substring(0, 120)}... Free shipping across India.`;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const productImageUrl = product.imageUrl.startsWith('http') 
    ? product.imageUrl 
    : `${siteUrl}${product.imageUrl}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `kraftika ${product.name.toLowerCase()}`,
      `${product.scentCategory.toLowerCase()} scented candle`,
      `handcrafted ${product.scentCategory.toLowerCase()} candle`,
      'scented candles india',
      'kraftika candles',
      'buy candles online india',
      'premium candles',
      'soy candles',
    ],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: productImageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} - Kraftika Handcrafted Candle`,
        },
        ...previousImages,
      ],
      url: productUrl,
      type: 'website',
      siteName: 'Kraftika',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [productImageUrl],
      creator: '@kraftika_studio',
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

// The main page component (Server Component)
export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  let product: Candle | null;
  let relatedProducts: Candle[] = [];
  let reviews: Review[] = [];

  // 404 only when the product truly doesn't exist. A DB/infra error must
  // throw (→ error page / failed ISR regen keeps the old cached page) — NOT
  // notFound(), which would cache a 404 for a real product.
  product = await getProductData(id);
  if (!product) {
    notFound();
    return; // TypeScript guard - notFound() throws but TS doesn't know that
  }

  // Secondary data is best-effort.
  try {
    [relatedProducts, reviews] = await Promise.all([
      getRelatedProductsData(product.scentCategory, product.id),
      getReviewsForProduct(product.id)
    ]);
  } catch (error) {
    console.error("Error fetching related products or reviews:", error);
    relatedProducts = [];
    reviews = [];
  }

  // Ensure product is not null at this point (TypeScript check)
  if (!product) {
    notFound();
    return;
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';
  const productUrl = `${siteUrl}/products/${product.id}`;

  // Enhanced JSON-LD for Rich Product Snippets
  const productImageUrl = product.imageUrl.startsWith('http') 
    ? product.imageUrl 
    : `${siteUrl}${product.imageUrl}`;
    
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [productImageUrl],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Kraftika',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/KraftikaV2.png`,
      },
    },
    sku: product.id,
    category: `${product.scentCategory} Scented Candles`,
    productID: product.id,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Kraftika',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Scent Category',
        value: product.scentCategory,
      },
      {
        '@type': 'PropertyValue',
        name: 'Scent Notes',
        value: Array.isArray(product.scentNotes) ? product.scentNotes.join(', ') : product.scentNotes,
      },
      {
        '@type': 'PropertyValue',
        name: 'Burn Time',
        value: product.burnTime,
      },
      {
        '@type': 'PropertyValue',
        name: 'Ingredients',
        value: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients,
      },
    ],
    // Include rating only if reviews exist
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviews.length.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.map(review => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: review.authorName,
        },
        reviewBody: review.reviewText,
        datePublished: new Date(review.reviewDate).toISOString(),
      })),
    }),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${siteUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.scentCategory,
        item: `${siteUrl}/products?category=${encodeURIComponent(product.scentCategory)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        reviews={reviews}
      />
    </>
  );
}
