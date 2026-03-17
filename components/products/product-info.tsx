'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Share2, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
}

const features = [
  { icon: Truck, text: 'Free delivery on orders over Rs. 5,000' },
  { icon: Shield, text: '1 Year Warranty' },
  { icon: RotateCcw, text: '7 Days Easy Return' },
];

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const inCart = isInCart(product._id);
  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (!outOfStock) {
      addItem(product, quantity);
      toast.success('Added to cart', {
        description: `${product.name} (${quantity}) added to your cart`,
      });
    }
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product._id);
    toast.success(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      { description: product.name }
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <span className="text-sm text-muted-foreground uppercase tracking-wider">
          {product.brand}
        </span>
      </div>

      {/* Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-balance">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <RatingStars
          rating={product.rating}
          reviewCount={product.reviewCount}
          showValue
        />
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm text-muted-foreground">
          SKU: {product.sku}
        </span>
      </div>

      {/* Price */}
      <PriceDisplay
        price={product.price}
        comparePrice={product.comparePrice}
        size="lg"
      />

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {outOfStock ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : lowStock ? (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Only {product.stock} left
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            In Stock
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground">{product.description}</p>

      <Separator />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Quantity:</span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={product.stock}
          />
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            disabled={outOfStock || inCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {inCart ? 'In Cart' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn(
                'h-5 w-5',
                inWishlist && 'fill-red-500 text-red-500'
              )}
            />
            <span className="sr-only">
              {inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="grid gap-3">
        {features.map((feature) => (
          <div key={feature.text} className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted">
              <feature.icon className="h-4 w-4 text-primary" />
            </div>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Specifications */}
      {product.specifications.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Specifications</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {product.specifications.map((spec) => (
                <div key={spec.key} className="contents">
                  <dt className="text-muted-foreground">{spec.key}</dt>
                  <dd className="font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}

      {/* Features List */}
      {product.features.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
