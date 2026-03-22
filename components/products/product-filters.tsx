'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Check, Zap, Filter } from 'lucide-react';

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
    <div className="space-y-12 pb-20 lg:pb-0 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Category Selection */}
      {!category && (
        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" /> Collections
          </h3>
          <div className="flex flex-col gap-3">
            {CATEGORIES.filter(c => c.slug !== 'on-sale').map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateFilters('category', cat.slug)}
                className={cn(
                  "text-[14px] font-bold text-left py-2 px-3 rounded-xl transition-all hover:bg-gray-50",
                  searchParams.get('category') === cat.slug 
                    ? "text-primary bg-primary/5 shadow-sm shadow-primary/5" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands Filter */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Premium Brands</h3>
        <div className="grid grid-cols-1 gap-2">
          {TOP_BRANDS.map((brand) => (
            <div key={brand} className={cn(
              "flex items-center space-x-3 group cursor-pointer p-2 rounded-xl border border-transparent transition-all hover:bg-gray-50",
              currentBrands.includes(brand) && "bg-primary/5 border-primary/10"
            )} onClick={() => toggleItem(currentBrands, brand, 'brands')}>
              <Checkbox 
                id={`brand-${brand}`} 
                checked={currentBrands.includes(brand)}
                className="rounded-md border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor={`brand-${brand}`} 
                className={cn(
                  "text-[13px] font-bold cursor-pointer transition-colors",
                  currentBrands.includes(brand) ? "text-primary" : "text-gray-600 group-hover:text-gray-900"
                )}
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-100/60" />

      {/* Price Filter */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Budget Constraint</h3>
        <div className="flex flex-col gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Start</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full h-10 pl-8 pr-2 bg-white border border-gray-100 rounded-lg text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">End</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                  className="w-full h-10 pl-8 pr-2 bg-white border border-gray-100 rounded-lg text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-xl shadow-primary/5"
            onClick={() => {
              updateFilters('minPrice', String(priceRange[0]));
              updateFilters('maxPrice', String(priceRange[1]));
            }}
          >
            Apply Range
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-100/60" />

      {/* Color Filter */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Color Palette</h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COLORS.map((color) => {
            const isSelected = currentColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleItem(currentColors, color, 'colors')}
                className={cn(
                  "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
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
        <button 
          onClick={() => updateFilters('inStock', !inStock)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-500 group",
            inStock 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-md shadow-emerald-500/5 rotate-1" 
              : "bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:-rotate-1"
          )}
        >
          <div className="flex items-center gap-3">
             <div className={cn(
               "w-3 h-3 rounded-full transition-all",
               inStock ? "bg-emerald-500 animate-pulse scale-110" : "bg-gray-200"
             )} />
             <span className="text-[13px] font-bold uppercase tracking-tight">Active Inventory</span>
          </div>
          <Check className={cn("w-4 h-4 transition-all opacity-0", inStock && "opacity-100")} />
        </button>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all"
          onClick={clearAllFilters}
        >
          <X className="w-4 h-4 mr-2" /> Reset Refinements
        </Button>
      )}
    </div>
  );

  if (isMobileTrigger) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-11 border-gray-200 rounded-xl px-4 gap-2 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-black/5 hover:-translate-y-0.5 transition-all">
            <Filter className="h-4 w-4 text-primary" />
            Filter Feed
            {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] sm:w-[380px] p-0 overflow-y-auto border-r-0 shadow-2xl">
          <SheetHeader className="p-8 border-b text-left sticky top-0 bg-white/95 backdrop-blur-md z-20">
            <SheetTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <SlidersHorizontal className="w-4 h-4" /> Store Refinements
            </SheetTitle>
          </SheetHeader>
          <div className="p-10">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <FilterContent />;
}
