'use client';

import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export function TrustPillars() {
  const pillars = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders over Rs. 5,000',
    },
    {
      icon: ShieldCheck,
      title: '100% Genuine',
      description: 'Official Brand Warranty',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '7 Days Return Policy',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: '24/7 Dedicated Support',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-t border-b border-gray-100 mt-20">
      {pillars.map((pillar) => (
        <div key={pillar.title} className="flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
            <pillar.icon className="h-7 w-7 text-gray-400 group-hover:text-primary transition-colors" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-gray-950">
              {pillar.title}
            </h4>
            <p className="text-xs font-bold text-gray-400">
              {pillar.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
