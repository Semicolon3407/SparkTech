'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface SortSelectorProps {
  currentSort: string;
}

export function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative inline-block w-[180px]">
      <select 
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-full h-11 px-4 py-2 appearance-none bg-white border border-gray-200 rounded-md text-[13px] font-bold text-gray-950 focus:outline-none focus:border-gray-950 transition-all pr-10 hover:border-gray-300"
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="popular">Most Popular</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}
