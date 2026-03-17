"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils/format";
import type { PaymentMethodType } from "./payment-method";

interface OrderReviewProps {
  paymentMethod: PaymentMethodType;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    district: string;
    phone: string;
  };
}

export function OrderReview({ paymentMethod, shippingAddress }: OrderReviewProps) {
  const { items, subtotal, shipping, tax, total } = useCart();

  const codCharge = paymentMethod === "cod" ? 100 : 0;
  const finalTotal = total + codCharge;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Shipping Address Summary */}
        {shippingAddress && (
          <>
            <div className="text-sm">
              <p className="font-medium text-muted-foreground mb-1">Ship to:</p>
              <p className="font-medium">{shippingAddress.name}</p>
              <p className="text-muted-foreground">{shippingAddress.address}</p>
              <p className="text-muted-foreground">
                {shippingAddress.city}, {shippingAddress.district}
              </p>
              <p className="text-muted-foreground">{shippingAddress.phone}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (13% VAT)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          {codCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">COD Charge</span>
              <span>{formatPrice(codCharge)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(finalTotal)}</span>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
          <span>Secure Checkout</span>
          <span>|</span>
          <span>Easy Returns</span>
          <span>|</span>
          <span>24/7 Support</span>
        </div>
      </CardContent>
    </Card>
  );
}
