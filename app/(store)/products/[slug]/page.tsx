import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductGrid } from '@/components/products/product-grid';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_NAME } from '@/lib/constants';
import type { Product } from '@/types';

// Mock product data
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    description: 'The most powerful iPhone ever with A17 Pro chip. Features a stunning 6.7-inch Super Retina XDR display, titanium design, and the most advanced camera system in an iPhone. Capture stunning photos with the 48MP main camera and enjoy all-day battery life.',
    price: 199999,
    comparePrice: 219999,
    category: 'mobile-phones',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
    ],
    stock: 15,
    sku: 'IP15PM-256-NT',
    specifications: [
      { key: 'Display', value: '6.7" Super Retina XDR' },
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Storage', value: '256GB' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' },
      { key: 'Battery', value: '4422 mAh' },
      { key: 'OS', value: 'iOS 17' },
    ],
    features: [
      'A17 Pro chip for unprecedented performance',
      'Titanium design - strong yet lightweight',
      '48MP main camera with advanced computational photography',
      'Action button for quick access to features',
      'USB-C with USB 3 speeds',
      'All-day battery life',
    ],
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
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
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
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
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
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
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

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  // This will be replaced with actual API call
  return mockProducts.find((p) => p.slug === slug) || null;
}

async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  // This will be replaced with actual API call
  return mockProducts.filter((p) => p.category === category && p._id !== currentId).slice(0, 4);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${APP_NAME}`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category as string, product._id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
        className="mb-6"
      />

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Reviews ({product.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            {product.features.length > 0 && (
              <>
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="pt-6">
          {product.specifications.length > 0 ? (
            <div className="bg-muted rounded-lg p-6">
              <dl className="grid md:grid-cols-2 gap-4">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">{spec.key}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="text-muted-foreground">No specifications available.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Reviews functionality coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
