'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row-reverse gap-6">
      {/* Main Feature Image */}
      <div className="relative flex-1 aspect-square bg-[#F8F9FA] rounded-[48px] overflow-hidden group border border-gray-100/50">
        {!images.length ? (
          <div className="h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs">
            No Image
          </div>
        ) : (
          <>
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - Feature ${selectedIndex + 1}`}
              fill
              className="object-contain p-12 transition-all duration-1000 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* Quick Actions overlay */}
            <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              <Button
                variant="white"
                size="icon"
                className="h-12 w-12 rounded-2xl shadow-2xl shadow-black/5 hover:bg-primary hover:text-white transition-all transform hover:scale-110 border-none"
                onClick={() => setIsZoomed(true)}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Controls */}
            {images.length > 1 && (
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  variant="white"
                  size="icon"
                  className="h-12 w-12 rounded-2xl shadow-2xl shadow-black/5 hover:translate-x-[-4px] active:scale-90 border-none"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="white"
                  size="icon"
                  className="h-12 w-12 rounded-2xl shadow-2xl shadow-black/5 hover:translate-x-[4px] active:scale-90 border-none"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
            
            {/* Index Badge */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                {selectedIndex + 1} <span className="text-gray-300 mx-1">/</span> {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Vertical/Horizontal Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-32 py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-square w-20 md:w-full rounded-[24px] overflow-hidden shrink-0 transition-all duration-500 border-2 bg-gray-50',
                selectedIndex === index
                  ? 'border-primary ring-4 ring-primary/5 scale-95 md:scale-100'
                  : 'border-transparent opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
              )}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-contain p-3"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Refined Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-none shadow-none">
          <DialogTitle className="sr-only">Zoom: {productName}</DialogTitle>
          <div className="relative w-full h-[80vh] flex items-center justify-center p-20">
            <Image
              src={images[selectedIndex]}
              alt={`${productName} Full View`}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="100vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
}
