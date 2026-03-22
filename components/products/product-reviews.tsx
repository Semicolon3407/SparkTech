'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, ShieldCheck, User, Clock, ChevronDown, PenLine, AlertTriangle, Loader2 } from 'lucide-react';
import { RatingStars } from '@/components/shared/rating-stars';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ productId, reviews: initialReviews, rating: initialRating, reviewCount: initialCount }: ProductReviewsProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityReason, setEligibilityReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');

  useEffect(() => {
    checkEligibility();
  }, [productId]);

  const checkEligibility = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews/eligibility`);
      const data = await res.json();
      setIsEligible(data.eligible);
      setEligibilityReason(data.reason);
    } catch (error) {
      console.error('Failed to check eligibility:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRating || !formTitle || !formComment) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: formRating,
          title: formTitle,
          comment: formComment
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      toast.success("Review submitted successfully");
      setDialogOpen(false);
      // Refresh page or update state
      router.refresh();
      
      // Reset form
      setFormTitle('');
      setFormComment('');
      setFormRating(5);
      
      // Re-check eligibility (they should now be ineligible as they've already reviewed)
      checkEligibility();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingDistribution = [
    { stars: 5, count: reviews.filter(r => r.rating === 5).length },
    { stars: 4, count: reviews.filter(r => r.rating === 4).length },
    { stars: 3, count: reviews.filter(r => r.rating === 3).length },
    { stars: 2, count: reviews.filter(r => r.rating === 2).length },
    { stars: 1, count: reviews.filter(r => r.rating === 1).length },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-12 gap-16">
        {/* Simplified Left Summary Panel */}
        <div className="md:col-span-4 space-y-10">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overall Rating</h3>
            <div className="flex items-end gap-3 translate-y-2">
              <span className="text-6xl font-black text-gray-950 tracking-tighter">
                {initialRating.toFixed(1)}
              </span>
              <div className="pb-2">
                <RatingStars rating={initialRating} size="md" />
                <p className="text-xs font-bold text-muted-foreground mt-1">
                   {initialCount} reviews globally
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4 group">
                <div className="text-[11px] font-bold text-muted-foreground w-4 flex items-center gap-1">
                  {item.stars} <Star className="w-3 h-3 fill-current" />
                </div>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gray-950 transition-all duration-1000 ease-out"
                     style={{ width: `${initialCount > 0 ? (item.count / initialCount) * 100 : 0}%` }}
                   />
                </div>
                <div className="text-[11px] font-bold text-muted-foreground w-8 text-right">
                  {Math.round(initialCount > 0 ? (item.count / initialCount) * 100 : 0)}%
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            {isEligible ? (
               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                 <DialogTrigger asChild>
                   <Button className="w-full h-12 rounded-xl font-bold bg-gray-950 hover:bg-gray-800 transition-all gap-2">
                     <PenLine className="w-4 h-4" /> Write a Review
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader className="p-8 bg-gray-50 border-b border-gray-100">
                        <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" /> Share Your Experience
                        </DialogTitle>
                        <DialogDescription className="font-medium text-gray-500 mt-1">
                          You are reviewing this product as a verified owner.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="p-8 space-y-6">
                         <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Your Rating</Label>
                            <div className="flex gap-2">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <button
                                   key={star}
                                   type="button"
                                   onClick={() => setFormRating(star)}
                                   className={cn(
                                     "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                                     formRating >= star ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "bg-gray-100 text-gray-300 hover:bg-gray-200"
                                   )}
                                 >
                                   <Star className={cn("w-6 h-6", formRating >= star && "fill-current")} />
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-gray-400">Review Title</Label>
                            <Input 
                              id="title" 
                              placeholder="Summary of your experience" 
                              className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all font-bold"
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                            />
                         </div>

                         <div className="space-y-3">
                            <Label htmlFor="comment" className="text-xs font-black uppercase tracking-widest text-gray-400">Detailed Feedback</Label>
                            <Textarea 
                              id="comment" 
                              placeholder="Tell us what you loved or what could be improved..." 
                              className="min-h-[120px] rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all font-medium py-4"
                              value={formComment}
                              onChange={(e) => setFormComment(e.target.value)}
                            />
                         </div>
                      </div>
                      <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
                         <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl h-12 font-bold flex-1">
                            Cancel
                         </Button>
                         <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 font-black bg-gray-950 flex-1 gap-2 shadow-xl shadow-black/10">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
                            Publish Review
                         </Button>
                      </DialogFooter>
                    </form>
                 </DialogContent>
               </Dialog>
            ) : (
               <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-950 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Review Requirements
                  </div>
                  <p className="text-[11.5px] font-medium text-gray-500 leading-relaxed">
                    {eligibilityReason === 'already_reviewed' 
                      ? "You have already shared your thoughts on this device. Thank you for your contribution!" 
                      : eligibilityReason === 'unauthorized'
                        ? "Please log in to share your experience with this device."
                        : "Ratings are exclusive to verified owners. You can share your experience once your order has been delivered."}
                  </p>
                  {eligibilityReason === 'unauthorized' && (
                    <Button asChild variant="link" className="p-0 h-auto justify-start text-primary font-bold text-xs">
                      <a href="/login">Log In to Review</a>
                    </Button>
                  )}
               </div>
            )}
          </div>
        </div>

        {/* Simplified Review List */}
        <div className="md:col-span-8">
          <div className="flex items-center justify-between mb-10 pb-4 border-b">
             <h3 className="text-lg font-bold text-gray-900">
               Customer Feedback
             </h3>
             <div className="flex items-center gap-2 cursor-pointer group">
               <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">Sort: Newest First</span>
               <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
             </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-12">
              {reviews.map((review, index) => (
                <div key={review._id} className="animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                       <RatingStars rating={review.rating} size="sm" />
                       <span className="text-xs font-bold text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-black text-foreground">
                         {review.user?.name ? review.user.name.charAt(0) : <User className="w-4 h-4" />}
                       </div>
                       <p className="font-bold text-gray-950 text-sm leading-none">{review.user?.name || "Verified Customer"}</p>
                       {review.isVerified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tighter ml-auto bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                             <ShieldCheck className="w-3 h-3" /> Verified Purchase
                          </span>
                       )}
                    </div>

                    <div className="space-y-2">
                       <h4 className="font-bold text-gray-900 text-base tracking-tight">{review.title}</h4>
                       <p className="text-gray-600 text-[14.5px] leading-relaxed font-medium">
                         {review.comment}
                       </p>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                       <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-widest group">
                          <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Helpful (0)
                       </button>
                    </div>
                  </div>
                  {index < reviews.length - 1 && <Separator className="mt-12 bg-gray-50/80" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-4 bg-muted/10 rounded-3xl border-2 border-dashed border-muted-foreground/10">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
                 <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
               </div>
               <div className="max-w-xs mx-auto space-y-2">
                 <h4 className="text-xl font-bold text-gray-900">Be the first to review</h4>
                 <p className="text-muted-foreground font-medium text-sm leading-relaxed">No reviews yet for this device. Share your thoughts with the community!</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
