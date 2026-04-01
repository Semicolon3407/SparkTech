'use client';

import { ProductCard } from './product-card';
import type { Product } from '@/types';

interface RecommendationCardProps {
  product: Product;
  className?: string;
}

export function RecommendationCard({ product, className }: RecommendationCardProps) {
  return <ProductCard product={product} className={className} />;
}
