import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { RecommendationCard } from '@/components/products/recommendation-card';
import { ProductReviews } from '@/components/products/product-reviews';
import { APP_NAME, CATEGORIES } from '@/lib/constants';
import { ProductService } from '@/lib/services/product-service';
import { ReviewService } from '@/lib/services/review-service';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Separator } from '@/components/ui/separator';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

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
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categorySlug = typeof product.category === 'string' ? product.category : (product.category as any)?.slug;
  const categoryName = CATEGORIES.find(c => c.slug === categorySlug)?.name || categorySlug;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(categorySlug ? [{ label: categoryName, href: `/category/${categorySlug}` }] : []),
    { label: product.name, href: `/products/${product.slug}` },
  ];

  // Parallel data fetching for performance
  const [reviews, relatedProducts, featuredProducts] = await Promise.all([
    ReviewService.getProductReviews(product._id),
    ProductService.getRelatedProducts(categorySlug || 'general', product._id),
    ProductService.getProducts({ isFeatured: true, limit: 4 })
  ]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb items={breadcrumbItems} className="mb-10" />
        
        {/* Main Product Showcase */}
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 mb-24 items-start">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          
          <div className="lg:col-span-5 h-fit pt-2 lg:pl-4">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Ratings & Comments Section */}
        <div className="mb-24 border-t pt-16">
           <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-12">
             Ratings & Comments
           </h2>
           <ProductReviews 
              productId={product._id}
              reviews={reviews} 
              rating={product.rating} 
              reviewCount={product.reviewCount} 
           />
        </div>

        {/* Dynamic Recommendations - Section 1 */}
        {relatedProducts.length > 0 && (
          <section className="mb-24 border-t pt-16">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">
              Often Bought Together
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <RecommendationCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Recommendations - Section 2 */}
        {featuredProducts.data.length > 0 && (
          <section className="mb-24 border-t pt-16">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">
              Trending on SparkTech
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredProducts.data as any[]).map((featProduct) => (
                <RecommendationCard key={featProduct._id} product={featProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
