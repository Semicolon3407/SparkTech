"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";
import { ProductService } from "@/lib/services/product-service";
import type { Product } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      setIsLoading(true);
      // Simulating realistic backend fetch limits by pulling default index limit
      const response = await ProductService.getProducts({ limit: 50 });
      if (mounted) {
        setProducts(response.data);
        setIsLoading(false);
      }
    }
    loadProducts();
    return () => { mounted = false; };
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage your store's inventory and product listings"
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Product</th>
                  <th className="px-6 py-4 whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 whitespace-nowrap">Price</th>
                  <th className="px-6 py-4 whitespace-nowrap">Stock</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 rounded-tr-xl whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-muted-foreground">Loading products...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No products found. Adjust your search or add a new product.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-[200px]">
                          <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted border border-border">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <span className="text-[8px] font-bold text-gray-400">NO IMG</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {product.brand} • SKU: {product.sku || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-muted-foreground">
                        {String(product.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">{product.stock} in stock</span>
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="text-xs text-warning">Low stock</span>
                          )}
                          {product.stock === 0 && (
                            <span className="text-xs text-destructive">Out of stock</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.isActive ? (
                          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.slug}`} target="_blank" className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" /> View Storefront
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" /> Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer">
                              <Trash className="w-4 h-4 mr-2" /> Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/20">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
