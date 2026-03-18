import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductGrid } from '@/components/products/product-grid';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrustPillars } from '@/components/shared/trust-pillars';
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
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb - Clean & Small */}
        <Breadcrumb
          items={[
            { label: 'Shop All', href: '/products' },
            { label: product.category as string, href: `/category/${product.category}` },
            { label: product.name },
          ]}
          className="mb-12 opacity-60 hover:opacity-100 transition-opacity"
        />

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-20 mb-24">
          {/* Gallery: Span 8 for more presence */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          
          {/* Info: Span 4 for sticky scroll */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 h-fit">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Details & Specifications Area */}
        <div className="max-w-5xl mx-auto space-y-32">
          {/* Tabs Section */}
          <div className="border-t pt-20">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="flex items-center gap-12 border-b rounded-none h-auto p-0 bg-transparent mb-12">
                <TabsTrigger
                  value="description"
                  className="pb-4 text-xs font-extrabold uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all p-0"
                >
                  Highlights
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="pb-4 text-xs font-extrabold uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all p-0"
                >
                  Tech Specs
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="pb-4 text-xs font-extrabold uppercase tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all p-0"
                >
                  Reviews ({product.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 prose prose-lg prose-gray">
                    <h3 className="text-2xl font-extrabold uppercase tracking-tight text-gray-950 mb-6">Product Overview</h3>
                    <p className="text-lg leading-relaxed text-gray-600 font-medium">{product.description}</p>
                  </div>
                  
                  {product.features.length > 0 && (
                    <div className="md:col-span-1 space-y-6">
                      <h4 className="text-sm font-extrabold uppercase tracking-widest text-gray-950">Key Features</h4>
                      <ul className="space-y-4">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-sm font-bold text-gray-500 leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {product.specifications.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-8 ring-1 ring-gray-100 p-8 rounded-3xl bg-gray-50/30">
                    {product.specifications.map((spec) => (
                      <div key={spec.key} className="flex flex-col gap-2 group">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">{spec.key}</span>
                        <span className="text-sm font-bold text-gray-950">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed">
                    <p className="text-sm font-bold text-gray-400">No specifications found.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed flex flex-col items-center gap-4">
                  <h3 className="text-lg font-extrabold uppercase text-gray-950">Customer Voice</h3>
                  <p className="max-w-xs text-xs font-bold text-gray-400">Our review portal is being upgraded to serve you better. Check back soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Trust Section */}
          <TrustPillars />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="pb-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-gray-950">
                    Discover More
                  </h2>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#E63946]/50">Recommended picks from {product.category as string}</p>
                </div>
              </div>
              <ProductGrid products={relatedProducts} columns={4} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}


