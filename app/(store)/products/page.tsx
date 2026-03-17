import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/shared/loading-skeleton';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Pagination } from '@/components/shared/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Products',
  description: `Browse all products at ${APP_NAME} - Mobile phones, Laptops, Audio devices, and Accessories`,
};

// Mock data - will be replaced with API
const mockProducts = [
  {
    _id: '1',
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    description: 'The most powerful iPhone ever with A17 Pro chip',
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
    description: 'Ultimate Galaxy experience with AI features',
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
    _id: '3',
    name: 'MacBook Air M3 15-inch 256GB',
    slug: 'macbook-air-m3-15-256gb',
    description: 'Supercharged by M3, stunningly thin',
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
  {
    _id: '5',
    name: 'Apple AirPods Pro (2nd Gen)',
    slug: 'airpods-pro-2nd-gen',
    description: 'Rebuilt from the sound up with H2 chip',
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
    _id: '6',
    name: 'Dell XPS 15 OLED i7 16GB 512GB',
    slug: 'dell-xps-15-oled-i7',
    description: 'Stunning OLED display with powerful performance',
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
    _id: '7',
    name: 'OnePlus 12 16GB 512GB',
    slug: 'oneplus-12-16gb-512gb',
    description: 'Flagship killer with Snapdragon 8 Gen 3',
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
    _id: '8',
    name: 'JBL Flip 6 Portable Speaker',
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
  const sort = params.sort || 'newest';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: 'Products' }]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground mt-1">
            {mockProducts.length} products found
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Suspense fallback={null}>
            <ProductFilters />
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

      {/* Content */}
      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <Suspense fallback={null}>
          <ProductFilters />
        </Suspense>

        {/* Products */}
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductGrid products={mockProducts} />
          </Suspense>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={5}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
