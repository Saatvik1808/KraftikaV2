
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

import type { Candle } from '@/types/candle';
import type { Review } from '@/types/review';
import allProductsData from '@/data/products.json';
import allReviewsData from '@/data/reviews.json';
import { ProductDetailClient } from './product-detail-client';

const allProducts: Candle[] = allProductsData;
const allReviews: Review[] = allReviewsData;

interface PageProps {
  params: { id: string };
}

// Data fetching functions (server-side)
async function getProduct(id: string): Promise<Candle | undefined> {
  // In a real app, this would be a database query.
  return allProducts.find(p => p.id === id);
}

async function getRelatedProducts(currentCategory: string, currentId: string): Promise<Candle[]> {
   return allProducts.filter(p => p.scentCategory === currentCategory && p.id !== currentId).slice(0, 4);
}

async function getReviewsForProduct(productId: string): Promise<Review[]> {
  return allReviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
}

// Dynamic metadata generation for SEO
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found | Kraftika',
    };
  }

  // SEO Optimized title and description
  const pageTitle = `${product.name} - Kraftika | Handcrafted ${product.scentCategory} Candle`;
  const pageDescription = `Buy ${product.name}, a premium handcrafted ${product.scentCategory} scented candle from Kraftika. ${product.description}`;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [product.imageUrl, ...previousImages],
      url: `/products/${product.id}`,
      type: 'article',
    },
  };
}

// The main page component (Server Component)
export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Fetch data on the server
  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.scentCategory, product.id),
    getReviewsForProduct(product.id)
  ]);

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com';

  // JSON-LD for Rich Product Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `${siteUrl}${product.imageUrl}`,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Kraftika',
    },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    // Include rating only if reviews exist
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviews.length.toString(),
      },
      review: reviews.map(review => ({
          '@type': 'Review',
          reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating.toString(),
              bestRating: '5'
          },
          author: {
              '@type': 'Person',
              name: review.authorName
          },
          reviewBody: review.reviewText,
          datePublished: new Date(review.reviewDate).toISOString(),
      })),
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        reviews={reviews}
      />
    </>
  );
}
