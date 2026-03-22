"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";

export default function AddProductPage() {
  return (
    <>
      <AdminHeader
        title="Add New Product"
        description="Create a new listing for your store's collection"
      />

      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
             <h2 className="text-xl font-bold text-foreground">Product Information</h2>
          </div>
        </div>

        <ProductForm />
      </div>
    </>
  );
}
