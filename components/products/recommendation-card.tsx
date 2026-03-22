'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  product: Product;
}

export function RecommendationCard({ product }: RecommendationCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart', {
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col h-full group">
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-[#f9f9f9] flex items-center justify-center p-6">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 min-h-[40px] leading-tight hover:text-red-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-red-600 font-bold text-[15px]">
            Rs {product.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-bold text-gray-500">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-[#b22a2a] hover:bg-[#8f2222] text-white rounded-md h-10 text-[11px] font-black uppercase tracking-widest mt-auto transition-all"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
