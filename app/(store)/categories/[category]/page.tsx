import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Pagination } from '@/components/shared/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, APP_NAME } from '@/lib/constants';
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
    _id: '7',
    name: 'OnePlus 12 16GB 512GB',
    slug: 'oneplus-12-16gb-512gb',
    description: 'Flagship killer',
    price: 89999,
    comparePrice: 99999,
    category: 'mobile-phones',
    brand: 'OnePlus',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    stock: 25,
    sku: 'OP12-16-512',
    specifications: [],
    features: [],
    rating: 4.4,
    reviewCount: 145,
    isFeatured: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'MacBook Air M3 15-inch',
    slug: 'macbook-air-m3-15-256gb',
    description: 'Supercharged by M3',
    price: 189999,
    comparePrice: 199999,
    category: 'laptops',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    stock: 10,
    sku: 'MBA-M3-15-256',
    specifications: [],
    features: [],
    rating: 4.9,
    reviewCount: 56,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    name: 'Dell XPS 15 OLED',
    slug: 'dell-xps-15-oled-i7',
    description: 'Stunning OLED display',
    price: 219999,
    comparePrice: 249999,
    category: 'laptops',
    brand: 'Dell',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    stock: 8,
    sku: 'XPS15-OLED-I7',
    specifications: [],
    features: [],
    rating: 4.5,
    reviewCount: 67,
    isFeatured: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Sony WH-1000XM5',
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
  {
    _id: '5',
    name: 'Apple AirPods Pro (2nd Gen)',
    slug: 'airpods-pro-2nd-gen',
    description: 'Rebuilt from the sound up',
    price: 34999,
    comparePrice: 39999,
    category: 'audio',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500'],
    stock: 50,
    sku: 'APP-2ND',
    specifications: [],
    features: [],
    rating: 4.7,
    reviewCount: 312,
    isFeatured: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '8',
    name: 'JBL Flip 6',
    slug: 'jbl-flip-6',
    description: 'Bold sound for every adventure',
    price: 14999,
    comparePrice: 17999,
    category: 'audio',
    brand: 'JBL',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    stock: 40,
    sku: 'JBL-FLIP6',
    specifications: [],
    features: [],
    rating: 4.3,
    reviewCount: 189,
    isFeatured: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

function getCategoryInfo(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

function getProductsByCategory(categorySlug: string): Product[] {
  return mockProducts.filter((p) => p.category === categorySlug);
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = getCategoryInfo(category);

  if (!categoryInfo) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${categoryInfo.name} - Shop ${APP_NAME}`,
    description: `Shop the best ${categoryInfo.name.toLowerCase()} at ${APP_NAME}. Quality products at competitive prices.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page = '1', sort = 'newest' } = await searchParams;

  const categoryInfo = getCategoryInfo(category);
  
  if (!categoryInfo) {
    notFound();
  }

  const products = getProductsByCategory(category);
  const currentPage = parseInt(page);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Categories', href: '/products' },
          { label: categoryInfo.name },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{categoryInfo.name}</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} products found
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Suspense fallback={null}>
            <ProductFilters category={category} />
          </Suspense>
          
          <Select defaultValue={sort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subcategories */}
      {categoryInfo.subcategories && categoryInfo.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryInfo.subcategories.map((sub) => (
            <span
              key={sub}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 cursor-pointer transition-colors"
            >
              {sub}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex gap-8">
        {/* Desktop Filters */}
        <Suspense fallback={null}>
          <ProductFilters category={category} />
        </Suspense>

        {/* Products */}
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductGrid
              products={products}
              emptyMessage={`No ${categoryInfo.name.toLowerCase()} found`}
            />
          </Suspense>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(products.length / 12)}
                onPageChange={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
