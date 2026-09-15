'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  Eye,
  Star,
  Sparkles,
  Check,
  Tag
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setQuickViewProduct } = useStore();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const [imgError, setImgError] = useState(false);

  const selectedColor = product.colors?.[selectedColorIndex] || product.colors?.[0] || { name: 'Standard', hex: '#000000', image: '' };
  const rawActiveImage = selectedColor.image || product.images?.[0] || '/images/hero.jpg';
  const activeImage = imgError ? '/images/hero.jpg' : rawActiveImage;
  const hoverImage = product.images?.[1] || activeImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const displaySrc = isHovered && hoverImage !== activeImage ? hoverImage : activeImage;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-pearl-300/80 hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-pearl-100">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          {/* Main Image */}
          <Image
            src={displaySrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={priority}
            unoptimized={displaySrc?.startsWith('data:')}
            onError={() => setImgError(true)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-semibold rounded-full shadow-sm backdrop-blur-md ${
                product.badge === 'Bestseller'
                  ? 'bg-charcoal-900 text-gold-300 border border-gold-400/30'
                  : product.badge === 'Sale'
                  ? 'bg-red-700 text-white'
                  : 'bg-white/95 text-neutral-900 border border-pearl-300'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-gold-400 text-charcoal-950 rounded-full shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Icon Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 shadow-sm ${
            isInWishlist(product.id)
              ? 'bg-red-50 text-red-600 scale-110'
              : 'bg-white/90 text-neutral-600 hover:text-red-500 hover:bg-white backdrop-blur-sm'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-white backdrop-blur-md text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-lg border border-pearl-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Fabric Type & Piece Specs */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="font-mono text-gold-700 tracking-wider uppercase truncate max-w-[65%]">
              {product.fabricType}
            </span>
            <span className="font-medium text-neutral-600 bg-pearl-100 px-2 py-0.5 rounded-full shrink-0">
              {product.pieces}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-gold-700 transition-colors">
            <h3 className="font-serif text-base font-semibold text-neutral-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-neutral-500">
            <div className="flex items-center text-gold-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-neutral-800">{product.rating}</span>
            <span className="text-[11px] text-neutral-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Color Swatches */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase text-neutral-400 font-mono mr-1">Color:</span>
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColorIndex(idx);
                }}
                className={`w-5 h-5 rounded-full border transition-all duration-200 relative ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-gold-500 ring-offset-1 scale-110'
                    : 'hover:scale-105 border-neutral-300'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Price & Add to Bag */}
        <div className="pt-2 border-t border-pearl-100 flex items-center justify-between gap-2">
          <div>
            <div className="font-serif text-lg font-bold text-neutral-900">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-neutral-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-sm ${
              !product.inStock
                ? 'bg-pearl-200 text-neutral-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-gold-400 group-hover:text-charcoal-950" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
