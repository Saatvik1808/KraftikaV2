"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/blog-share-button";
import type { BlogPost } from "@/lib/blog.posts";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
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
  );
}



