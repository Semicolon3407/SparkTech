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
    colors?: string;
    discount?: string;
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
    colors: params.colors,
    discount: params.discount,
    search: params.search,
  };

  const { data: products, pagination } = await ProductService.getProducts(filters);


  return (
    <div className="container mx-auto px-4 py-2">
      {/* Centered Page Header */}
      <div className="text-center pt-6 pb-2 mb-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950 uppercase">
          {params.category 
            ? (CATEGORIES.find(c => c.slug === params.category)?.name || params.category)
            : params.search 
              ? `Search: "${params.search}"`
              : 'Our Collection'}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-10">
            <h2 className="text-[15px] font-extrabold uppercase tracking-[0.15em] text-gray-950 border-b border-gray-100 pb-4">
              Filter By:
            </h2>
            <Suspense fallback={null}>
              <ProductFilters category={params.category} />
            </Suspense>
          </div>
        </aside>

        {/* Gallery Content */}
        <div className="flex-1 min-w-0">
          {/* Results Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50/50">
            <p className="text-sm font-bold text-gray-950">
              Showing {products.length} {products.length === 1 ? 'results' : 'results'}
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Sort By</span>
                <SortSelector currentSort={sort} />
              </div>

              {/* Mobile Filter Button - only visible on mobile */}
              <div className="lg:hidden">
                <Suspense fallback={null}>
                  <ProductFilters category={params.category} isMobileTrigger />
                </Suspense>
              </div>
            </div>
          </div>

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
                  <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight">No products found</h3>
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


