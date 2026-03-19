import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductGrid } from '@/components/products/product-grid';
import { APP_NAME } from '@/lib/constants';
import { ProductService } from '@/lib/services/product-service';

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

  const relatedProducts = await ProductService.getRelatedProducts(product.category as string, product._id);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 mb-24 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          
          {/* Info */}
          <div className="lg:col-span-5 h-fit pt-2 lg:pl-4">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Often Bought Together */}
        {relatedProducts.length > 0 && (
          <section className="pb-24 border-t pt-10">
            <div className="mb-6">
              <h2 className="text-[22px] font-bold text-gray-900">
                Often Bought Together
              </h2>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}


