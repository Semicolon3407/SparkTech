'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product, CartItem } from '@/types';
import { SHIPPING, TAX_RATE } from '@/lib/constants';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  refreshCart: () => Promise<void>;
  appliedCoupon: { code: string; discountPercent: number; } | null;
  discountAmount: number;
  finalTotal: number;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'techstore_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; } | null>(null);

  // Load cart - Fetch from API if authenticated, local if not
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setItems(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to load cart from server:', error);
      }
    } else {
      setItems([]);
    }
    setIsHydrated(true);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, user]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  
  // 1. Calculate discount first and round it
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  // 2. Shipping Cost (calculated before discount to not lose free shipping)
  const shippingCost = subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.standardCost;
  
  // 3. Tax is calculated on the discounted subtotal 
  const tax = Math.round(discountedSubtotal * TAX_RATE);
  
  // 4. Totals
  const total = subtotal + shippingCost + Math.round(subtotal * TAX_RATE); // Raw total without discount
  const finalTotal = discountedSubtotal + shippingCost + tax; // Accurate final total

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: data.code, discountPercent: data.discountPercent });
        toast.success(`Coupon applied! ${data.discountPercent}% off your order.`);
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to apply coupon");
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  }, []);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please log in to your account to add items to your cart.',
        action: {
          label: 'Log In',
          onClick: () => router.push('/login')
        }
      });
      return;
    }

    const productId = product._id;
    const existingItem = items.find((item) => item.product._id === productId);
    const newQuantity = existingItem ? Math.min(existingItem.quantity + quantity, product.stock) : Math.min(quantity, product.stock);

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.data);
        toast.success('Added to bag', {
          description: `${product.name} added to your cart`
        });
      }
    } catch (error) {
      toast.error('Failed to update cart on server');
    }
  }, [items, isAuthenticated, router]);

  const removeItem = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        const res = await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' });
        if (res.ok) {
          setItems((prev) => prev.filter((item) => item.product._id !== productId));
        }
      } catch (error) {
        toast.error('Failed to remove item from server');
      }
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data.data);
        }
      } catch (error) {
        toast.error('Failed to update quantity on server');
      }
    }
  }, [isAuthenticated, removeItem]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await fetch('/api/cart', { method: 'DELETE' });
    }
    setItems([]);
  }, [isAuthenticated]);

  const isInCart = useCallback((productId: string) => {
    return items.some((item) => item.product?._id === productId);
  }, [items]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = items.find((item) => item.product?._id === productId);
    return item?.quantity || 0;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingCost,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        refreshCart,
        appliedCoupon,
        discountAmount,
        finalTotal,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
