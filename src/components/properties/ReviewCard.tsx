import { Star } from "lucide-react";

interface ReviewCardProps {
  reviewerName: string;
  rating: number;
  date: string;
  comment: string;
}

export const ReviewCard = ({
  reviewerName,
  rating,
  date,
  comment,
}: ReviewCardProps) => {
  return (
    <div className="p-5 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* 1. Reviewer Info & Date */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar Circle */}
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-medium text-lg uppercase">
          {reviewerName.charAt(0)}
        </div>

        {/* Name and Date */}
        <div>
          <p className="text-sm font-medium text-stone-900">{reviewerName}</p>
          <p className="text-xs text-stone-500 font-light">
            {new Date(date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* 2. Stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "fill-stone-900 text-stone-900"
                : "fill-stone-200 text-stone-200"
            }`}
          />
        ))}
      </div>

      {/* 3. Comment */}
      <p className="text-sm text-stone-600 font-light leading-relaxed mt-3">
        {comment}
      </p>
    </div>
  );
};
