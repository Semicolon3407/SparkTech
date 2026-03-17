'use client';

import { ProductCard } from './product-card';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Package } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
  className,
  emptyMessage = 'No products found',
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={columns * 2} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={emptyMessage}
        description="Try adjusting your filters or check back later for new products."
      />
    );
  }

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4 md:gap-6', gridClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
