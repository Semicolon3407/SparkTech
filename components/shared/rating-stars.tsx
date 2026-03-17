'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 > 0;
          const fillPercentage = partial ? (rating % 1) * 100 : 0;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(index)}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform',
                !interactive && 'cursor-default'
              )}
            >
              {/* Background star */}
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-muted-foreground/30'
                )}
              />
              
              {/* Filled star overlay */}
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${fillPercentage}%` }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className={cn('text-muted-foreground ml-1', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
