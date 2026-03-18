'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function HomeTheatreSection() {
  return (
    <section className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1593784991095-a205069470b6?w=2000"
        alt="Home Theatre Experience"
        fill
        className="object-cover"
        priority
      />
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center">
        <div className="max-w-3xl">
          <span className="text-[#E63946] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            OLIZ STUDIO
          </span>
          <h2 className="text-white text-5xl md:text-7xl font-black mb-6 leading-[0.9] tracking-tighter">
            Experience our <br />
            <span className="text-white">Home Theatre</span>
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-2xl">
            Experience cinema-level audio in the comfort of your home. Our curated collection of high-performance speakers, subwoofers, and amplifiers delivers rich, immersive sound engineered for home theatre perfection. Build the ultimate movie, music, and gaming setup with professional-grade audio made simple.
          </p>
          <Link
            href="/category/home-theatre"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63946] hover:bg-[#D62839] text-white font-bold rounded-md transition-all duration-300 active:scale-95"
          >

            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}

export function DroneShowcaseSection() {
  return (
    <section className="py-16 bg-[#FFF8F8] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 bg-[#E63946] text-white text-[11px] font-black uppercase tracking-widest rounded-md mb-8">
              NEW ARRIVAL
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-950 mb-8 leading-[0.9] tracking-tighter uppercase">
              ANTIGRAVITY <br />
              360° DRONE
            </h2>
            <div className="space-y-6 text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mb-10">
              <p>
                Antigravity Drones redefine aerial creativity with powerful performance, outstanding flight control, and stunning camera stability. Designed for both beginners and professionals, these drones deliver smooth 360° shots, high-definition video, obstacle sensing, and long-lasting battery life for uninterrupted adventures.
              </p>
              <p>
                Whether you're capturing travel moments, cinematic content, or exploring the skies for fun, Antigravity brings precision, safety, and innovation together in one smart flying experience which makes every flight effortless, immersive, and unforgettable.
              </p>
            </div>
            
            <div className="mb-10">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">STARTING AT</span>
              <div className="text-[#E63946] text-4xl md:text-5xl font-black tracking-tight">
                Rs. 2,45,000
              </div>
            </div>

            <Link
              href="/products/antigravity-drone"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63946] hover:bg-[#D62839] text-white font-bold rounded-md transition-all duration-300 active:scale-95"
            >
              View Products
            </Link>
          </div>

          {/* Image Composition */}
          <div className="order-1 lg:order-2 relative h-[400px] md:h-[550px]">
            {/* Background Image (Top Right) */}
            <div className="absolute top-0 right-0 w-[80%] h-[70%] rounded-2xl overflow-hidden shadow-2xl skew-y-1">
              <Image
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000"
                alt="Drone Pilot"
                fill
                className="object-cover"
              />
            </div>
            {/* Foreground Image (Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-[70%] h-[60%] rounded-2xl overflow-hidden shadow-2xl border-8 border-[#FFF8F8] -skew-y-1 z-20">
              <Image
                src="https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?w=1000"
                alt="Drone in flight"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating element or shadow decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#E63946]/5 to-transparent rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

const categories = [
  { name: 'Apple', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', href: '/category/apple' },
  { name: 'Android', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', href: '/category/android' },
  { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', href: '/category/audio' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', href: '/category/laptops' },
  { name: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', href: '/category/video-photography' },
  { name: 'Home Theatre', image: 'https://images.unsplash.com/photo-1535016120720-40c646bebbdc?w=400', href: '/category/home-theatre' },
  { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400', href: '/category/lifestyle' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1621330396173-e41da1bafe7d?w=400', href: '/category/accessories' },
  { name: 'On Sale', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', href: '/category/on-sale' },
  { name: 'EV', image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400', href: '/category/ev' },
];

export function CategoryBrowseSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-16 tracking-tighter text-gray-950">
          Browse Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg md:text-xl tracking-tight">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
