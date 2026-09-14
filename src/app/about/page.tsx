'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '../../components/brand/Logo';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Award,
  Sparkles,
  PhoneCall,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pearl-100 border border-gold-400/40 text-xs font-mono uppercase tracking-widest text-gold-900">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>The Heritage of Luqman Fabrics</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-950">
            Quality You Feel, <span className="gold-gradient-text italic font-normal">Style You Love</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Founded with a passion for authentic Pakistani textile heritage, Luqman Fabrics is dedicated to bringing genuine, luxury unstitched fabrics directly from master weavers and mills in Shewa to homes across Pakistan.
          </p>
        </div>

        {/* Brand Story Split Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-pearl-300">
            <Image
              src="/images/hero.jpg"
              alt="Luqman Fabrics Luxury Storefront"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-mono uppercase text-gold-300 font-semibold">
                Authentic Craftsmanship
              </span>
              <h3 className="font-serif text-xl font-bold">
                Preserving Pakistan's Textile Legacy
              </h3>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
              Our Commitment to Purity & Authenticity
            </h2>
            <p>
              In an era of synthetic imitations, Luqman Fabrics stands firm on a singular principle: <strong>Absolute Textile Purity</strong>. Every meter of our 6-Pound Boski, Swiss Lawn, Japanese Wash & Wear, and Giza Egyptian Cotton undergoes rigorous inspection for thread count, drape, and colorfastness.
            </p>
            <p>
              Based in <strong>Shewa, Khyber Pakhtunkhwa</strong>, our boutique serves esteemed patrons seeking traditional attire that speaks of aristocracy, comfort, and enduring elegance.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
              <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200">
                <ShieldCheck className="w-5 h-5 text-gold-600 mb-2" />
                <span className="font-bold text-neutral-900 block text-sm">100% Guaranteed</span>
                <span className="text-neutral-500">Pure Boski, Lawn & Cotton</span>
              </div>
              <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200">
                <HeartHandshake className="w-5 h-5 text-gold-600 mb-2" />
                <span className="font-bold text-neutral-900 block text-sm">Customer First</span>
                <span className="text-neutral-500">Video inspection on WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="bg-pearl-50 p-8 sm:p-12 rounded-3xl border border-pearl-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
              Why Discerning Buyers Choose Us
            </h3>
            <p className="text-xs text-neutral-500">
              Every detail is calibrated to give you a royal boutique experience from order to unboxing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 bg-white rounded-2xl border border-pearl-200 space-y-2">
              <span className="w-8 h-8 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center font-bold font-mono">01</span>
              <h4 className="font-serif font-bold text-base text-neutral-900">Original Mill Weaves</h4>
              <p className="text-neutral-500">Direct procurement from licensed handlooms and high-tech airjet looms.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-pearl-200 space-y-2">
              <span className="w-8 h-8 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center font-bold font-mono">02</span>
              <h4 className="font-serif font-bold text-base text-neutral-900">Live Video Preview</h4>
              <p className="text-neutral-500">Get a WhatsApp video of your fabric drape and embroidery before shipment.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-pearl-200 space-y-2">
              <span className="w-8 h-8 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center font-bold font-mono">03</span>
              <h4 className="font-serif font-bold text-base text-neutral-900">Nationwide COD</h4>
              <p className="text-neutral-500">Pay safely with Cash on Delivery at your doorstep in any Pakistani city.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-pearl-200 space-y-2">
              <span className="w-8 h-8 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center font-bold font-mono">04</span>
              <h4 className="font-serif font-bold text-base text-neutral-900">Gift Packaging</h4>
              <p className="text-neutral-500">Embossed gold presentation box with mother-of-pearl buttons and tags.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center space-y-6 pt-4">
          <h3 className="font-serif text-2xl font-bold text-neutral-900">
            Have Questions or Need Tailoring Advice?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chat on WhatsApp ({settings.displayWhatsApp})</span>
            </a>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Explore Fabric Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
