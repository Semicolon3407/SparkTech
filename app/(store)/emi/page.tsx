import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { CreditCard, Calendar, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `EMI & Finance Options | ${APP_NAME}`,
  description: `Find out about flexible EMI and financing options at ${APP_NAME} to buy your favorite tech.`,
};

export default function EMIPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'EMI / Finance' },
        ]}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 text-white bg-primary p-12 md:p-24 rounded-[60px] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
              Get It Now. <br/> Pay <span className="text-white/60 italic underline decoration-white/40 decoration-4">Monthly.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-medium max-w-lg mx-auto leading-relaxed">
              Experience the latest technology with our easy and flexible financing plans tailored to your needs.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { 
              title: '0% Interest EMI', 
              text: 'Pay 0% interest with leading banks across Nepal. Buy today and spread the cost with no extra charges over 6 to 12 months.',
              icon: CreditCard
            },
            { 
              title: 'Flexible Tenure', 
              text: 'Choose a tenure that fits your budget, ranging from 3 months up to 24 months, with easy monthly installments.',
              icon: Calendar
            },
          ].map((item) => (
            <div key={item.title} className="p-10 bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-primary/5 group hover:border-primary/20 transition-all duration-500">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 tracking-tight mb-4">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-12 rounded-[50px] border border-gray-100 mb-20">
          <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-10">Partnered Banks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70">
            {['Nabil Bank', 'NIC Asia', 'Everest Bank', 'Sanima Bank'].map((bank) => (
              <div key={bank} className="h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center font-black text-gray-400 text-sm italic tracking-widest text-center px-4">
                {bank} Logo Placeholder
              </div>
            ))}
          </div>
        </div>

        <div className="p-12 bg-white rounded-[50px] shadow-2xl shadow-primary/5 border border-gray-100 mb-20">
          <h3 className="text-2xl font-black text-gray-950 tracking-tight mb-8">What You Need to Apply</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Valid Citizenship ID or Passport',
              'Salary Certificate / Proof of Income',
              'Post-dated Cheques from Parent Bank',
              'Credit Card Statement (for credit card EMI)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-2xl flex-shrink-0 flex items-center justify-center text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-sm font-bold text-gray-950">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
