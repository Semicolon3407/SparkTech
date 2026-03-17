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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.slug}`}
              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            {item.variant && (
              <p className="text-sm text-muted-foreground mt-1">
                Variant: {item.variant}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.productId)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            max={item.stock}
            size="sm"
          />
          <div className="text-right">
            <PriceDisplay
              price={item.price * item.quantity}
              originalPrice={
                item.originalPrice
                  ? item.originalPrice * item.quantity
                  : undefined
              }
              size="sm"
            />
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                Rs. {item.price.toLocaleString()} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
