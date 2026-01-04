"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import type { BlogPost } from "@/lib/blog.posts";

export function ShareButton({ post }: { post: BlogPost }) {
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard if share fails
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
}




