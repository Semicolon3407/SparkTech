import { Metadata } from 'next';
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { SearchBar } from '@/components/shared/search-bar';
import { EmptyState } from '@/components/shared/empty-state';
import { APP_NAME } from '@/lib/constants';
import type { Product } from '@/types';

// Mock products
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    description: 'The most powerful iPhone ever',
    price: 199999,
    comparePrice: 219999,
    category: 'mobile-phones',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500'],
    stock: 15,
    sku: 'IP15PM-256-NT',
    specifications: [],
    features: [],
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    description: 'Ultimate Galaxy experience',
    price: 179999,
    comparePrice: 189999,
    category: 'mobile-phones',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    stock: 20,
    sku: 'SGS24U-512',
    specifications: [],
    features: [],
    rating: 4.7,
    reviewCount: 89,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation',
    price: 39999,
    comparePrice: 44999,
    category: 'audio',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 30,
    sku: 'SONY-WH1000XM5',
    specifications: [],
    features: [],
    rating: 4.6,
    reviewCount: 203,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function searchProducts(query: string): Product[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  
  return {
    title: q ? `Search: ${q}` : 'Search Products',
    description: `Search for products at ${APP_NAME}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const results = searchProducts(q);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Search Products
        </h1>
        <SearchBar defaultValue={q} autoFocus />
      </div>

      {/* Results */}
      {q ? (
        <div>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {results.length > 0
                ? `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${q}"`
                : `No results found for "${q}"`}
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            {results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <EmptyState
                icon={Search}
                title="No products found"
                description="Try searching with different keywords or browse our categories."
              />
            )}
          </Suspense>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Start searching</h2>
          <p className="text-muted-foreground">
            Enter a product name, brand, or keyword to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}
