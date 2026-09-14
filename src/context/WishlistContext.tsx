'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../lib/types';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('luqman_fabrics_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading wishlist', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('luqman_fabrics_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error('Error saving wishlist', e);
      }
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    try { localStorage.removeItem('luqman_fabrics_wishlist'); } catch(e){}
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
