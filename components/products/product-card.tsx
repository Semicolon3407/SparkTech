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
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

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
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageError && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Eye className="h-12 w-12" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
                Sale
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                Featured
              </span>
            )}
            {outOfStock && (
              <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              'absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 transition-opacity',
              isHovered && 'opacity-100'
            )}
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                inWishlist && 'fill-red-500 text-red-500'
              )}
            />
            <span className="sr-only">
              {inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            </span>
          </Button>

          {/* Quick add button */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent',
              'transform translate-y-full transition-transform duration-300',
              isHovered && 'translate-y-0'
            )}
          >
            <Button
              className="w-full"
              size="sm"
              disabled={outOfStock || inCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {inCart ? 'In Cart' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="sm"
              className="mb-2"
            />
          )}

          {/* Price */}
          <PriceDisplay
            price={product.price}
            comparePrice={product.comparePrice}
            size="md"
          />
        </CardContent>
      </Link>
    </Card>
  );
}
