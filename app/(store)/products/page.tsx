import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { ProductPagination } from '@/components/products/product-pagination';
import { SortSelector } from '@/components/products/sort-selector';
import { APP_NAME, CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';


import { ProductService } from '@/lib/services/product-service';

export const metadata: Metadata = {
  title: 'All Products',
  description: `Browse all products at ${APP_NAME} - Mobile phones, Laptops, Audio devices, and Accessories`,
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const sort = (params.sort as any) || 'newest';
  
  const filters = {
    page,
    sort,
    category: params.category,
    brand: params.brands,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    search: params.search,
  };

  const { data: products, pagination } = await ProductService.getProducts(filters);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          ...(params.category ? [{ label: CATEGORIES.find(c => c.slug === params.category)?.name || params.category }] : [])
        ]}
        className="mb-12"
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-6 uppercase">
            {params.category 
              ? (CATEGORIES.find(c => c.slug === params.category)?.name || params.category)
              : params.search 
                ? `Search: "${params.search}"`
                : 'Our Collection'}
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Explore our curated selection of {pagination.total} high-performance electronics and premium gadgets.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex-1">
            <Suspense fallback={null}>
              <ProductFilters category={params.category} isMobileTrigger />
            </Suspense>
          </div>
          
          <div className="flex-1 md:flex-initial min-w-[160px]">
            <SortSelector currentSort={sort} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-4">
              Refine Search
            </h2>
            <Suspense fallback={null}>
              <ProductFilters category={params.category} />
            </Suspense>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            {products.length > 0 ? (
              <ProductGrid products={products} columns={3} />
            ) : (
              <div className="bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 py-32 px-6 text-center">
                <div className="max-w-xs mx-auto space-y-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">No products found</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <Button asChild variant="outline" className="rounded-xl h-12 px-8">
                    <a href="/products">View All Products</a>
                  </Button>
                </div>
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-20 flex justify-center border-t border-gray-100 pt-12">
              <ProductPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </div>
      </div>
    </div>

  );
}


