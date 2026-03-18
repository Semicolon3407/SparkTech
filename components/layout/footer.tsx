'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Logo } from '@/components/shared/logo';


const footerLinks = {
  categories: [
    { label: 'Apple', href: '/category/apple' },
    { label: 'Android', href: '/category/android' },
    { label: 'Audio', href: '/category/audio' },
    { label: 'Lifestyle', href: '/category/lifestyle' },
    { label: 'Accessories', href: '/category/accessories' },
  ],
  support: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Locations', href: '/locations' },
    { label: 'EMI / Finance', href: '/emi' },
    { label: 'Extended Warranty', href: '/warranty' },
    { label: 'Repair Services', href: '/services' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Shipping Policy', href: '/shipping' },
  ],
};

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-5 w-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V13.3c0 2.15-1.29 4.18-3.39 4.88-2.15.7-4.64.13-6.22-1.51-1.58-1.65-2.03-4.27-1.12-6.32.91-2.03 3.19-3.32 5.4-3.15.11-.29.45-.19.67-.3V12c-1.14-.04-2.25.68-2.61 1.77-.36 1.08.06 2.37.98 3.03.92.65 2.22.56 3.06-.23.83-.8 1.1-2.14 1.1-3.23V.02h.27z"/>
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t pt-20">
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand and Newsletter */}
          <div className="space-y-8">
            <Link href="/" className="group inline-block">
              <Logo className="scale-125 origin-left" />

            </Link>

            
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Subscribe for Updates</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Be the first to know about new arrivals, sales, and exclusive store-only events.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="flex-1 bg-gray-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                />
                <button className="bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {[Instagram, Youtube, Facebook, TikTokIcon].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8">Categories</h4>
            <ul className="space-y-4">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[14px] text-gray-500 hover:text-primary transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8">Support & Services</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[14px] text-gray-500 hover:text-primary transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8">Get In Touch</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-gray-500 font-medium leading-relaxed">
                    Main Showroom: Civil Mall, Kathmandu, Nepal
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+977" className="text-sm text-gray-500 font-medium hover:text-primary transition-colors">+977-1-4XXXXXX</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:support@sparktech.com" className="text-sm text-gray-500 font-medium hover:text-primary transition-colors">support@sparktech.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-100 py-8 bg-gray-50/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-gray-400 font-medium">
            © {currentYear} <span className="text-gray-900 font-black">{APP_NAME.toUpperCase()}</span> . All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="text-[13px] text-gray-400 hover:text-primary transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
