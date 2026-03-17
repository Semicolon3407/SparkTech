"use client";

import Link from "next/link";
import { ShoppingBag, Tag } from "lucide-react";
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
  const { items, subtotal, shipping, tax, total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    // TODO: Implement coupon logic
    if (couponCode.toLowerCase() === "save10") {
      setCouponApplied(true);
    }
  };

  const discount = couponApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - discount;

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
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (13% VAT)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {/* Coupon */}
        {couponApplied && (
          <div className="flex justify-between text-sm text-success">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Discount (10%)
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(finalTotal)}</span>
        </div>

        {/* Coupon Input */}
        {!couponApplied && (
          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="h-9"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyCoupon}
              disabled={!couponCode}
            >
              Apply
            </Button>
          </div>
        )}

        {couponApplied && (
          <div className="flex items-center justify-between bg-success/10 text-success text-sm px-3 py-2 rounded-lg">
            <span>Coupon SAVE10 applied!</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-success hover:text-success/80"
              onClick={() => {
                setCouponApplied(false);
                setCouponCode("");
              }}
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
