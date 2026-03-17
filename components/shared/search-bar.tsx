'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Search products...',
  defaultValue = '',
  onSearch,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (onSearch) {
      onSearch(trimmedQuery);
    } else if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }, [query, onSearch, router]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        className="pl-10 pr-20"
      />
      
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      
      <Button
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2"
      >
        Search
      </Button>
    </form>
  );
}
