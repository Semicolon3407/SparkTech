"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types";
import { toast } from "sonner";

interface WishlistItemProps {
  item: Product;
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item, 1);
    removeFromWishlist(item._id);
    toast.success("Added to cart");
  };

  const isOutOfStock = item.stock === 0;

  return (
    <div className="flex gap-4 p-4 border border-border rounded-lg bg-card">
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={item.images?.[0] || ''}
          alt={item.name}
          fill
          className="object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromWishlist(item._id)}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove from wishlist</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceDisplay
            price={item.price}
            comparePrice={item.comparePrice}
            size="sm"
          />
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
