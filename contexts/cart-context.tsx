'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product, CartItem } from '@/types';
import { SHIPPING, TAX_RATE } from '@/lib/constants';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'techstore_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shippingCost = subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.standardCost;

  const tax = Math.round(subtotal * TAX_RATE);

  const total = subtotal + shippingCost + tax;

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product._id === product._id);
      
      if (existingItem) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((productId: string) => {
    return items.some((item) => item.product._id === productId);
  }, [items]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = items.find((item) => item.product._id === productId);
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
