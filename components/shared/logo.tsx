'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}


export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="Spark Tech"
      width={160}
      height={60}
      className={cn("h-10 w-auto md:h-12 object-contain", className)}
      priority
    />
  );
}


