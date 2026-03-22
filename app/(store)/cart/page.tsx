"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/shared/empty-state";
import { useCart } from "@/contexts/cart-context";
import { Breadcrumb } from "@/components/shared/breadcrumb";

import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
  ];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
          action={{
            label: "Browse Products",
            onClick: () => router.push("/products")
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            {items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Button asChild variant="ghost">
              <Link href="/products" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
