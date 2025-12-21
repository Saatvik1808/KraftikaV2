import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogPost } from "@/lib/blog.posts";
import { Metadata } from "next";
import { ShareButton } from "@/components/blog-share-button";

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-8"
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="mb-6">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.trim().startsWith('##') || paragraph.trim().match(/^[A-Z][^.!?]*$/)) {
                  const headingMatch = paragraph.match(/^##\s*(.+)$/);
                  if (headingMatch) {
                    return (
                      <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                        {headingMatch[1]}
                      </h2>
                    );
                  }
                  const isHeading = paragraph.length < 100 && !paragraph.includes('.') && !paragraph.includes('!') && !paragraph.includes('?');
                  if (isHeading && paragraph.length > 10) {
                    return (
                      <h3 key={idx} className="text-xl font-semibold mt-6 mb-3 text-foreground">
                        {paragraph.trim()}
                      </h3>
                    );
                  }
                }
                if (paragraph.trim().startsWith('-') || paragraph.trim().match(/^\d+\./)) {
                  const items = paragraph.split(/\n(?=-|\d+\.)/).filter(item => item.trim());
                  return (
                    <ul key={idx} className="list-disc pl-6 mb-4 space-y-2">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-muted-foreground">
                          {item.replace(/^[-•]\s*|\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <ShareButton post={post} />
          </div>
        </motion.div>
      </div>
    </article>
  );
}

