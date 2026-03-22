"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye, 
  Loader2, 
  AlertCircle,
  PackageSearch,
  Image as ImageIcon
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        toast.error(result.error || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("An error occurred while fetching products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${deleteId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search by name, SKU or brand..."
              className="pl-10 h-10 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="h-10 shadow-sm">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Product</th>
                  <th className="px-6 py-4 whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 whitespace-nowrap">Price</th>
                  <th className="px-6 py-4 whitespace-nowrap">Stock</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <Loader2 className="h-10 w-10 animate-spin text-primary" />
                         <p className="text-muted-foreground">Synchronizing inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                       <div className="flex flex-col items-center justify-center space-y-2 opacity-60">
                         <PackageSearch className="h-10 w-10 mb-2" />
                         <p>No products found. Add your first item!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-muted/30 transition-all group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-[250px]">
                          <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/40 shadow-sm">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground line-clamp-1">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10 tracking-tight">
                                 {product.brand}
                               </span>
                               <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">
                                 SKU: {product.sku || 'N/A'}
                               </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight bg-muted/30">
                           {typeof product.category === 'object' ? (product.category as any).name : String(product.category)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                           <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                           {product.comparePrice && product.comparePrice > product.price && (
                             <span className="text-[10px] text-muted-foreground line-through decoration-destructive/50">
                               {formatPrice(product.comparePrice)}
                             </span>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-xs font-bold",
                            product.stock === 0 ? "text-destructive" :
                            product.stock < 10 ? "text-orange-500" :
                            "text-foreground/70"
                          )}>
                            {product.stock} Units
                          </span>
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                             <div 
                               className={cn(
                                 "h-full rounded-full transition-all duration-500",
                                 product.stock === 0 ? "bg-destructive w-full" :
                                 product.stock < 10 ? "bg-orange-500 w-1/3" :
                                 "bg-emerald-500 w-full"
                               )} 
                             />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.isActive ? (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[11px] font-bold uppercase tracking-wider">Public</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                             <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                             <span className="text-[11px] font-bold uppercase tracking-wider">Draft</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Product Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.slug}`} target="_blank" className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <Link href={`/admin/products/edit/${product._id}`} className="cursor-pointer">
                                  <Edit className="w-4 h-4 mr-2" /> Edit Product
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium"
                              onClick={() => setDeleteId(product._id)}
                            >
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
          <div className="border-t border-border px-6 py-5 flex items-center justify-between bg-muted/10 tracking-tight">
            <span className="text-sm text-muted-foreground">
              Total <span className="font-bold text-foreground">{filteredProducts.length}</span> inventory items
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 shadow-sm">Previous</Button>
              <Button variant="outline" size="sm" className="h-8 shadow-sm">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="border-destructive/20 shadow-2xl">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
               <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Remove Product?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete the product listing and all associated media.
              This action cannot be undone and will affect live customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 font-medium">
            <AlertDialogCancel className="border-none hover:bg-muted">Discard</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash className="h-4 w-4 mr-2" />}
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
