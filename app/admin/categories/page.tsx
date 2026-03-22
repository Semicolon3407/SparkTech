"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, Edit, Trash, Package, EyeOff } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_CATEGORIES = [
  { _id: "cat_001", name: "Mobiles", slug: "mobiles", products: 45, status: "active", parent: null },
  { _id: "cat_002", name: "Laptops", slug: "laptops", products: 28, status: "active", parent: null },
  { _id: "cat_003", name: "Earphones", slug: "earphones", products: 35, status: "active", parent: null },
  { _id: "cat_004", name: "Assessories", slug: "accessories", products: 52, status: "active", parent: null },
  { _id: "cat_005", name: "Smarthome", slug: "smarthome", products: 12, status: "hidden", parent: null },
];

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories] = useState(MOCK_CATEGORIES);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Organize your store's products with categories and subcategories"
      />

      <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <div key={category._id} className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Category Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="h-4 w-4 mr-2 text-muted-foreground" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive cursor-pointer">
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
                  {category.status === 'hidden' && (
                    <Badge variant="secondary" className="px-1.5 h-5 flex items-center gap-1">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  slug: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/{category.slug}</code>
                </p>
                <div className="flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                      <Package className="h-3.5 w-3.5" />
                      {category.products} Products
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
