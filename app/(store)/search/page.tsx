import { Metadata } from 'next';
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { SearchBar } from '@/components/shared/search-bar';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { APP_NAME } from '@/lib/constants';
import { ProductService } from '@/lib/services/product-service';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  
  return {
    title: q ? `Search results for "${q}"` : 'Search Products',
    description: `Search for the best electronics and gadgets at ${APP_NAME}.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  
  const { data: results, pagination } = q 
    ? await ProductService.getProducts({ search: q, limit: 20 })
    : { data: [], pagination: { total: 0 } };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Search' },
        ]}
        className="mb-10"
      />

      {/* Search Header Section */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-950 mb-6 font-sans">
          {q ? 'Search Results' : 'Search Our Catalog'}
        </h1>
        <p className="text-gray-500 mb-8 font-medium max-w-lg mx-auto">
          Find exactly what you&apos;re looking for among our thousand+ premium gadgets and electronics.
        </p>
        <div className="relative group max-w-xl mx-auto">
          <SearchBar defaultValue={q} autoFocus />
        </div>
      </div>

      {/* Results Section */}
      <div className="min-h-[400px]">
        {q ? (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
              <h2 className="text-lg font-bold text-gray-950">
                Found {pagination.total} result{pagination.total === 1 ? '' : 's'} for <span className="text-primary">&quot;{q}&quot;</span>
              </h2>
            </div>

            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              {results.length > 0 ? (
                <ProductGrid products={results} columns={4} />
              ) : (
                <div className="py-24 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Search className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-950">No products found</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We couldn&apos;t find any matches for your search. Try checking for typos or using broader keywords.
                    </p>
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-gray-100">
            <div className="max-w-sm mx-auto space-y-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Search className="h-12 w-12 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 tracking-tight">Ready to explore?</h2>
                <p className="text-gray-500 font-medium">
                  Enter a product name, brand, or category above to start your search.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommended for you - Optional additional section */}
      {!q && (
        <div className="mt-24 pt-16 border-t">
          <h3 className="text-2xl font-black text-gray-950 mb-10 tracking-tight">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Apple', 'Android', 'Audio', 'Laptops'].map((cat) => (
              <a 
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="group p-8 bg-white border border-gray-100 rounded-[24px] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all text-center"
              >
                <span className="text-lg font-bold text-gray-950 group-hover:text-primary transition-colors">{cat}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

