import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Contact Us | ${APP_NAME}`,
  description: `Get in touch with ${APP_NAME} for support, inquiries, and technical service.`,
};

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+977-1-4XXXXXX',
    subValue: 'Monday - Friday, 9am - 6pm',
  },
  {
    icon: Mail,
    label: 'Email Support',
    value: 'support@sparktech.com',
    subValue: 'Response within 24 hours',
  },
  {
    icon: MapPin,
    label: 'Main Showroom',
    value: 'Civil Mall, Kathmandu, Nepal',
    subValue: 'Open 7 Days a Week',
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
        className="mb-12"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Have a question or need support? Our team of tech experts is ready to help you with anything you need.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-950 px-1">Full Name</label>
                    <Input placeholder="Enter your name" className="h-[60px] rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-primary/20 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-950 px-1">Email Address</label>
                    <Input type="email" placeholder="Enter your email" className="h-[60px] rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-950 px-1">Subject</label>
                  <Input placeholder="How can we help?" className="h-[60px] rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-primary/20 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-950 px-1">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..." 
                    className="min-h-[180px] rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-primary/20 transition-all font-medium p-4" 
                  />
                </div>
                <Button className="w-full h-[60px] rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Send Message <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">Contact Information</h2>
              <div className="space-y-4">
                {CONTACT_INFO.map((info) => (
                  <div key={info.label} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{info.label}</div>
                      <div className="text-sm font-bold text-gray-950 mb-1">{info.value}</div>
                      <div className="text-xs font-medium text-gray-500">{info.subValue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <h2 className="text-xl font-black text-gray-950 tracking-tight px-1">Connect with us</h2>
              <div className="flex gap-4">
                {[Instagram, Facebook, Youtube].map((Icon, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
