import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { MapPin, Phone, Clock, Search } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Our Locations | ${APP_NAME}`,
  description: `Find ${APP_NAME} stores near you in Kathmandu and throughout Nepal.`,
};

const STORES = [
  {
    name: 'Kathmandu Showroom',
    address: 'Civil Mall, 4th Floor, Kathmandu, Nepal',
    phone: '+977-1-4XXXXXX',
    hours: '10:00 AM - 8:00 PM (Daily)',
    isMain: true,
  },
  {
    name: 'Patan Outlet',
    address: 'Labim Mall, Lalitpur, Nepal',
    phone: '+977-1-5XXXXXX',
    hours: '11:00 AM - 7:00 PM (Daily)',
  },
  {
    name: 'Pokhara Store',
    address: 'Lakeside Main Road, Pokhara, Nepal',
    phone: '+977-61-4XXXXXX',
    hours: '10:00 AM - 7:30 PM (Daily)',
  },
  {
    name: 'Butwal Branch',
    address: 'Milanchowk, Butwal, Nepal',
    phone: '+977-71-4XXXXXX',
    hours: '9:30 AM - 6:30 PM (Sunday-Friday)',
  },
];

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Our Locations' },
        ]}
        className="mb-12"
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-950 mb-6">
            Find <span className="text-primary">Our Stores</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Experience the latest technology first-hand at our premium retail showrooms located across Nepal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {STORES.map((store) => (
            <div 
              key={store.name} 
              className={`p-10 rounded-[40px] border border-gray-100 bg-white shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/5 ${store.isMain ? 'ring-2 ring-primary ring-opacity-10' : ''}`}
            >
              {store.isMain && (
                <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-6">
                  Main Showroom
                </div>
              )}
              <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight mb-8">{store.name}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">Address</div>
                    <div className="text-[15px] font-bold text-gray-950 leading-relaxed">{store.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">Phone</div>
                    <div className="text-[15px] font-bold text-gray-950 leading-relaxed">{store.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">Opening Hours</div>
                    <div className="text-[15px] font-bold text-gray-950 leading-relaxed">{store.hours}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder Area */}
        <div className="h-[400px] bg-gray-100 rounded-[50px] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
          <div className="text-center relative z-10 px-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-primary group-hover:scale-110 transition-all">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight mb-4">Interactive Store Locator</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              Our interactive map is coming soon. In the meantime, you can find us at the addresses listed above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
