'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/shared/pagination';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ProductPagination({ currentPage, totalPages }: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`, { scroll: true });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
