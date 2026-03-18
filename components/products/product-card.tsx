'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
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
      toast.success('Added to cart', {
        description: `${product.name} added to your cart`,
      });
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
    toast.success(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      { description: product.name }
    );
  };

  return (
    <>
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-500 rounded-[24px] border border-gray-100 bg-white/50 backdrop-blur-sm shadow-[0_4px_12px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] hover:border-primary/20',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`}>
          {/* Main Image and Top Actions Area */}
          <div className="relative aspect-square overflow-hidden bg-gray-50/50">
            {!imageError && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <svg className="w-12 h-12 text-gray-200" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              </div>
            )}

            {/* Float Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.comparePrice && product.comparePrice > product.price && (
                <div className="bg-[#E63946] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </div>
              )}
              {product.isFeatured && (
                <div className="bg-primary text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                  New
                </div>
              )}
            </div>

            {/* Wishlist Action overlay */}
            <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <Button
                variant="white"
                size="icon"
                className="h-10 w-10 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 border-none"
                onClick={handleToggleWishlist}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={cn('h-5 w-5', inWishlist && 'fill-[#E63946] text-[#E63946] group-hover:text-white group-hover:fill-white')} />
              </Button>
            </div>

            {/* Bottom Actions Overlay */}
            <div
              className={cn(
                'absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300',
                isHovered && 'translate-y-0 opacity-100'
              )}
            >
              <Button
                className="w-full h-11 rounded-xl font-bold shadow-xl border-none"
                disabled={outOfStock || inCart}
                onClick={handleAddToCart}
              >
                {inCart ? (
                  <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Go to Cart</span>
                ) : outOfStock ? (
                  'Out of Stock'
                ) : (
                  <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Add to Cart</span>
                )}
              </Button>
            </div>
          </div>

          {/* Product Detail Content Section */}
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                  {product.brand}
                </span>
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-1.5 group/rating">
                    <RatingStars rating={product.rating} reviewCount={0} size="xs" />
                    <span className="text-[11px] font-black text-gray-400 group-hover/rating:text-primary transition-colors">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-black text-[15px] leading-tight text-gray-950 line-clamp-2 min-h-[40px] group-hover:text-primary transition-transform duration-300 group-hover:translate-x-1 uppercase tracking-tight">
                {product.name}
              </h3>

              <div className="flex items-end justify-between mt-1">
                <PriceDisplay
                  price={product.price}
                  comparePrice={product.comparePrice}
                  size="lg"
                  className="font-black text-gray-950"
                  showDiscount={false}
                />
                
                {product.comparePrice && product.comparePrice > product.price && (
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                     Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                   </span>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </>
  );
}


