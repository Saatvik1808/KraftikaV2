
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

import type { Candle } from '@/types/candle';
import type { Review } from '@/types/review';
import { getProduct, getRelatedProducts } from '@/services/products-unified';
import { ProductDetailClient } from './product-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Data fetching functions (server-side)
async function getProductData(id: string): Promise<Candle | null> {
  return await getProduct(id);
}

async function getRelatedProductsData(currentCategory: string, currentId: string): Promise<Candle[]> {
   return await getRelatedProducts(currentCategory, currentId);
}

async function getReviewsForProduct(productId: string): Promise<Review[]> {
  // For now, return empty array since we're not implementing reviews from Firestore yet
  // You can implement this later when you have reviews in your database
  return [];
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

  try {
    product = await getProductData(id);

    if (!product) {
      notFound();
      return; // TypeScript guard - notFound() throws but TS doesn't know that
    }

    // Fetch data on the server with error handling
    try {
      [relatedProducts, reviews] = await Promise.all([
        getRelatedProductsData(product.scentCategory, product.id),
        getReviewsForProduct(product.id)
      ]);
    } catch (error) {
      // If related products or reviews fail, continue with empty arrays
      console.error("Error fetching related products or reviews:", error);
      relatedProducts = [];
      reviews = [];
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
    return; // TypeScript guard
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
