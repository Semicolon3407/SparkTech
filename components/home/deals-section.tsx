'use client';

import Link from 'next/link';
import { ArrowRight, Timer, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import type { Product } from '@/types';

interface DealsSectionProps {
  products: Product[];
  isLoading?: boolean;
}

export function DealsSection({ products, isLoading }: DealsSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20">
              <Percent className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Hot Deals</h2>
              <p className="text-muted-foreground">
                Limited time offers on popular products
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Deals refresh daily</span>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/products?deals=true">
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <ProductGrid products={products} isLoading={isLoading} columns={4} />
        
        <div className="mt-8 text-center sm:hidden">
          <Button asChild>
            <Link href="/products?deals=true">
              View All Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
