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
}

const allBrands = [...new Set([...BRANDS.mobile, ...BRANDS.laptop, ...BRANDS.audio])];

export function ProductFilters({ category }: ProductFiltersProps) {
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
    <div className="space-y-6">
      {/* Categories */}
      {!category && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
            Categories
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateFilters('category', cat.slug)}
                className={cn(
                  'block w-full text-left py-1 text-sm hover:text-primary transition-colors',
                  searchParams.get('category') === cat.slug && 'text-primary font-medium'
                )}
              >
                {cat.name}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Separator />

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Price Range
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500000}
            step={1000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <Button size="sm" onClick={applyPriceRange} className="w-full">
            Apply Price
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Brands
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {allBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={currentBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Availability */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={inStock}
          onCheckedChange={(checked) => updateFilters('inStock', checked ? 'true' : null)}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-card rounded-lg border p-4">
          <h2 className="font-semibold mb-4">Filters</h2>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
