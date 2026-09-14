'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, openTrackOrderModal } = useStore();

  return (
    <footer className="bg-charcoal-950 text-pearl-200 pt-16 pb-12 border-t border-gold-400/20 relative overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-gold-400/10 text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-pearl-50">100% Pure Guaranteed</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Authentic Swiss Lawn, Original Boski, & hand-selected fine cottons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-gold-400/10 text-gold-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-pearl-50">Nationwide COD</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Fast doorstep courier delivery across all cities & towns of Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-gold-400/10 text-gold-400 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-pearl-50">WhatsApp Video Preview</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Request real texture videos & drape verification on WhatsApp before dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-gold-400/10 text-gold-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-pearl-50">7-Day Easy Exchange</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hassle-free exchange policy if you are not 100% satisfied with fabric feel.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-neutral-800">
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Luqman Fabrics brings you the finest heritage textiles in Pakistan. From royal Men's Boski and Japanese Wash & Wear to handcrafted designer Summer Lawn and festive Chiffon embroideries.
            </p>
            
            <div className="space-y-2.5 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors font-medium text-pearl-100"
                >
                  WhatsApp: {settings.displayWhatsApp}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-gold-300 transition-colors"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-widest text-pearl-50 uppercase mb-4">
              Fabric Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/shop?category=women-unstitched" className="hover:text-gold-300 transition-colors">
                  Women's Luxury Lawn (3pc)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men-unstitched" className="hover:text-gold-300 transition-colors">
                  Men's Imperial Boski
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men-unstitched" className="hover:text-gold-300 transition-colors">
                  Wash & Wear Tropical Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chiffon-luxury" className="hover:text-gold-300 transition-colors">
                  Embroidered Chiffon Formals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pure-cotton" className="hover:text-gold-300 transition-colors">
                  Egyptian Supima Cotton
                </Link>
              </li>
              <li>
                <Link href="/shop?category=karandi-winter" className="hover:text-gold-300 transition-colors">
                  Winter Karandi Shawl Suits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-widest text-pearl-50 uppercase mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => openTrackOrderModal()}
                  className="hover:text-gold-300 transition-colors flex items-center gap-1 text-left"
                >
                  <span>Track Your Order</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  Our Shewa Heritage Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Contact & Store FAQs
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hi Luqman Fabrics, I need help with fabric stitching / cutting guidance.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors"
                >
                  Tailoring & Meter Advice
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Order & Admin */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-widest text-pearl-50 uppercase mb-4">
              Quick WhatsApp
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Need immediate assistance or bulk orders? Connect directly with our store manager.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <span>Chat +92 340 9797271</span>
            </a>

            <div className="pt-6">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-gold-400 transition-colors border border-neutral-800 px-3 py-1.5 rounded"
              >
                <Lock className="w-3 h-3" />
                <span>Store Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright & Accepted Payment Methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} <span className="text-pearl-200">Luqman Fabrics</span> (Shewa, Pakistan). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Payment Methods:</span>
            <span className="bg-charcoal-900 px-2 py-1 rounded text-pearl-200 text-[10px] font-mono border border-neutral-800">
              Cash on Delivery (COD)
            </span>
            <span className="bg-charcoal-900 px-2 py-1 rounded text-pearl-200 text-[10px] font-mono border border-neutral-800">
              Bank Transfer / EasyPaisa / JazzCash
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
