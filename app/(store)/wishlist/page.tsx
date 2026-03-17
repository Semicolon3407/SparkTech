"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistItem } from "@/components/wishlist/wishlist-item";
import { EmptyState } from "@/components/shared/empty-state";
import { useWishlist } from "@/contexts/wishlist-context";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love by clicking the heart icon on any product. They'll appear here for easy access later."
          action={
            <Button asChild size="lg">
              <Link href="/products">Explore Products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearWishlist}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <WishlistItem key={item.productId} item={item} />
        ))}
      </div>
    </div>
  );
}
