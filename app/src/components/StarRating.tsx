import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, size = 16, interactive = false, onRate }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {stars.map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={star <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}
          />
        </button>
      ))}
    </div>
  );
}
