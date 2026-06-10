"use client";

import * as React from "react";
import { Star, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getReviews, submitReview, type ReviewSummary } from "@/services/commerce-api";
import Link from "next/link";

function Stars({ value, size = 4, onSelect }: { value: number; size?: number; onSelect?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect?.(n)}
          className={onSelect ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-${size} w-${size} ${n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
            style={{ width: size * 4, height: size * 4 }}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [data, setData] = React.useState<ReviewSummary | null>(null);
  const [rating, setRating] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const reload = React.useCallback(() => {
    getReviews(productId).then(setData).catch(() => {});
  }, [productId]);
  React.useEffect(reload, [reload]);

  const submit = async () => {
    if (rating < 1) {
      toast({ title: "Pick a rating", description: "Tap the stars to rate this candle.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(productId, { rating, title: title || undefined, comment: comment || undefined });
      toast({ title: "Thank you!", description: "Your review has been published." });
      setShowForm(false);
      setRating(0); setTitle(""); setComment("");
      reload();
    } catch (e: any) {
      toast({ title: "Could not submit review", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glassmorphism mt-10">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-xl">Customer Reviews</CardTitle>
          {data && data.count > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <Stars value={Math.round(data.average ?? 0)} />
              <span className="font-semibold">{data.average}</span>
              <span className="text-muted-foreground text-sm">({data.count} review{data.count > 1 ? "s" : ""})</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mt-1">No reviews yet — be the first!</p>
          )}
        </div>
        {isAuthenticated ? (
          <Button onClick={() => setShowForm((v) => !v)} variant={showForm ? "outline" : "default"}>
            {showForm ? "Cancel" : "Write a review"}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Login to review</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <div className="rounded-lg border border-border bg-card/60 p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Your rating *</Label>
              <Stars value={rating} size={6} onSelect={setRating} />
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Smells amazing!" maxLength={200} />
            </div>
            <div className="space-y-1.5">
              <Label>Review</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the scent, burn time, packaging?"
                rows={3}
              />
            </div>
            <Button onClick={submit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit review
            </Button>
          </div>
        )}

        {data && data.reviews.length > 0 && (
          <div className="space-y-4">
            {data.reviews.map((r) => (
              <div key={r.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Stars value={r.rating} />
                  {r.title && <span className="font-medium">{r.title}</span>}
                  {r.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 rounded-full px-2 py-0.5">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                    </span>
                  )}
                </div>
                {r.comment && <p className="text-sm mt-1.5 text-foreground/90">{r.comment}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  {r.reviewerName} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
