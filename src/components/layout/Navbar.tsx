'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES_DATA } from '../../lib/mockData';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Truck,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, openCart, totalAmount } = useCart();
  const { wishlist } = useWishlist();
  const { settings, openTrackOrderModal } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll for sticky glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-pearl-300/80 py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-pearl-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left side: Hamburger Button (Categories Drawer) & Logo */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {/* Hamburger Button that slides categories in from left */}
              <button
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-pearl-300 hover:border-gold-500 bg-pearl-50/80 hover:bg-gold-50/50 text-neutral-900 transition-all duration-200 shadow-sm group"
                aria-label="Open Categories Menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800 group-hover:text-gold-700 transition-colors" />
                <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider font-sans">
                  Categories
                </span>
                <ArrowRight className="hidden sm:inline-block w-3.5 h-3.5 text-gold-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Brand Logo */}
              <Logo size="md" />
            </div>

            {/* Desktop Navbar Navigation: ONLY Home and About */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/"
                className={`text-xs sm:text-sm font-medium uppercase tracking-[0.18em] transition-all duration-200 relative py-1 ${
                  pathname === '/'
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-600 hover:text-gold-600'
                }`}
              >
                Home
                {pathname === '/' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-400 rounded-full" />
                )}
              </Link>

              <Link
                href="/about"
                className={`text-xs sm:text-sm font-medium uppercase tracking-[0.18em] transition-all duration-200 relative py-1 ${
                  pathname === '/about'
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-600 hover:text-gold-600'
                }`}
              >
                About
                {pathname === '/about' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-400 rounded-full" />
                )}
              </Link>
            </nav>

            {/* Right Action Icons: Search, WhatsApp, Wishlist, Shopping Bag */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 sm:p-2 text-neutral-700 hover:text-neutral-900 hover:bg-pearl-100 rounded-full transition-colors relative"
                aria-label="Search fabrics"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Button */}
              <Link
                href="/shop?view=wishlist"
                className="p-1.5 sm:p-2 text-neutral-700 hover:text-neutral-900 hover:bg-pearl-100 rounded-full transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gold-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-scaleIn">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* WhatsApp Quick Link */}
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-full transition-all"
                title="Chat on WhatsApp"
              >
                <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Shopping Bag / Cart */}
              <button
                onClick={openCart}
                className="flex items-center gap-1.5 sm:gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group"
                aria-label="Shopping Bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gold-400 text-charcoal-900 text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-xs font-medium tracking-wider uppercase font-sans">
                  {itemCount === 0 ? 'Bag' : `Rs. ${totalAmount.toLocaleString()}`}
                </span>
              </button>
            </div>
          </div>

          {/* Expandable Search Bar */}
          {isSearchOpen && (
            <div className="mt-2.5 pt-2.5 border-t border-pearl-200 flex items-center gap-2 sm:gap-3 animate-fadeIn">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search pure lawn, boski, wash & wear, embroidered chiffon, karandi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="w-full pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-pearl-50 border border-pearl-300 rounded-full focus:outline-none focus:border-gold-400 focus:bg-white transition-all"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-charcoal-900 bg-gold-400 hover:bg-gold-500 rounded-full transition-colors shrink-0"
              >
                Search
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 sm:p-2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* LEFT-SIDE SLIDING CATEGORIES DRAWER (HAMBURGER MENU) */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setIsCategoryDrawerOpen(false)}
          />

          {/* Sliding Panel From Left */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInLeft">
              {/* Header */}
              <div className="p-6 border-b border-pearl-200 bg-pearl-50 flex items-center justify-between">
                <Logo size="sm" />
                <button
                  onClick={() => setIsCategoryDrawerOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-pearl-200 transition-colors"
                  aria-label="Close categories menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Links List */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-700 font-bold block mb-3">
                    Fabric Categories
                  </span>

                  <div className="space-y-1.5">
                    {[
                      {
                        name: "Women's Luxury Lawn",
                        subtitle: "Swiss Voile & Thread Embroidery",
                        href: "/shop?category=women-unstitched",
                        icon: "🌸",
                      },
                      {
                        name: "Men's Boski & Suits",
                        subtitle: "6-Pound Boski & Wash & Wear",
                        href: "/shop?category=men-unstitched",
                        icon: "👔",
                      },
                      {
                        name: "Chiffon Formals",
                        subtitle: "Handcrafted Zari & Sequins",
                        href: "/shop?category=chiffon-luxury",
                        icon: "👗",
                      },
                      {
                        name: "Pure Egyptian Cotton",
                        subtitle: "Supima & Giza 100/2",
                        href: "/shop?category=pure-cotton",
                        icon: "🧵",
                      },
                      {
                        name: "Winter Karandi & Khaddar",
                        subtitle: "Textured Shawl Suits",
                        href: "/shop?category=karandi-winter",
                        icon: "❄️",
                      },
                      {
                        name: "Festive Silk & Jacquard",
                        subtitle: "Banarasi Raw Silk & Zari",
                        href: "/shop?category=festive-silk",
                        icon: "✨",
                      },
                    ].map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setIsCategoryDrawerOpen(false)}
                        className="group flex items-center justify-between p-3.5 rounded-2xl border border-pearl-200/80 hover:border-gold-400 bg-white hover:bg-gold-50/40 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat.icon}</span>
                          <div>
                            <h4 className="font-serif font-bold text-sm text-neutral-900 group-hover:text-gold-800 transition-colors">
                              {cat.name}
                            </h4>
                            <p className="text-[11px] text-neutral-500">{cat.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Additional Quick Navigation */}
                <div className="pt-4 border-t border-pearl-200 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold block mb-2">
                    Quick Links
                  </span>

                  <Link
                    href="/shop"
                    onClick={() => setIsCategoryDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-pearl-100/70 hover:bg-charcoal-900 hover:text-white text-xs font-semibold text-neutral-800 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-gold-600 group-hover:text-gold-400" />
                      <span>View All Fabrics Catalog</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      setIsCategoryDrawerOpen(false);
                      openTrackOrderModal();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-pearl-100/70 hover:bg-charcoal-900 hover:text-white text-xs font-semibold text-neutral-800 transition-all group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-gold-600 group-hover:text-gold-400" />
                      <span>Track Your Order</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/about"
                    onClick={() => setIsCategoryDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-pearl-100/70 hover:bg-charcoal-900 hover:text-white text-xs font-semibold text-neutral-800 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-gold-600 group-hover:text-gold-400" />
                      <span>About Luqman Fabrics</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Drawer Footer WhatsApp & Guarantee */}
              <div className="p-6 bg-pearl-50 border-t border-pearl-200 space-y-3">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Concierge: {settings.displayWhatsApp}</span>
                </a>
                <p className="text-[11px] text-center text-neutral-500">
                  Shewa, Khyber Pakhtunkhwa • {settings.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
