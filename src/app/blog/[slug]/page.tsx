import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogPost } from "@/lib/blog.posts";
import { Metadata } from "next";
import { ShareButton } from "@/components/blog-share-button";
import { BlogPostContent } from "@/components/blog-post-content";

export async function generateStaticParams() {
  const slugs = [
    "best-scented-candles-india-complete-guide-2025",
    "why-choose-soy-candles-over-paraffin",
    "candle-care-tips-maximize-burn-time",
    "aromatherapy-candles-benefits-mental-health",
    "choosing-right-candle-scent-every-room",
    "handcrafted-vs-mass-produced-candles",
    "sustainable-candles-eco-friendly-home-decor",
  ];
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
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

  return (
    <article className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <BlogPostContent post={post} />
      </div>
    </article>
  );
}

