'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Feature Image */}
      <div className="relative aspect-[4/4.5] w-full bg-[#FAFAFA] overflow-hidden group">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Feature ${selectedIndex + 1}`}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Navigation Controls */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
            <button
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6 stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative border w-[120px] h-[120px] shrink-0 transition-all duration-200 bg-white cursor-pointer',
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-gray-200'
              )}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
