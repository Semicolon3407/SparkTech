'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 md:p-2 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
        <Image
          src="/images/logo.png"
          alt="Spark Tech"
          width={48}
          height={48}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col -gap-0.5">
          <div className="flex items-center">
            <span className="text-lg md:text-2xl font-black tracking-tighter text-gray-950 flex items-center">
              SPARK
              <span className="text-[#4361EE] ml-1">TECH</span>
            </span>
          </div>
          <span className="text-[8px] md:text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.25em] leading-none mt-0.5">
            Digital Evolution
          </span>
        </div>
      )}
    </div>
  );
}
