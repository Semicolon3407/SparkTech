"use client";

import Link from "next/link";
import { ShoppingBag, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils/format";
import { useState } from "react";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { 
    items, subtotal, shippingCost, tax, total, itemCount, 
    appliedCoupon, discountAmount, finalTotal, applyCoupon, removeCoupon 
  } = useCart();
  
  const [couponInput, setCouponInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
    setCouponInput("");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (13% VAT)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {/* Coupon */}
        {appliedCoupon && (
          <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1 font-medium">
              <Tag className="h-3 w-3" />
              Coupon ({appliedCoupon.discountPercent}%)
            </span>
            <span className="font-medium">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(finalTotal)}</span>
        </div>

        {/* Coupon Input */}
        {!appliedCoupon && (
          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              className="h-9 uppercase font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim() || isApplying}
            >
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </Button>
          </div>
        )}

        {appliedCoupon && (
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
            <span className="font-medium">Code {appliedCoupon.code} applied!</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:text-emerald-800 dark:hover:text-emerald-300"
              onClick={removeCoupon}
            >
              Remove
            </Button>
          </div>
        )}

        {/* Free Shipping Notice */}
        {subtotal < 5000 && (
          <p className="text-xs text-muted-foreground text-center">
            Add {formatPrice(5000 - subtotal)} more for free shipping
          </p>
        )}

        {showCheckoutButton && (
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        )}

        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <span className="text-xs text-muted-foreground">
            We accept: eSewa, Khalti, Cash on Delivery
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
