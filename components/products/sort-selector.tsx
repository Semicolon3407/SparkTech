'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px] h-10 border-gray-100 bg-white font-bold text-[12px] rounded-xl hover:border-gray-200 transition-all shadow-sm">
        <SelectValue placeholder="Sort Products" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-gray-100 shadow-xl overflow-hidden">
        <SelectItem className="font-bold text-[12px] py-2.5 cursor-pointer" value="newest">Newest First</SelectItem>
        <SelectItem className="font-bold text-[12px] py-2.5 cursor-pointer" value="price-asc">Price: Low to High</SelectItem>
        <SelectItem className="font-bold text-[12px] py-2.5 cursor-pointer" value="price-desc">Price: High to Low</SelectItem>
        <SelectItem className="font-bold text-[12px] py-2.5 cursor-pointer" value="rating">Highest Rated</SelectItem>
        <SelectItem className="font-bold text-[12px] py-2.5 cursor-pointer" value="popular">Most Popular</SelectItem>
      </SelectContent>
    </Select>
  );
}
