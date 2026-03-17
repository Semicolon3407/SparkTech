'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
  isLoading?: boolean;
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">
              Hand-picked products just for you
            </p>
          </div>
          
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/products?featured=true">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={products} isLoading={isLoading} columns={4} />
        
        <div className="mt-8 text-center sm:hidden">
          <Button asChild>
            <Link href="/products?featured=true">
              View All Featured Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
