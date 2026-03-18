import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Truck, Clock, Shield, MapPin, CheckCircle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Shipping Policy | ${APP_NAME}`,
  description: `Get details about ${APP_NAME}'s shipping and delivery options across Nepal.`,
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shipping Policy' },
        ]}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-6">
            Reliable <span className="text-primary">Delivery</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            We deliver your favorite tech to your doorstep, anywhere in Nepal, with care and efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Truck, title: 'Inside Kathmandu', text: 'Within 24 Hours' },
            { icon: Clock, title: 'Outside Kathmandu', text: 'Within 2-4 Days' },
            { icon: Shield, title: 'Insured Shipping', text: 'Peace of Mind' },
            { icon: CheckCircle, title: 'Free Delivery', text: 'Orders Filtered' },
          ].map((item) => (
            <div key={item.title} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-[20px] shadow-sm flex items-center justify-center mb-6 text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest mb-2">{item.title}</h3>
              <p className="text-xs font-bold text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-primary/5 border border-gray-100 mb-20">
          <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-10">Delivery Methods</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center shrink-0">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-950 tracking-tight">Express Delivery (Inside Valley)</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Orders placed before 1 PM are eligible for same-day delivery. Orders after 1 PM will be delivered the next business day. Free for orders above Rs. 5000.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center shrink-0">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-950 tracking-tight">Standard Shipping (Outside Valley)</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  We use Nepal&apos;s leading logistics partners (e.g., Courier services) to ensure safe and timely delivery to all major cities including Pokhara, Butwal, and Biratnagar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
