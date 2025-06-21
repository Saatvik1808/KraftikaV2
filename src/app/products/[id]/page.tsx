
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
      title: 'Product Not Found',
    };
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} - Kraftika Scents`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Kraftika Scents`,
      description: product.description,
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

  // Pass data to the client component for interactivity
  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}
