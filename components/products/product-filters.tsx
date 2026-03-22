'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  category?: string;
  isMobileTrigger?: boolean;
}

// Fixed attributes since we now use a simpler structure
const TOP_BRANDS = ['Apple', 'Samsung', 'Sony', 'JBL', 'Xiaomi', 'Dell', 'HP', 'Lenovo'];
const POPULAR_COLORS = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Graphite', 'Sage'];

export function ProductFilters({ category, isMobileTrigger = false }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const currentColors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const currentMinPrice = parseInt(searchParams.get('minPrice') || '0');
  const currentMaxPrice = parseInt(searchParams.get('maxPrice') || '500000');
  const inStock = searchParams.get('inStock') === 'true';

  const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice]);

  const updateFilters = (key: string, value: string | string[] | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
    
    params.set('page', '1');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleItem = (list: string[], item: string, key: string) => {
    const newList = list.includes(item) 
      ? list.filter(i => i !== item) 
      : [...list, item];
    updateFilters(key, newList);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    router.push(`?${params.toString()}`, { scroll: false });
    setPriceRange([0, 500000]);
  };

  const hasActiveFilters = currentBrands.length > 0 || currentColors.length > 0 || currentMinPrice > 0 || currentMaxPrice < 500000 || inStock;

  const FilterContent = () => (
    <div className="space-y-10 pb-20 lg:pb-0">
      {/* Category Selection (Only if not already on a category page) */}
      {!category && (
        <div className="space-y-5">
          <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400">Categories</h3>
          <div className="flex flex-col gap-3">
            {CATEGORIES.filter(c => c.slug !== 'on-sale').map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateFilters('category', cat.slug)}
                className={cn(
                  "text-[14px] font-bold text-left transition-colors",
                  searchParams.get('category') === cat.slug ? "text-primary" : "text-gray-600 hover:text-gray-900"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands Filter */}
      <div className="space-y-5">
        <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400">Popular Brands</h3>
        <div className="grid grid-cols-1 gap-3">
          {TOP_BRANDS.map((brand) => (
            <div key={brand} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleItem(currentBrands, brand, 'brands')}>
              <Checkbox 
                id={`brand-${brand}`} 
                checked={currentBrands.includes(brand)}
                className="rounded-md border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor={`brand-${brand}`} 
                className="text-[13.5px] font-bold text-gray-700 cursor-pointer group-hover:text-primary transition-colors"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* Price Filter */}
      <div className="space-y-5">
        <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400">Price Range</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-tighter">Min</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full h-11 px-3 border border-gray-200 rounded-xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            />
          </div>
          <span className="text-gray-300 mt-6">-</span>
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-tighter">Max</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
              className="w-full h-11 px-3 border border-gray-200 rounded-xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            />
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-11 rounded-xl text-[11px] font-extrabold uppercase tracking-widest border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
          onClick={() => {
            updateFilters('minPrice', String(priceRange[0]));
            updateFilters('maxPrice', String(priceRange[1]));
          }}
        >
          Check Range
        </Button>
      </div>

      <Separator className="bg-gray-100" />

      {/* Color Filter */}
      <div className="space-y-5">
        <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COLORS.map((color) => {
            const isSelected = currentColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleItem(currentColors, color, 'colors')}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-[11px] font-extrabold uppercase tracking-tight transition-all",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-lg" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                )}
              >
                {color}
              </button>
            )
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2">
        <div className="flex items-center space-x-3 group cursor-pointer py-2" onClick={() => updateFilters('inStock', !inStock)}>
          <Checkbox 
            id="inStock" 
            checked={inStock}
            className="rounded-md border-gray-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label 
            htmlFor="inStock" 
            className="text-[13.5px] font-bold text-gray-700 cursor-pointer group-hover:text-emerald-500 transition-colors"
          >
            Show In-Stock Only
          </Label>
        </div>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 text-[11px] font-extrabold uppercase tracking-widest"
          onClick={clearAllFilters}
        >
          <X className="w-3 h-3 mr-2" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  if (isMobileTrigger) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-11 border-gray-200 rounded-xl px-4 gap-2 text-[11px] font-extrabold uppercase tracking-widest">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
          <SheetHeader className="p-6 border-b text-left sticky top-0 bg-white z-10">
            <SheetTitle className="text-sm font-extrabold uppercase tracking-widest">Store Filters</SheetTitle>
          </SheetHeader>
          <div className="p-8">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <FilterContent />;
}
