import { useState } from "react";
import { Star, X } from "lucide-react";
import Button from "./Button";

interface ReviewModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onConfirm: (rating: number, comment: string) => void;
  onCancel: () => void;
}

export const ReviewModal = ({
  isOpen,
  isSubmitting,
  onConfirm,
  onCancel,
}: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = "Please select a star rating.";
    }
    
    const trimmedComment = comment.trim();
    if (trimmedComment.length === 0) {
      newErrors.comment = "Please share your experience.";
    } else if (trimmedComment.length > 500) {
      newErrors.comment = "Comment must be less than 500 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onConfirm(rating, trimmedComment);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setErrors({});
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-medium text-stone-900">Leave a Review</h3>
          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3 flex flex-col items-center">
            <p className="text-sm font-medium text-stone-700">How was your stay?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => {
                    setRating(star);
                    if (errors.rating) setErrors({ ...errors, rating: "" });
                  }}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      (hoveredRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-red-500 font-medium">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">
              Share your experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (errors.comment) setErrors({ ...errors, comment: "" });
              }}
              rows={4}
              placeholder="Tell us what you loved about this place..."
              className={`w-full p-3 bg-white border ${
                errors.comment ? "border-red-300 focus:ring-red-500" : "border-stone-200 focus:ring-stone-900"
              } rounded-xl text-sm focus:outline-none focus:ring-2 resize-none transition-shadow`}
            />
            {errors.comment ? (
              <p className="text-xs text-red-500 font-medium">{errors.comment}</p>
            ) : (
              <p className="text-xs text-stone-400 text-right">
                {comment.length}/500
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ReviewModal;
