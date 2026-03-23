'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WishlistContextType {
  wishlistIds: string[];
  isLoading: boolean;
  addToWishlist: (productId: string, productName?: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string, productName?: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'techstore_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist - Fetch from API if authenticated, local if not
  const refreshWishlist = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWishlistIds(data.data.map((item: any) => 
               typeof item.product === 'string' ? item.product : item.product._id
            ));
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist from server:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setWishlistIds([]);
    }
    setIsHydrated(true);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist, user]);

  const addToWishlist = useCallback(async (productId: string, productName?: string) => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please log in to your account to save items to your wishlist.',
        action: {
          label: 'Log In',
          onClick: () => router.push('/login')
        }
      });
      return;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlistIds((prev) => [...new Set([...prev, productId])]);
        toast.success('Added to wishlist', {
          description: productName || 'Product saved to your favorites'
        });
      }
    } catch (error) {
      toast.error('Failed to update wishlist on server');
    }
  }, [isAuthenticated, router]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        const res = await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
        if (res.ok) {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          toast.success('Removed from wishlist');
        }
      } catch (error) {
        toast.error('Failed to remove item on server');
      }
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(async (productId: string, productName?: string) => {
    if (wishlistIds.includes(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId, productName);
    }
  }, [wishlistIds, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const clearWishlist = useCallback(async () => {
    setWishlistIds([]);
  }, []);

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
        clearWishlist,
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
