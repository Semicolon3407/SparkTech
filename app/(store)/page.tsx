import { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { PromoSection } from '@/components/home/promo-section';
import { HomeTheatreSection, DroneShowcaseSection, CategoryBrowseSection } from '@/components/home/extended-sections';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Newsletter } from '@/components/home/newsletter';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { ProductService } from '@/lib/services/product-service';

export const metadata: Metadata = {
  title: `${APP_NAME} - Electronics Store Nepal`,
  description: APP_DESCRIPTION,
};

export default async function HomePage() {
  const { data: featuredProducts } = await ProductService.getProducts({ isFeatured: true, limit: 8 });

  return (
    <>
      <HeroSection />
      <PromoSection />
      <HomeTheatreSection />
      <DroneShowcaseSection />
      <CategoryBrowseSection />
      <FeaturedProducts products={featuredProducts} />
      <Newsletter />
      <WhatsAppButton />
    </>
  );
}

