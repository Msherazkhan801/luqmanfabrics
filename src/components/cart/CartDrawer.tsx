'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Truck,
  Tag,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    totalAmount,
    itemCount,
  } = useCart();
  const { settings } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  if (!isCartOpen) return null;

  // Free shipping calculation
  const amountNeededForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    setCouponMessage({ text: res.message, isSuccess: res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-pearl-200 bg-pearl-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-charcoal-900 text-gold-400 rounded-full">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">Your Shopping Bag</h3>
                <p className="text-xs text-neutral-500">{itemCount} {itemCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-pearl-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-amber-50/80 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-amber-200/50 text-xs">
            <div className="flex items-center justify-between font-medium text-amber-950 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gold-600" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold">🎉 You unlocked FREE Delivery!</span>
                ) : (
                  <span>Add <strong>Rs. {amountNeededForFreeShipping.toLocaleString()}</strong> for Free Delivery</span>
                )}
              </span>
              <span className="font-bold text-gold-700">{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-pearl-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gold-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-pearl-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-pearl-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-neutral-800">Your bag is currently empty</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Explore our pure Swiss lawn, executive Boski, and chiffon formal fabrics.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-charcoal-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor.name}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                  {/* Product Image Thumbnail */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-pearl-100 shrink-0 border border-pearl-200">
                    <Image
                      src={item.selectedColor.image || item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={closeCart}
                          className="font-serif text-sm font-semibold text-neutral-900 hover:text-gold-600 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-neutral-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                        <span>•</span>
                        <span>{item.product.pieces}</span>
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-pearl-300 rounded-full bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor.name, item.quantity - 1)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-l-full hover:bg-pearl-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor.name, item.quantity + 1)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-r-full hover:bg-pearl-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 block">
                          Rs. {item.product.price.toLocaleString()} each
                        </span>
                        <span className="font-serif font-bold text-sm text-neutral-900">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-pearl-200 bg-pearl-50/50 space-y-3 sm:space-y-4">
              {/* Coupon Code Section */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedPromo}</strong> applied (-Rs. {discountAmount.toLocaleString()})</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:underline font-medium text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. LUQMAN10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs py-2 px-3 bg-white border border-pearl-300 rounded-lg uppercase placeholder:normal-case focus:outline-none focus:border-gold-400 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pearl-200 hover:bg-gold-400 hover:text-charcoal-900 text-neutral-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && !appliedPromo && (
                  <p className={`text-[11px] mt-1.5 ${couponMessage.isSuccess ? 'text-emerald-600' : 'text-red-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-pearl-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Nationwide Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 uppercase font-bold text-[11px]">Free Shipping</span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-pearl-200 pt-2 font-serif">
                  <span>Estimated Total</span>
                  <span className="text-gold-700">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-6 bg-charcoal-900 hover:bg-charcoal-800 text-white font-serif tracking-widest uppercase font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
