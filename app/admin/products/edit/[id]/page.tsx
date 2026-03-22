"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { Product } from "@/types";
import { toast } from "sonner";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        // Wait, the API might be /api/admin/products/[id] or /api/products/[id]
        // Let's use the public one if available or the admin one
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          toast.error("Failed to load product");
        }
      } catch (error) {
        toast.error("Error fetching product data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  return (
    <>
      <AdminHeader
        title="Edit Product"
        description="Update your product details and stay updated in the user view"
      />

      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
             <h2 className="text-xl font-bold text-foreground">
               {isLoading ? "Loading..." : `Editing: ${product?.name}`}
             </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center border rounded-xl bg-card/50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : product ? (
          <ProductForm initialData={product} />
        ) : (
          <div className="p-12 text-center border rounded-xl bg-card">
            <p className="text-muted-foreground">Product not found.</p>
            <Button className="mt-4" asChild>
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
