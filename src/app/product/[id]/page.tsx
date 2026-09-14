'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../../context/StoreContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { FabricZoomMagnifier } from '../../../components/products/FabricZoomMagnifier';
import { ProductCard } from '../../../components/products/ProductCard';
import { getProductInquiryWhatsAppUrl } from '../../../lib/whatsapp';
import {
  ShoppingBag,
  Heart,
  Star,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  PhoneCall,
  Scissors,
  Check,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Sun,
  Droplets,
  Award
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, settings } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productId = params.id as string;
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'details' | 'care' | 'reviews'>('specs');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">Fabric Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">The requested fabric is currently unavailable.</p>
        <Link href="/shop" className="px-6 py-3 bg-charcoal-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
          Browse Fabric Catalog
        </Link>
      </div>
    );
  }

  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const allImages = [
    selectedColor.image,
    ...product.images.filter((img) => img !== selectedColor.image),
  ].filter(Boolean);

  const currentImage = allImages[selectedImageIndex] || allImages[0] || '/images/hero.jpg';

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gold-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href="/shop" className="hover:text-gold-700">Fabrics</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-gold-700 capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-semibold text-neutral-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4 sticky top-28">
            {/* Magnifier Viewport */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-md border border-pearl-300">
              <FabricZoomMagnifier src={currentImage} alt={product.name} zoomLevel={2.6} />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.badge && (
                  <span className="px-3 py-1 bg-charcoal-900/95 text-gold-300 border border-gold-400/40 text-xs font-mono uppercase tracking-widest font-semibold rounded-full shadow-lg">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-gold-400 text-charcoal-950 rounded-full shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-gold-500 ring-2 ring-gold-400/30'
                      : 'border-pearl-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details & Buy Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-gold-700 font-bold uppercase tracking-widest">
                  SKU: {product.sku}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  In Stock ({product.stock} suits available)
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3 text-xs text-neutral-500">
                <div className="flex items-center text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-neutral-800">{product.rating} / 5.0</span>
                <span>•</span>
                <span>{product.reviewCount} customer ratings</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-pearl-50 border border-pearl-200 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                  Retail Price (PKR)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-neutral-950">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-neutral-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-700 font-semibold block">
                  {product.price >= settings.freeShippingThreshold ? '✨ Free Nationwide Delivery' : '+ Rs. 250 Standard Delivery'}
                </span>
                <span className="text-[11px] text-neutral-500">Cash on Delivery Available</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase font-bold text-neutral-700">
                    Select Fabric Color: <span className="text-gold-800 font-serif font-bold ml-1">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColorIndex(idx);
                        setSelectedImageIndex(0);
                      }}
                      className={`flex items-center gap-1.5 sm:gap-2 p-1.5 pr-2.5 sm:pr-3 rounded-full border transition-all ${
                        selectedColorIndex === idx
                          ? 'border-gold-500 bg-gold-50/80 shadow-md ring-2 ring-gold-400/40'
                          : 'border-pearl-300 bg-white hover:bg-pearl-50'
                      }`}
                    >
                      <span
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-neutral-300 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-medium text-neutral-800">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cut Length Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3">
              <Scissors className="w-5 h-5 text-gold-700 shrink-0" />
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase font-mono text-neutral-500 font-bold block">
                  Suit Cut / Length:
                </span>
                <span className="text-xs font-semibold text-neutral-900">{product.cutLength}</span>
              </div>
            </div>

            {/* Quantity and Primary Actions */}
            <div className="space-y-3 sm:space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Stepper + Wishlist in a row on small mobile if needed */}
                <div className="flex items-center gap-3 justify-between sm:justify-start">
                  {/* Stepper */}
                  <div className="flex items-center border border-pearl-300 rounded-2xl bg-pearl-50 px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-neutral-600 hover:text-neutral-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 sm:px-4 font-bold text-sm text-neutral-900 font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-neutral-600 hover:text-neutral-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist Mobile Icon */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`sm:hidden p-3.5 rounded-2xl border transition-all shadow-sm ${
                      isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-pearl-300 text-neutral-600 hover:text-red-500'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 sm:py-4 px-6 rounded-2xl font-serif text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 sm:gap-3 shadow-xl hover:shadow-2xl ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-charcoal-900 hover:bg-charcoal-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist Desktop */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`hidden sm:flex p-4 rounded-2xl border transition-all shadow-sm ${
                    isInWishlist(product.id)
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-pearl-300 text-neutral-600 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Live Video / Fabric Inquiry Button */}
              <a
                href={getProductInquiryWhatsAppUrl(product, selectedColor.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Inquire & Request Video on WhatsApp</span>
              </a>
            </div>

            {/* Guarantee Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-pearl-200 text-center text-xs text-neutral-600">
              <div className="p-2.5 sm:p-3 bg-pearl-50 rounded-xl border border-pearl-200/80">
                <ShieldCheck className="w-4 h-4 text-gold-600 mx-auto mb-1" />
                <span className="font-semibold text-neutral-900 block text-[10px] sm:text-[11px]">100% Original</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-400">Direct From Shewa</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-pearl-50 rounded-xl border border-pearl-200/80">
                <Truck className="w-4 h-4 text-gold-600 mx-auto mb-1" />
                <span className="font-semibold text-neutral-900 block text-[10px] sm:text-[11px]">Doorstep COD</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-400">Fast 2-4 Days</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-pearl-50 rounded-xl border border-pearl-200/80">
                <RotateCcw className="w-4 h-4 text-gold-600 mx-auto mb-1" />
                <span className="font-semibold text-neutral-900 block text-[10px] sm:text-[11px]">7-Day Exchange</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-400">Hassle-Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Tabs */}
        <div className="mt-14 sm:mt-20 border-t border-pearl-200 pt-8 sm:pt-12">
          <div className="flex items-center gap-4 sm:gap-6 border-b border-pearl-200 pb-3 overflow-x-auto whitespace-nowrap">
            {[
              { id: 'specs', label: 'Fabric Specifications' },
              { id: 'details', label: 'Package Details' },
              { id: 'care', label: 'Washing & Care' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`font-serif text-sm sm:text-lg font-bold pb-2 transition-all relative shrink-0 ${
                  activeTab === tab.id
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="p-5 bg-pearl-50 rounded-2xl border border-pearl-200 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-pearl-200">
                    <span className="font-mono uppercase text-neutral-500">Fabric Composition</span>
                    <span className="font-semibold text-neutral-900">{product.fabricType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pearl-200">
                    <span className="font-mono uppercase text-neutral-500">Weave Pattern</span>
                    <span className="font-semibold text-neutral-900">{product.features.weave}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pearl-200">
                    <span className="font-mono uppercase text-neutral-500">Season Suitability</span>
                    <span className="font-semibold text-neutral-900">{product.features.season}</span>
                  </div>
                </div>

                <div className="p-5 bg-pearl-50 rounded-2xl border border-pearl-200 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-pearl-200">
                    <span className="font-mono uppercase text-neutral-500">Softness & Touch</span>
                    <span className="font-semibold text-neutral-900">{product.features.softness}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pearl-200">
                    <span className="font-mono uppercase text-neutral-500">Transparency</span>
                    <span className="font-semibold text-neutral-900">{product.features.transparency}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pearl-200">
                    <span className="font-mono uppercase text-neutral-500">Shrinkage Treatment</span>
                    <span className="font-semibold text-neutral-900">{product.features.shrinkage}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="max-w-3xl space-y-3">
                <p className="text-xs sm:text-sm text-neutral-600 mb-4">
                  Each package from Luqman Fabrics is carefully inspected, steam-pressed, and packed with original brand tags and mother-of-pearl buttons where applicable.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-800">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-3 bg-pearl-50 rounded-xl border border-pearl-200">
                      <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-neutral-700 bg-pearl-50 p-6 rounded-2xl border border-pearl-200">
                <h4 className="font-serif font-bold text-base text-neutral-900">Recommended Care for Longevity</h4>
                <ul className="space-y-2 list-disc list-inside text-neutral-600">
                  <li>Soak in lukewarm water for 15-20 minutes before first tailoring/stitching.</li>
                  <li>Do not bleach or use harsh chemical detergents on embroidered and dyed fabrics.</li>
                  <li>Wash colored and white fabrics separately to preserve pure brilliance.</li>
                  <li>Iron on medium heat inside-out to protect delicate zari, tilla, and sateen weaves.</li>
                  <li>Dry clean recommended for heavy embroidered chiffon and Banarasi raw silk.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl space-y-6">
                <div className="p-6 bg-pearl-50 rounded-2xl border border-pearl-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl font-serif font-bold text-neutral-950">{product.rating} / 5.0</div>
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-gold-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">Based on verified orders</p>
                  </div>

                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum Luqman Fabrics! I want to share my review for ${product.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-charcoal-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Submit WhatsApp Review
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Fabrics */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-pearl-200 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700 font-semibold block">
                Complete Your Wardrobe
              </span>
              <h2 className="font-serif text-3xl font-bold text-neutral-950">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
