import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog.posts";
import { Metadata } from "next";
import { ShareButton } from "@/components/blog-share-button";
import { BlogPostContent } from "@/components/blog-post-content";

export async function generateStaticParams() {
  // Source from the posts library so new posts are picked up automatically.
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image ? `${siteUrl}${post.image}` : `${siteUrl}/KraftikaV2.png`,
    url: `${siteUrl}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'Kraftika Studio', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Kraftika Studio',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/KraftikaV2.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <article className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <BlogPostContent post={post} />
      </div>
    </article>
  );
}

