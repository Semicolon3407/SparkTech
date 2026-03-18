import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Settings, MousePointer2, Smartphone, Laptop, Speaker, HelpCircle, ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Repair Services | ${APP_NAME}`,
  description: `Find expert repair services for iPhones, MacBooks, and all your electronics at ${APP_NAME}.`,
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Repair Services' },
        ]}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 text-white bg-slate-900 p-12 md:p-24 rounded-[60px] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400 opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
              Expert <br/> <span className="text-sky-400 italic underline decoration-sky-400/40 decoration-4">Repairs</span>.
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
              From cracked screens to complex hardware repairs, our expert technicians bring your favorite gadgets back to life.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { title: 'iPhone Repair', icon: Smartphone, color: 'bg-rose-500' },
            { title: 'MacBook Repair', icon: Laptop, color: 'bg-indigo-500' },
            { title: 'Audio Repair', icon: Speaker, color: 'bg-emerald-500' },
            { title: 'Software Help', icon: Settings, color: 'bg-amber-500' },
          ].map((service) => (
            <div key={service.title} className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-900/5 group hover:border-black/5 hover:scale-105 transition-all duration-500 text-center flex flex-col items-center">
              <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-${service.color.split('-')[1]}-500/20 text-white`}>
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest">{service.title}</h3>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="p-12 bg-gray-50 rounded-[50px] border border-gray-100 flex flex-col items-start gap-8">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-primary">
              <MousePointer2 className="h-8 w-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-gray-950 tracking-tight">On-Site Servicing</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Simple repairs like screen protectors and battery replacements can be done while you wait at our experience centers inside Civil Mall and Labim Mall.
              </p>
            </div>
          </div>
          <div className="p-12 bg-gray-50 rounded-[50px] border border-gray-100 flex flex-col items-start gap-8">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-primary">
              <HelpCircle className="h-8 w-8" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-gray-950 tracking-tight">Technical Diagnostics</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Experience mystery glitches or performance issues? Bring your device for a free diagnosis by our certified tech engineers.
              </p>
            </div>
          </div>
        </div>

        <div className="p-12 bg-white rounded-[50px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-gray-950 tracking-tight">Need a repair?</h3>
            <p className="text-gray-500 font-medium">Book your slot or find a nearby service center.</p>
          </div>
          <a href="/contact" className="px-10 py-5 bg-black text-white rounded-2xl font-black tracking-tight hover:scale-105 transition-all inline-flex items-center gap-2">
            Schedule Repair <ArrowRight className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
