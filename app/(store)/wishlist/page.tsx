"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistItem } from "@/components/wishlist/wishlist-item";
import { EmptyState } from "@/components/shared/empty-state";
import { useWishlist } from "@/contexts/wishlist-context";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductService } from "@/lib/services/product-service";
import type { Product } from "@/types";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";

function WishlistPageContent() {
  const router = useRouter();
  const { wishlistIds, clearWishlist } = useWishlist();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchWishlistItems() {
      setIsLoading(true);
      if (wishlistIds.length > 0) {
        try {
          const res = await fetch("/api/products/batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: wishlistIds }),
          });
          const data = await res.json();
          if (mounted && data.success) {
            setItems(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist items:", error);
        }
      } else {
        if (mounted) {
          setItems([]);
        }
      }
      if (mounted) {
        setIsLoading(false);
      }
    }
    
    fetchWishlistItems();
    return () => { mounted = false; };
  }, [wishlistIds]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="py-12 flex justify-center">
          <p className="text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love by clicking the heart icon on any product. They'll appear here for easy access later."
          action={{
            label: "Explore Products",
            onClick: () => router.push("/products")
          }}
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
          <WishlistItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistPageContent />
    </ProtectedRoute>
  );
}
