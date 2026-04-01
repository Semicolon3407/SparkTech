'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '9779816043599';
  const message = 'Hello SparkTech, I am interested in your products.';
  // Using whatsapp:// protocol to force open the app on mobile devices
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  const fallbackUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Try to open the app directly
    window.location.href = whatsappUrl;

    // Fallback to wa.me after a short delay if the app protocol fails to trigger
    setTimeout(() => {
      window.open(fallbackUrl, '_blank');
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2 group">
      <div className="bg-white text-gray-950 px-4 py-2 rounded-2xl text-sm font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 border border-emerald-100 mb-2 pointer-events-none">
        Chat with our support! 💬
      </div>
      <a
        href={whatsappUrl}
        onClick={handleClick}
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100"></span>
        <MessageCircle className="w-8 h-8 fill-white/20 relative z-10" />
      </a>
    </div>
  );
}
