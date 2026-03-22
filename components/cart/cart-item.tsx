"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { PriceDisplay } from "@/components/shared/price-display";
import { useCart } from "@/contexts/cart-context";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(product._id);
    } else {
      updateQuantity(product._id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
             <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest text-center">No Image</span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(product._id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            max={product.stock}
            size="sm"
          />
          <div className="text-right">
            <PriceDisplay
              price={product.price * quantity}
              comparePrice={
                product.comparePrice
                  ? product.comparePrice * quantity
                  : undefined
              }
              size="sm"
            />
            {quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                Rs. {product.price.toLocaleString()} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
