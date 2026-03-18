import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductsPage from '../../products/page';
import { CATEGORIES } from '@/lib/constants';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Electronics & Gadgets`,
    description: `Shop the latest ${category.name} products at SparkTech. Best prices and official warranty.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // We reuse the ProductsPage component but force the category filter
  const resolvedSearchParams = await searchParams;
  const modifiedSearchParams = Promise.resolve({
    ...resolvedSearchParams,
    category: slug,
  });

  return <ProductsPage searchParams={modifiedSearchParams} />;
}

