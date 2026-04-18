import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { reviewService } from "../../api/reviewService";
import type { PropertyReviewSummaryDto } from "../../types/dtos";
import { ReviewCard } from "./ReviewCard";

interface PropertyReviewsProps {
  propertyId: string;
}

export const PropertyReviews = ({ propertyId }: PropertyReviewsProps) => {
  // 1. We need state to hold the summary, and an isLoading state
  const [summary, setSummary] = useState<PropertyReviewSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch the reviews inside useEffect
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getByProperty(propertyId);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [propertyId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6 text-stone-400 font-light">Loading reviews...</div>
    );
  }

  // Empty state
  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="pt-6 border-t border-stone-100 mt-6">
        <h2 className="text-lg font-medium text-stone-900 mb-4">Reviews</h2>
        <div className="flex flex-col items-center justify-center py-10 bg-stone-50 rounded-2xl border border-stone-100 gap-2">
          <MessageSquare className="w-8 h-8 text-stone-300" />
          <p className="text-stone-500 font-light">
            No reviews yet for this property.
          </p>
        </div>
      </div>
    );
  }

  // 3. Render the reviews
  return (
    <div className="pt-6 border-t border-stone-100 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-medium text-stone-900">Reviews</h2>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full">
          <Star className="w-4 h-4 fill-stone-900 text-stone-900" />
          <span className="text-sm font-medium text-stone-900">
            {summary.averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-stone-500 font-light">
            ({summary.totalReviews}{" "}
            {summary.totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summary.reviews.map((review) => (
          <ReviewCard
            key={review.id}
            reviewerName={review.guestFirstName}
            rating={review.rating}
            date={review.createdAt}
            comment={review.comment}
          />
        ))}
      </div>
    </div>
  );
};
