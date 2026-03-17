"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils/format";

export function MiniCart() {
  const { items, itemCount, total, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
            <div className="text-center">
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add some products to get started
              </p>
            </div>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary mt-auto">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Shipping and taxes calculated at checkout
              </p>
              <div className="grid gap-2">
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
