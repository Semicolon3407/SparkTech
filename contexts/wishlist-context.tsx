'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './auth-context';

interface WishlistContextType {
  wishlistIds: string[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'techstore_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist - from API if authenticated, from localStorage if not
  const refreshWishlist = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWishlistIds(data.data.map((item: { product: string }) => item.product));
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        try {
          setWishlistIds(JSON.parse(saved));
        } catch {
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist, user]);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isAuthenticated]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) {
          setWishlistIds((prev) => [...prev, productId]);
        }
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
      }
    } else {
      setWishlistIds((prev) => [...prev, productId]);
    }
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
        }
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
      }
    } else {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (wishlistIds.includes(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [wishlistIds, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
