'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Share2, Check, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface ProductInfoProps {
  product: Product;
  isCompact?: boolean;
}

export function ProductInfo({ product, isCompact = false }: ProductInfoProps) {
  const { addItem, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const inCart = isInCart(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (!outOfStock) {
      addItem(product, quantity);
      toast.success('Added to cart', {
        description: `${product.name} (${quantity}) added to your cart`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Name */}
      <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="text-[22px] font-bold text-primary">
          Rs {product.price.toLocaleString('en-IN')}
        </div>
        <p className="text-[13px] text-gray-400">
          Shipping is calculated at checkout
        </p>
      </div>

      {/* Choose Colour */}
      <div className="space-y-3 pt-2">
        <label className="text-sm font-semibold text-gray-700">Choose Colour</label>
        <div className="flex flex-wrap gap-2">
          {['Black', 'White', 'Sage', 'Mist Blue', 'Lavender'].map((color) => {
            const isSelected = color === 'Black';
            return (
              <button
                key={color}
                className={cn(
                  "px-4 py-2 text-[13px] font-medium rounded border transition-all flex items-center justify-center gap-1.5",
                  isSelected 
                    ? "border-primary text-gray-900" 
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                {color}
              </button>
            )
          })}
        </div>
      </div>

      {/* Choose Size */}
      <div className="space-y-3 pt-2">
        <label className="text-sm font-semibold text-gray-700">Choose Size</label>
        <div className="flex flex-wrap gap-2">
          {['256GB', '512GB'].map((size) => {
            const isSelected = size === '256GB';
            return (
              <button
                key={size}
                className={cn(
                  "px-4 py-2 text-[13px] font-medium rounded border transition-all flex items-center justify-center gap-1.5",
                  isSelected 
                    ? "border-primary text-gray-900" 
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <Separator className="my-2 bg-gray-100" />

      {/* Action Area */}
      <div className="flex items-center gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={product.stock}
          className="h-[46px] w-[110px] rounded border border-gray-200 bg-white"
        />
        
        <Button
          className={cn(
            "flex-1 rounded h-[46px] font-bold tracking-wide text-[13px] transition-all shadow-none uppercase",
            outOfStock ? "bg-[#F3F4F6] text-gray-400 hover:bg-[#F3F4F6]" : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
          disabled={outOfStock || inCart}
          onClick={handleAddToCart}
        >
          {inCart ? 'GO TO CART' : outOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
        </Button>
      </div>

      <Separator className="my-2 bg-gray-100" />

      {/* Description Accordion */}
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        <AccordionItem value="description" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-[15px] font-bold text-gray-900 flex justify-start gap-2">
            <Info className="w-[18px] h-[18px]" /> Description
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-[1.8] space-y-4 pt-4 pb-2 text-[13px]">
            <h3 className="text-base font-bold text-gray-900">
              6.1" Super Retina XDR, A19 Performance & 48MP Camera
            </h3>
            <p className="text-[13.5px]">
              The <strong>{product.name}</strong> delivers fast performance, beautiful photos, and all-day battery in a sleek, durable design. Its <strong>6.1" Super Retina XDR</strong> display is bright and color-accurate, while the <strong>A19 chip</strong> powers smooth gaming, creative apps, and on-device AI. A <strong>48MP main camera</strong> captures sharp detail with improved low-light, and a high-quality front camera keeps selfies natural. With <strong>USB-C, 5G, Wi-Fi</strong>, and <strong>UWB</strong>, plus iOS 26 features, it's a powerful everyday iPhone for work and play.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Metadata */}
      <div className="flex flex-col gap-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm w-20">Categories:</span>
          <div className="flex flex-wrap gap-2">
            {['Apple iPhones', 'Phones', 'Apple iPhone 17'].map(cat => (
              <span key={cat} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm w-20">Brand:</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
            {product.brand || 'Apple'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm w-20">SKU:</span>
          <span className="font-semibold text-gray-700 text-sm">
            {product.sku || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
