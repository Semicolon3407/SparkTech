'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Share2, Check, Info, X } from 'lucide-react';

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
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);

  const inCart = isInCart(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (!outOfStock) {
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
      }
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }

      addItem(product, quantity);
      toast.success('Added to cart', {
        description: `${product.name} (${quantity}) added to your cart`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      {/* Name */}
      <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="text-[22px] font-bold text-primary">
          Rs {product.price.toLocaleString('en-IN')}
        </div>
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
              Rs {product.comparePrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </span>
          </div>
        )}
        <p className="text-[13px] text-gray-400">
          Shipping is calculated at checkout
        </p>
      </div>

      {/* Choose Colour */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 pt-2">
          <label className="text-sm font-semibold text-gray-700">Choose Colour</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "px-4 py-2 text-[13px] font-bold rounded-lg border-2 transition-all flex items-center justify-center gap-1.5",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                  )}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Choose Size */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3 pt-2">
          <label className="text-sm font-semibold text-gray-700">Choose Size / Storage</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-4 py-2 text-[13px] font-bold rounded-lg border-2 transition-all flex items-center justify-center gap-1.5",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                  )}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <Separator className="my-2 bg-gray-100" />

      {/* Action Area */}
      <div className="flex items-center gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={product.stock}
          className="h-[46px] w-[110px] rounded-lg border border-gray-200 bg-white"
        />

        <Button
          className={cn(
            "flex-1 rounded-lg h-[46px] font-bold tracking-wide text-[13px] transition-all shadow-none uppercase",
            outOfStock ? "bg-[#F3F4F6] text-gray-400 hover:bg-[#F3F4F6]" : "bg-primary hover:bg-primary/90 text-primary-foreground transform active:scale-95"
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
            <p className="text-[13.5px]">
              {product.description}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Metadata */}
      <div className="flex flex-col gap-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm w-20">Category:</span>
          <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold">
            {product.category as string}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm w-20">Brand:</span>
          <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-100">
            {product.brand}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm w-20">SKU:</span>
          <span className="font-bold text-gray-500 text-sm tracking-widest">
            {product.sku}
          </span>
        </div>
      </div>
    </div>
  );
}
