'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../lib/types';
import { INITIAL_STORE_SETTINGS } from '../lib/mockData';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor: { name: string; hex: string; image: string }, quantity?: number, customNotes?: string) => void;
  removeFromCart: (productId: string, colorName: string) => void;
  updateQuantity: (productId: string, colorName: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedPromo: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('luqman_fabrics_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedPromo = localStorage.getItem('luqman_fabrics_promo');
      if (savedPromo) {
        setAppliedPromo(savedPromo);
        if (savedPromo.toUpperCase() === 'LUQMAN10') setDiscountPercent(0.10);
        if (savedPromo.toUpperCase() === 'EID2026') setDiscountPercent(0.15);
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('luqman_fabrics_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Error saving cart to storage', e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (
    product: Product,
    selectedColor: { name: string; hex: string; image: string },
    quantity = 1,
    customNotes = ''
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.name === selectedColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (customNotes) updated[existingIndex].customNotes = customNotes;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedColor,
            quantity,
            customNotes,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, colorName: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor.name === colorName)));
  };

  const updateQuantity = (productId: string, colorName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorName);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedColor.name === colorName) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo('');
    setDiscountPercent(0);
    try {
      localStorage.removeItem('luqman_fabrics_cart');
      localStorage.removeItem('luqman_fabrics_promo');
    } catch (e) {}
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'LUQMAN10') {
      setAppliedPromo('LUQMAN10');
      setDiscountPercent(0.10);
      try { localStorage.setItem('luqman_fabrics_promo', 'LUQMAN10'); } catch(e){}
      return { success: true, message: '🎉 Coupon LUQMAN10 applied: 10% OFF discount added!' };
    }
    if (cleanCode === 'EID2026' || cleanCode === 'SHEWA15') {
      setAppliedPromo(cleanCode);
      setDiscountPercent(0.15);
      try { localStorage.setItem('luqman_fabrics_promo', cleanCode); } catch(e){}
      return { success: true, message: `🎉 Special Promo ${cleanCode} applied: 15% OFF discount added!` };
    }
    return { success: false, message: '❌ Invalid discount coupon code. Try LUQMAN10 or SHEWA15' };
  };

  const removePromoCode = () => {
    setAppliedPromo('');
    setDiscountPercent(0);
    try { localStorage.removeItem('luqman_fabrics_promo'); } catch(e){}
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountPercent);
  const discountedSubtotal = subtotal - discountAmount;
  
  // Free delivery rule: Free if subtotal >= 5000 PKR, else standard 250 PKR (or 0 if cart is empty)
  const shippingFee = cart.length === 0 ? 0 : discountedSubtotal >= INITIAL_STORE_SETTINGS.freeShippingThreshold ? 0 : INITIAL_STORE_SETTINGS.standardShippingFee;
  const totalAmount = cart.length === 0 ? 0 : discountedSubtotal + shippingFee;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(!isCartOpen),
        subtotal,
        shippingFee,
        discountAmount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
