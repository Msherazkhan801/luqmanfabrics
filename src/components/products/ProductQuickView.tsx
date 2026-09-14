'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FabricZoomMagnifier } from './FabricZoomMagnifier';
import { getProductInquiryWhatsAppUrl } from '../../lib/whatsapp';
import {
  X,
  ShoppingBag,
  Heart,
  Star,
  Sparkles,
  Scissors,
  Layers,
  Sun,
  ShieldCheck,
  Check,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

export const ProductQuickView: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const activeImage = selectedColor.image || product.images[0];

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-neutral-900 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image & Magnifier */}
        <div className="md:w-1/2 p-6 bg-pearl-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-pearl-200">
          <div className="relative aspect-[3/4] w-full max-h-[420px]">
            <FabricZoomMagnifier src={activeImage} alt={product.name} />
          </div>

          {/* Color Thumbnails */}
          <div className="flex items-center gap-2 pt-4 overflow-x-auto">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={() => setSelectedColorIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  selectedColorIndex === idx
                    ? 'border-gold-500 bg-gold-50 text-gold-950 font-semibold shadow-sm'
                    : 'border-pearl-300 bg-white text-neutral-600'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="truncate max-w-[90px]">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Fabric Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[550px] md:max-h-full space-y-6">
          <div>
            {/* Badges & SKU */}
            <div className="flex items-center justify-between gap-2 text-xs mb-2">
              <span className="font-mono text-gold-700 font-semibold uppercase tracking-wider">
                {product.sku}
              </span>
              <span className="bg-pearl-100 text-neutral-700 px-2.5 py-0.5 rounded-full font-medium">
                {product.pieces}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
              <div className="flex items-center text-gold-500">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-neutral-800">{product.rating}</span>
              <span>({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4 pt-3 border-t border-pearl-200">
              <span className="font-serif text-2xl font-bold text-neutral-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 leading-relaxed mt-3">
              {product.description}
            </p>

            {/* Fabric Specs Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-pearl-50 rounded-xl border border-pearl-200 text-xs text-neutral-700">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Cut Length:</span>
                <span className="font-medium text-neutral-800">{product.cutLength}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Season:</span>
                <span className="font-medium text-neutral-800">{product.features.season}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Feel & Softness:</span>
                <span className="font-medium text-neutral-800">{product.features.softness}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Weave Type:</span>
                <span className="font-medium text-neutral-800 truncate block">{product.features.weave}</span>
              </div>
            </div>
          </div>

          {/* Actions & Quantity */}
          <div className="space-y-4 pt-4 border-t border-pearl-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-pearl-300 rounded-xl bg-pearl-50 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-neutral-600 hover:text-neutral-900"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm text-neutral-900 font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-neutral-600 hover:text-neutral-900"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 rounded-xl font-serif text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  !product.inStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-gold-400" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors shadow-sm ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-pearl-300 text-neutral-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Quick WhatsApp Inquiry & Full Details Link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
              <a
                href={getProductInquiryWhatsAppUrl(product, selectedColor.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-semibold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Inquire on WhatsApp (+92 340 9797271)</span>
              </a>

              <Link
                href={`/product/${product.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="text-neutral-600 hover:text-gold-700 font-semibold flex items-center gap-1"
              >
                <span>View Full Fabric Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
