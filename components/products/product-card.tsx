'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { ProductQuickView } from './product-quick-view';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inCart = isInCart(product._id);
  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      addItem(product);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  return (
    <div className={cn("group block h-full", className)}>
      <div className="relative h-full flex flex-col overflow-hidden rounded-[32px] bg-white border border-gray-100 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-1">
        {/* Image Container Area */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8]">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            {!imageError && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                 <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">No Image Found</div>
              </div>
            )}
          </Link>

          {/* Action Badges - Top */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none z-10">
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="bg-white/95 backdrop-blur-md text-gray-950 text-[10px] font-bold tracking-tight px-3 py-1.5 rounded-full shadow-sm border border-gray-100/50">
                SALE {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </div>
            )}
            {product.isFeatured && (
              <div className="bg-primary text-white text-[10px] font-bold tracking-tight px-3 py-1.5 rounded-full shadow-sm">
                NEW SEASON
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute top-6 right-6 h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20",
              inWishlist ? "text-red-500" : "text-gray-400 hover:text-gray-950"
            )}
          >
            <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
          </button>

          {/* Quick Add Overlay Button */}
          <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30">
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock || inCart}
              className={cn(
                "w-full h-12 rounded-2xl font-bold text-[13px] tracking-tight shadow-2xl",
                inCart ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-950 hover:bg-gray-800"
              )}
            >
              {inCart ? (
                 <Check className="h-4 w-4 mr-2" strokeWidth={3} />
              ) : (
                 <ShoppingCart className="h-4 w-4 mr-2" strokeWidth={3} />
              )}
              {inCart ? 'In Your Bag' : outOfStock ? 'Sold Out' : 'Quick Add'}
            </Button>
          </div>
        </div>

        {/* Content Details Area - Now inside the card */}
        <Link href={`/products/${product.slug}`} className="flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
               {product.brand}
             </span>
             <div className="flex items-center gap-1.5">
               <RatingStars rating={product.rating} reviewCount={0} size="xs" />
               <span className="text-[11px] font-medium text-gray-400">({product.rating})</span>
             </div>
          </div>

          <h3 className="text-[14px] font-bold leading-snug text-gray-950 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-3 pt-1">
             <span className="text-lg font-bold text-gray-950">
               {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(product.price).replace('NPR', 'Rs.')}
             </span>
             {product.comparePrice && product.comparePrice > product.price && (
               <span className="text-[14px] text-gray-400 line-through">
                 {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(product.comparePrice).replace('NPR', 'Rs.')}
               </span>
             )}
          </div>
        </Link>
      </div>
    </div>
  );
}
