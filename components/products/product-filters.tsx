'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';

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

const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Space Gray', hex: '#71706E' },
];

const DISCOUNTS = [
  { label: '10% or more', value: '10' },
  { label: '20% or more', value: '20' },
  { label: '30% or more', value: '30' },
  { label: '50% or more', value: '50' },
];

export function ProductFilters({ category, isMobileTrigger = false }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const currentColor = searchParams.get('colors') || '';
  const currentDiscount = searchParams.get('discount') || '';
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

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    router.push(`?${params.toString()}`, { scroll: false });
    setPriceRange([0, 500000]);
  };

  const hasActiveFilters = currentBrands.length > 0 || currentMinPrice > 0 || currentMaxPrice < 500000 || inStock || currentColor || currentDiscount;

  const FilterContent = () => (
    <div className="space-y-10">
      {/* Price Filter */}
      <div className="space-y-5 pb-8 border-b border-gray-100">
        <h3 className="text-[15px] font-bold text-gray-950">Price</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">From</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full h-11 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <span className="text-gray-300 mt-6">-</span>
          <div className="flex-1 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">To</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
              className="w-full h-11 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-[11px] font-extrabold uppercase tracking-widest h-11 rounded-md border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          onClick={() => {
            updateFilters('minPrice', String(priceRange[0]));
            updateFilters('maxPrice', String(priceRange[1]));
          }}
        >
          Update Price
        </Button>
      </div>
    </div>
  );

  if (isMobileTrigger) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between px-4 h-11 border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter By
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[350px] p-6">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-left font-extrabold uppercase tracking-widest">Filter</SheetTitle>
          </SheetHeader>
          <FilterContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-[280px] shrink-0 hidden lg:block pr-8">
      <FilterContent />
    </div>
  );
}
