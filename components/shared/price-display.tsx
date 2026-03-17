'use client';

import { formatPrice, calculateDiscount } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  comparePrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  comparePrice,
  size = 'md',
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const compareSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-foreground', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      
      {comparePrice && comparePrice > price && (
        <>
          <span className={cn('text-muted-foreground line-through', compareSizeClasses[size])}>
            {formatPrice(comparePrice)}
          </span>
          
          {showDiscount && discount > 0 && (
            <span className={cn(
              'bg-accent text-accent-foreground px-2 py-0.5 rounded-md font-medium',
              compareSizeClasses[size]
            )}>
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
