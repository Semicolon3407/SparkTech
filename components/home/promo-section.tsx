'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Tag, Clock, LucideIcon } from 'lucide-react';

interface PromoCardProps {
  title: string;
  image: string;
  badgeContent: string;
  buttonText: string;
  href: string;
  badgeIcon?: LucideIcon;
  rotateBadge?: string;
}

function PromoCard({ 
  title, 
  image, 
  badgeContent, 
  buttonText, 
  href, 
  badgeIcon: BadgeIcon,
  rotateBadge = "rotate-0"
}: PromoCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-black h-[320px] md:h-[380px] shadow-2xl">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      {/* Top Left Badge */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.1em]">
        <Clock className="w-3.5 h-3.5" />
        Limited Time
      </div>
      
      {/* Top Right Badge */}
      <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E63946] text-white text-[13px] font-extrabold uppercase tracking-[0.05em] shadow-[0_8px_20px_rgba(230,57,70,0.4)] transform ${rotateBadge} transition-transform duration-500 group-hover:scale-110`}>
        {badgeContent}
        {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="absolute bottom-10 left-10 right-10">
        <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-6 leading-tight tracking-tight">{title}</h3>
        <Link
          href={href}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-[#E63946]/30 group/btn active:scale-95"
        >
          {buttonText}
          <Tag className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export function PromoSection() {
  return (
    <section className="py-12 md:py-16 bg-[#FFF8F8] relative overflow-hidden">
      {/* Decorative Stars */}
      <div className="absolute top-10 left-[15%] text-[#E63946] opacity-30 select-none animate-pulse">★</div>
      <div className="absolute top-40 left-[5%] text-[#E63946] opacity-20 select-none scale-150">★</div>
      <div className="absolute bottom-20 left-[10%] text-[#E63946] opacity-30 select-none scale-75">★</div>
      <div className="absolute top-10 right-[10%] text-[#E63946] opacity-30 select-none scale-125">★</div>
      <div className="absolute top-60 right-[5%] text-[#E63946] opacity-20 select-none animate-bounce delay-700">★</div>
      <div className="absolute bottom-10 right-[15%] text-[#E63946] opacity-30 select-none">★</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-[13px] font-extrabold uppercase tracking-[0.1em] mb-6 border border-[#E63946]/20">
            <Tag className="w-4 h-4" />
            Exclusive Offers
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-950 mb-6">
            Don't Miss Out
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium tracking-tight">
            Limited time deals on your favorite gadgets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-7xl mx-auto">
          <PromoCard 
            title="Open Box Collection"
            image="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1000"
            badgeContent="GRAB IT !!!"
            buttonText="Shop Now"
            href="/collections/open-box"
            rotateBadge="rotate-2"
          />
          <PromoCard 
            title="Sale Products"
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000"
            badgeContent="SALE"
            badgeIcon={Tag}
            buttonText="View Products"
            href="/products/sale"
            rotateBadge="-rotate-2"
          />
        </div>
      </div>
    </section>
  );
}
