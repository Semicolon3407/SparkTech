'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  isCompact?: boolean;
}

const features = [
  { icon: Truck, text: 'Free delivery on orders over Rs. 5,000' },
  { icon: Shield, text: '1 Year Warranty' },
  { icon: RotateCcw, text: '7 Days Easy Return' },
];

export function ProductInfo({ product, isCompact = false }: ProductInfoProps) {
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
    <div className={cn("flex flex-col gap-8", isCompact && "gap-6")}>


      {/* Brand & Badge Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-primary bg-primary/5 px-4 py-1.5 rounded-full">
          {product.brand}
        </span>
        <div className="flex items-center gap-2">
          {outOfStock ? (
            <Badge variant="destructive" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none">Sold Out</Badge>
          ) : lowStock ? (
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none">
              Limited Stock
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none">
              In Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Name & Pricing */}
      <div className="space-y-4">
        <h1 className={cn(
          "font-black tracking-tight text-gray-950 leading-[0.95] uppercase",
          isCompact ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl lg:text-6xl"
        )}>
          {product.name}
        </h1>

        
        <div className="flex items-center gap-6">
          <RatingStars
            rating={product.rating}
            reviewCount={product.reviewCount}
            showValue
          />
          <Separator orientation="vertical" className="h-4 bg-gray-200" />
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
            Art. No: {product.sku}
          </span>
        </div>

        {!isCompact && (
          <div className="pt-4">
            <PriceDisplay
              price={product.price}
              comparePrice={product.comparePrice}
              size="xl"
              className="font-black text-gray-950"
            />
          </div>
        )}

        {isCompact && (
          <div className="pt-2">
            <PriceDisplay
              price={product.price}
              comparePrice={product.comparePrice}
              size="lg"
              className="font-black text-gray-950"
            />
          </div>
        )}

      </div>

      <Separator className="bg-gray-100" />

      {/* Action Area */}
      <div className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Select Quantity</span>
            {!outOfStock && <span className="text-[11px] font-bold text-gray-400">{product.stock} units available</span>}
          </div>
          
          <div className="flex items-center gap-4">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
              className="h-14 w-40 rounded-2xl border-gray-100 bg-gray-50/50"
            />
            
            <div className="flex flex-1 gap-3">
              <Button
                size={isCompact ? "default" : "lg"}
                className={cn(
                  "flex-1 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10 transition-all hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-primary/20",
                  isCompact ? "h-12" : "h-14"
                )}
                disabled={outOfStock || inCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inCart ? 'Go to Cart' : outOfStock ? 'Sold Out' : isCompact ? 'Add to Bag' : 'Add to Shopping Bag'}
              </Button>


              <Button
                size={isCompact ? "default" : "lg"}
                variant="outline"
                className={cn(
                  "rounded-2xl border-gray-100 transition-all active:scale-95",
                  isCompact ? "h-12 w-12" : "h-14 w-14",
                  inWishlist && "border-red-100 bg-red-50"
                )}
                onClick={handleToggleWishlist}
              >

                <Heart
                  className={cn(
                    'h-5 w-5 transition-colors',
                    inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  )}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Grid - Collapsed on compact */}
        {!isCompact && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-gray-100 py-8">
            {features.map((feature) => (
              <div key={feature.text} className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-2xl bg-gray-50 group">
                  <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight px-2">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sharing & Secondary Actions - Hidden on compact */}
      {!isCompact && (
        <div className="flex items-center justify-between pt-2">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share with friends
          </button>
          
          <div className="flex gap-4">
            <Link href="/shipping" className="text-[10px] font-bold text-gray-400 underline underline-offset-4 decoration-gray-200 hover:text-gray-950 transition-colors">Shipping Info</Link>
            <Link href="/returns" className="text-[10px] font-bold text-gray-400 underline underline-offset-4 decoration-gray-200 hover:text-gray-950 transition-colors">Return Policy</Link>
          </div>
        </div>
      )}
    </div>


  );
}
