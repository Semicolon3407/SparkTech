'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '9779800000000'; // Placeholder
  const message = 'Hello SparkTech, I am interested in your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group animate-bounce"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-white/20" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-950 px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
        Chat with us!
      </span>
    </a>
  );
}
