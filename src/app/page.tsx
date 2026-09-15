'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/products/ProductCard';
import { CATEGORIES_DATA, TESTIMONIALS } from '../lib/mockData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  PhoneCall,
  Scissors,
  Award,
  CheckCircle2,
  Star,
  ChevronRight,
  Eye,
  ShoppingBag,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const { products, settings } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');

  const featuredProducts = products.filter((p) => p.featured);
  
  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <div className="bg-white overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-pearl-100 via-white to-pearl-50 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pearl-300/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Top Shimmer Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-gold-400/40 shadow-sm text-xs font-semibold uppercase tracking-widest text-gold-900 mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Spring & Summer 2026 Luxury Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-neutral-950 leading-[1.1] tracking-tight">
              Quality You Feel, <br className="hidden sm:inline" />
              <span className="gold-gradient-text italic font-normal">Style You Love.</span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Explore Pakistan's most prestigious unstitched fabrics. From original <strong>6-Pound Imperial Boski</strong> and crease-free Japanese Wash & Wear to handcrafted <strong>Swiss Voile Lawn</strong> and embroidered Chiffon wedding formals.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop?category=women-unstitched"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-charcoal-900 hover:bg-charcoal-800 text-white font-serif tracking-widest uppercase font-bold text-xs sm:text-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Shop Women's Lawn</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop?category=men-unstitched"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-gold-50 text-neutral-900 border border-gold-400/50 hover:border-gold-500 font-serif tracking-widest uppercase font-bold text-xs sm:text-sm rounded-full shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Men's Boski & Suits</span>
              </Link>
            </div>

            {/* WhatsApp live preview notice */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>100% Purity Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Truck className="w-4 h-4 text-gold-600" />
                <span>Free Delivery Above Rs. 5,000</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: {settings.displayWhatsApp}</span>
              </div>
            </div>
          </div>

          {/* Right Visual Composition (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Primary Hero Showcase Card */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 group">
              <Image
                src="/images/hero.jpg"
                alt="Luqman Fabrics Luxury Collection"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              {/* Floating Luxury Tag bottom */}
              <div className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gold-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 font-bold block">
                      Authentic Shewa Textiles
                    </span>
                    <h3 className="font-serif font-bold text-base text-neutral-900">
                      Imperial Boski & Swiss Lawn
                    </h3>
                  </div>
                  <Link
                    href="/shop"
                    className="p-2.5 bg-charcoal-900 text-gold-400 rounded-full hover:bg-gold-500 hover:text-charcoal-900 transition-colors shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute top-4 right-4 bg-charcoal-900/90 backdrop-blur-md text-gold-300 border border-gold-400/40 px-3.5 py-1.5 rounded-full text-xs font-serif font-bold shadow-lg flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                <span>Original Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SHOWCASE CARDS */}
      <section className="py-20 bg-white border-y border-pearl-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold-700 font-semibold block">
              Curated By Fabric Artisans
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950">
              Explore Our Signature Collections
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
              Carefully woven textiles for daily prestige, executive formalwear, and memorable festive celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-pearl-300 hover:border-gold-400/80 flex flex-col justify-end p-6"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-900/40 to-transparent transition-opacity duration-300" />

                <div className="relative z-10 space-y-1.5 text-white">
                  <span className="text-[11px] uppercase tracking-widest text-gold-300 font-mono font-medium block">
                    {cat.count}+ Fabric Varieties
                  </span>
                  <h3 className="font-serif text-2xl font-bold group-hover:text-gold-200 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-1">
                    {cat.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-gold-400 group-hover:translate-x-1 transition-transform">
                    <span>Discover Collection</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED & TRENDING FABRICS */}
      <section className="py-20 bg-pearl-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold-700 font-semibold block">
                Handpicked Favorites
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
                Trending Fabrics This Season
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: 'all', label: 'All Fabrics' },
                { id: 'women-unstitched', label: "Women's Lawn" },
                { id: 'men-unstitched', label: "Men's Boski & Suit" },
                { id: 'chiffon-luxury', label: 'Chiffon Formals' },
                { id: 'pure-cotton', label: 'Egyptian Cotton' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-charcoal-900 text-gold-400 shadow-md font-semibold'
                      : 'bg-white text-neutral-600 border border-pearl-300 hover:bg-pearl-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid or Clean Boutique Invitation */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-pearl-200 p-10 sm:p-14 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-pearl-100 text-gold-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-gold-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  New Spring/Summer Catalog Updating
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
                  Our artisans are cataloging luxury lawn & executive Boski pieces. Explore our signature categories or connect on WhatsApp for instant video previews.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-widest text-xs font-bold rounded-full shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Browse Collections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum Luqman Fabrics! I would like to inquire about your available unstitched fabrics.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-serif uppercase tracking-widest text-xs font-bold rounded-full shadow-md transition-all inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp Boutique</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 8).map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 4} />
                ))}
              </div>

              <div className="mt-14 text-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal-900 hover:bg-charcoal-800 text-white font-serif uppercase tracking-widest text-xs sm:text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <span>View Entire Fabric Catalog</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. WHATSAPP VIDEO PREVIEW & FABRIC ADVISORY BANNER */}
      <section className="py-16 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-wider border border-gold-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Video Draping & Texture Preview</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pearl-50">
                Inspect Fabric Quality Before We Dispatch
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                Want to check the real-life sheen, fall, or thread embroidery before ordering? Connect directly with our Shewa boutique team on WhatsApp for an instant HD video inspection.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum Luqman Fabrics! I would like to request a live video preview of your unstitched fabric collections.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-serif tracking-wider uppercase font-bold text-xs sm:text-sm rounded-2xl shadow-xl transition-all text-center flex items-center justify-center gap-2.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request WhatsApp Video ({settings.displayWhatsApp})</span>
              </a>

              <Link
                href="/shop"
                className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/20 text-pearl-100 font-semibold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold-700 font-semibold block">
              Customer Satisfaction
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
              Loved By Textile Connoisseurs Across Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-8 rounded-3xl bg-pearl-50 border border-pearl-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-gold-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-pearl-200">
                  <div className="font-serif font-bold text-base text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.location} • Verified Buyer</div>
                  <div className="text-[11px] font-mono text-gold-700 mt-1">Bought: {t.fabricBought}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP VIP & SHEWA STORE CALLOUT */}
      <section className="py-16 bg-pearl-100 border-t border-pearl-300">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl">
            <PhoneCall className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
            Join the Luqman Fabrics WhatsApp VIP Broadcast
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Get exclusive early access to limited Swiss Lawn drops, pure Boski shipments, seasonal sales, and live video previews before anyone else.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum! Please add me to the Luqman Fabrics VIP Broadcast for new fabric releases and discounts.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-xl transition-all"
          >
            <span>Join VIP WhatsApp List (+92 340 9797271)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
