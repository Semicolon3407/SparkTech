'use client';

import Link from 'next/link';
import { Smartphone, Laptop, Headphones, Cable, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const categories = [
  {
    name: 'Mobile Phones',
    slug: 'mobile-phones',
    description: 'Latest smartphones from top brands',
    icon: Smartphone,
    color: 'bg-blue-500/10 text-blue-600',
    count: '500+ Products',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Gaming, Business & Student laptops',
    icon: Laptop,
    color: 'bg-purple-500/10 text-purple-600',
    count: '200+ Products',
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Earphones, Earbuds & Headphones',
    icon: Headphones,
    color: 'bg-green-500/10 text-green-600',
    count: '300+ Products',
  },
  {
    name: 'Accessories',
    slug: 'mobile-accessories',
    description: 'Covers, Screen Guards & More',
    icon: Cable,
    color: 'bg-orange-500/10 text-orange-600',
    count: '1000+ Products',
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our wide selection of electronics and accessories
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={cn(
                    'p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110',
                    category.color
                  )}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    {category.count}
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
