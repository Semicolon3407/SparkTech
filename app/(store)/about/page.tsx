import { Metadata } from 'next';
import Image from 'next/image';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us | ${APP_NAME}`,
  description: `Learn more about ${APP_NAME}, Nepal's leading electronics and gadget store.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'About Us' },
        ]}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-12 mt-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 mb-4 uppercase">
            Nepal&apos;s Premium Gadget Destination
          </h1>
          <p className="text-base text-gray-500 leading-relaxed font-medium">
            Since our inception, {APP_NAME} has been dedicated to bringing the latest and greatest technology to Nepal with a focus on quality, authenticity, and customer service.
          </p>
        </div>

        <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden mb-20 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"
            alt="Our Office"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We envision a Nepal where every technology enthusiast has access to the same global innovations as the rest of the world, without compromise. Our mission is to bridge the gap between global tech launches and local availability.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Every product sold at {APP_NAME} comes with a guarantee of authenticity. We partner directly with brands and authorized distributors to ensure our customers receive genuine products with official warranties.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-gray-100 mb-24">
          {[
            { label: 'Founded', value: '2015' },
            { label: 'Happy Customers', value: '50k+' },
            { label: 'Retail Stores', value: '4' },
            { label: 'Brands', value: '100+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
