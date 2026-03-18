import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Shield, ShieldCheck, Zap, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Extended Warranty | ${APP_NAME}`,
  description: `Protect your electronics with ${APP_NAME}'s comprehensive extended warranty and care plans.`,
};

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Extended Warranty' },
        ]}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 text-white bg-gray-950 p-12 md:p-24 rounded-[60px] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary opacity-20 -translate-y-1/2 -translate-x-1/2 rounded-full z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
              Premium <br/> <span className="text-primary italic underline decoration-primary/40 decoration-4">Protection</span>.
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
              Our comprehensive extended warranty plans provide complete peace of mind for your precious gadgets.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { 
              title: 'Extended Care+', 
              text: 'Up to 2 additional years of mechanical and electrical breakdown protection.',
              icon: ShieldCheck,
              variant: 'primary'
            },
            { 
              title: 'Accidental Covers', 
              text: 'Complete protection against liquid spillages and screen damages.',
              icon: Zap,
              variant: 'secondary'
            },
            { 
              title: 'Expert Support', 
              text: '24/7 technical assistance for all your hardware and software needs.',
              icon: HelpCircle,
              variant: 'outline'
            },
          ].map((item) => (
            <div key={item.title} className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-950/5 group hover:border-primary/20 transition-all duration-500 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/5 transition-all text-primary">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-950 tracking-tight mb-4">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="p-12 bg-gray-50 rounded-[50px] border border-gray-100 mb-20">
          <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight mb-10">Why Choose Our Protection Plans?</h3>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { title: 'Authorized Center', text: 'All repairs are performed by authorized service providers using genuine parts.' },
              { title: 'Cashless Repairs', text: 'No upfront costs or complex claim procedures at our service centers.' },
              { title: 'Device Pick-up', text: 'Free pick-up and drop-off facility for repair requests inside Kathmandu.' },
              { title: 'Full Transparency', text: 'Track your claim status in real-time through our online portal.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[15px] font-extrabold text-gray-950 mb-1">{item.title}</div>
                  <div className="text-sm font-medium text-gray-500 leading-relaxed">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-12 bg-white rounded-[50px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight">Got a new device?</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Protect it today with our premium plans.</p>
          </div>
          <a href="/contact" className="px-10 py-5 bg-primary text-white rounded-2xl font-extrabold tracking-tight hover:scale-105 transition-all inline-flex items-center gap-2 shadow-xl shadow-primary/20">
            Contact Support <ArrowRight className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
