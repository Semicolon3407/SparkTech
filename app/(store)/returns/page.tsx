import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { RefreshCcw, CheckCircle, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Return Policy | ${APP_NAME}`,
  description: `Find out about ${APP_NAME}'s return and exchange policies for electronics and gadgets.`,
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Return Policy' },
        ]}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-6">
            Hassle-Free <span className="text-primary">Returns</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Not happy with your purchase? We make it easy to return or exchange products within our policy guidelines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: RefreshCcw, title: '7 Days Return', text: 'Return most items within 7 days for a full refund or exchange.' },
            { icon: CheckCircle, title: 'Easy Process', text: 'Simple online or in-store return process with prompt updates.' },
            { icon: HelpCircle, title: '24/7 Support', text: 'Our customer support team is here to help with your return.' },
          ].map((item) => (
            <div key={item.title} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-black text-gray-950 tracking-tight mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-primary/5 border border-gray-100 mb-20">
          <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-8">Return Conditions</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-gray-600 font-medium leading-relaxed">
                Items must be in original condition, including all packaging, manuals, and accessories.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-gray-600 font-medium leading-relaxed">
                Electronics must not be activated (e.g., iPhones, laptops) or have personal data stored.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p className="text-gray-600 font-medium leading-relaxed">
                Software, downloadable content, and hygiene-related items (e.g., in-ear headphones) are not returnable once opened.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary p-12 rounded-[50px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Need to start a return?</h3>
            <p className="text-white/80 font-medium">Contact our support team or visit any of our stores.</p>
          </div>
          <div className="flex gap-4">
            <a href="/contact" className="px-8 py-4 bg-white text-primary rounded-2xl font-black tracking-tight hover:scale-105 transition-all inline-flex items-center gap-2">
              Start Return <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
