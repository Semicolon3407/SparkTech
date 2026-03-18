import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[400px]">

        {/* AR Glasses */}
        <Link href="/products/ar-glasses" className="relative group overflow-hidden rounded-2xl md:col-span-1 border border-border">
          <Image
            src="/images/ar-glasses.png"
            alt="AR Glasses"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
          <div className="absolute inset-x-0 top-8 px-6 flex flex-col items-center text-center z-10">
            <h2 className="text-white text-[26px] font-bold tracking-wide flex items-center justify-center gap-1.5">
              XREAL <span className="font-light">One Pro</span>
            </h2>
            <p className="text-white/90 text-[13px] mt-1 font-medium">AR Glasses</p>
          </div>
          <div className="absolute inset-x-0 bottom-8 px-6 text-center z-10">
            <p className="text-white/80 text-[13px] font-medium">
              Experience the <span className="font-bold text-white">Digital World</span>
            </p>
          </div>
        </Link>

        {/* Levoit */}
        <Link href="/products/purifier" className="relative group overflow-hidden rounded-2xl md:col-span-1 border border-border">
          <Image
            src="/images/air-purifier.png"
            alt="Levoit Air Purifiers"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
          <div className="absolute inset-x-0 top-10 px-6 flex flex-col items-center text-center z-10">
            <div className="relative inline-block">
              <h2 className="text-black text-5xl font-medium tracking-tighter">lěvoit</h2>
              <p className="text-black absolute -top-1 -right-16 text-[8px] font-bold tracking-tight whitespace-nowrap">
                Feels like Home
              </p>
            </div>
            <p className="text-black/60 text-sm mt-3 font-medium">Air Purifiers and Humidifiers</p>
          </div>
        </Link>

        {/* Antigravity Drone */}
        <Link href="/products/antigravity-drone" className="relative group overflow-hidden rounded-2xl md:col-span-1 border border-border">
          <Image
            src="/images/drone.png"
            alt="Drone"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
          <div className="absolute inset-x-0 top-10 px-6 text-center z-10">
            <h2 className="text-white/90 text-xl font-bold tracking-[0.2em] ml-1">ANTIGRAVITY</h2>
            <p className="text-[#FF4A00] text-4xl font-extrabold mt-2">Λ1</p>
            <p className="text-white/90 text-[11px] tracking-[0.3em] font-medium mt-2 ml-1">8K 360 DRONE</p>
          </div>
        </Link>

        {/* Dyson */}
        <Link href="/products/styler" className="relative group overflow-hidden rounded-2xl md:col-span-1 md:row-span-1 border border-border">
          <Image
            src="/images/hair-styler.png"
            alt="Dyson Airwrap"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          <div className="absolute inset-x-0 top-10 flex flex-col items-center text-center z-10">
            <h2 className="text-black text-2xl font-medium tracking-tight">dyson</h2>
            <h3 className="text-black text-4xl font-bold -mt-1 leading-none">airwrap</h3>
            <p className="text-black/80 text-[11px] mt-1.5 font-medium tracking-wide">co-anda 2x</p>
          </div>
        </Link>

        {/* iPhone 17 Pro */}
        <Link href="/products/iphone-15-pro-max-256gb" className="relative group overflow-hidden rounded-2xl md:col-span-2 md:row-span-1 bg-black border border-border flex items-center justify-center md:justify-end p-8 md:p-12">

          {/* Background image covering left side, fading out to right */}
          <div className="absolute inset-0 w-full md:w-[65%] z-0">
            <Image
              src="/images/iphone-pro.png"
              alt="iPhone 17 Pro"
              fill
              className="object-cover object-left opacity-60 md:opacity-90 group-hover:opacity-100 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 md:from-transparent via-black/80 to-black" />
          </div>

          {/* Content on the right */}
          <div className="relative z-10 flex flex-col items-center md:items-end text-center md:text-right max-w-[340px] w-full ml-auto mt-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[#FF9F43] text-[15px] font-semibold tracking-wide flex items-center gap-1">
                <span className="text-xl"></span> iPhone 17
              </span>
            </div>
            <h2 className="bg-gradient-to-br from-[#FFD1A9] via-[#FF9F43] to-[#B35D01] text-transparent bg-clip-text text-[70px] md:text-[90px] leading-[0.85] font-extrabold uppercase tracking-tighter mb-8">
              PRO
            </h2>

            <div className="space-y-4 w-full px-4 md:px-0">
              <div className="text-center">
                <p className="text-white/90 text-[11px] font-medium tracking-wide">Get Complimentary</p>
                <p className="text-white text-lg font-bold mt-1 tracking-wide">
                  SHIELD <span className="text-red-500">PRO</span>
                </p>
                <p className="text-white/50 text-[10px] mt-0.5">Greater Protection</p>
              </div>

              <div className="grid grid-cols-3 w-full border border-white/20 rounded-xl overflow-hidden backdrop-blur-md bg-white/5">
                <div className="text-center p-3">
                  <p className="text-white font-bold text-xs">2 Times</p>
                  <p className="text-white/60 text-[9px] leading-[1.3] mt-1.5">Front Screen<br />Replacement</p>
                </div>
                <div className="text-center p-3 border-l border-white/20">
                  <p className="text-white font-bold text-xs">2 Times</p>
                  <p className="text-white/60 text-[9px] leading-[1.3] mt-1.5">Back Glass<br />Replacement</p>
                </div>
                <div className="text-center p-3 border-l border-white/20">
                  <p className="text-white font-bold text-xs">1 Year</p>
                  <p className="text-white/60 text-[9px] leading-[1.3] mt-1.5">Extended<br />Warranty</p>
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <span className="text-white/40 text-sm font-light">+</span>
              </div>

              <div className="text-center py-2 border border-white/20 rounded-full w-full bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10">
                <span className="text-white/90 text-[11px] font-medium tracking-wide">20W Adapter</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
