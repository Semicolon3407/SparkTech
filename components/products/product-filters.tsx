'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { BRANDS, CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  category?: string;
  isMobileTrigger?: boolean;
}

const allBrands = [...new Set([...BRANDS.mobile, ...BRANDS.laptop, ...BRANDS.audio])];

export function ProductFilters({ category, isMobileTrigger = false }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
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
    
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    updateFilters('brands', newBrands);
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange[0] > 0) {
      params.set('minPrice', String(priceRange[0]));
    } else {
      params.delete('minPrice');
    }
    if (priceRange[1] < 500000) {
      params.set('maxPrice', String(priceRange[1]));
    } else {
      params.delete('maxPrice');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    router.push(`?${params.toString()}`);
    setPriceRange([0, 500000]);
  };

  const hasActiveFilters = currentBrands.length > 0 || currentMinPrice > 0 || currentMaxPrice < 500000 || inStock;

  const FilterContent = () => (
    <div className="space-y-10">
      {/* Categories */}
      {!category && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
            <span className="text-sm font-black uppercase tracking-widest text-gray-950 group-hover:text-primary transition-colors">Categories</span>
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateFilters('category', cat.slug)}
                className={cn(
                  'block w-full text-left text-[15px] font-bold transition-all hover:translate-x-1',
                  searchParams.get('category') === cat.slug ? 'text-primary' : 'text-gray-500 hover:text-gray-950'
                )}
              >
                {cat.name}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
          <span className="text-sm font-black uppercase tracking-widest text-gray-950">Price Range</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6 space-y-6">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm font-black text-gray-950">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <Button size="sm" onClick={applyPriceRange} className="w-full h-11 rounded-xl shadow-lg border-none">
            Apply Price
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
          <span className="text-sm font-black uppercase tracking-widest text-gray-950">Brands</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <div className="grid gap-2">
            {allBrands.map((brand) => (
              <div key={brand} className="flex items-center gap-3">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={currentBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                  className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={`brand-${brand}`} className="text-[15px] font-bold text-gray-600 cursor-pointer hover:text-gray-950 transition-colors">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Availability */}
      <div className="flex items-center gap-3 py-2 border-t border-gray-100 mt-6 pt-6">
        <Checkbox
          id="in-stock"
          checked={inStock}
          onCheckedChange={(checked) => updateFilters('inStock', checked ? 'true' : null)}
          className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label htmlFor="in-stock" className="text-[15px] font-bold text-gray-950 cursor-pointer">
          In Stock Only
        </Label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] mt-4">
          <X className="h-3 w-3 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (isMobileTrigger) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 font-bold bg-white shadow-sm hover:bg-gray-50 text-gray-950">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Refine
            {hasActiveFilters && (
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-black">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] p-0 border-r-0 rounded-r-[32px] overflow-hidden">
          <SheetHeader className="p-6 border-b border-gray-100 bg-gray-50/50">
            <SheetTitle className="text-xl font-black uppercase tracking-tight">Refine Results</SheetTitle>
          </SheetHeader>
          <div className="p-6 h-full overflow-y-auto pb-20">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="space-y-8">
      <FilterContent />
    </div>
  );
}


