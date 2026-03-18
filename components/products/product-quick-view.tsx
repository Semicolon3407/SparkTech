'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductGallery } from './product-gallery';
import { ProductInfo } from './product-info';
import type { Product } from '@/types';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl animate-in zoom-in-95 duration-300">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name} Quick View</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2">
          {/* Gallery with no main title to save space */}
          <div className="bg-gray-50/50 p-4 md:p-6 lg:p-8 flex items-center">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info wrapped in a scroll area */}
          <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8 lg:p-10 bg-white no-scrollbar">
            <ProductInfo product={product} isCompact={true} />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
