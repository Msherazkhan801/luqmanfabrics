'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  PhoneCall,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function TrackOrderPage() {
  const { orders, settings, openTrackOrderModal } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    const cleanQuery = query.trim().toUpperCase().replace('#', '');

    const found = orders.find((o) => {
      const matchOrderNo = o.orderNumber.toUpperCase().includes(cleanQuery);
      const matchPhone = o.customer.whatsappNumber.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''));
      return matchOrderNo || matchPhone;
    });

    setSearchedOrder(found || null);
  };

  const getStepStatus = (status: string, stepIndex: number) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-pearl-50/60 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700 font-bold block">
            Real-Time Courier Dispatch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950">
            Track Your Fabric Order
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Enter your Order ID (e.g. <strong>LF-94821</strong>) or registered WhatsApp contact number to inspect live status.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openTrackOrderModal()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500 hover:bg-charcoal-900 hover:text-white text-charcoal-950 text-xs font-serif font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Open Quick Tracking Modal</span>
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="max-w-xl mx-auto bg-white p-3 sm:p-4 rounded-3xl border border-pearl-300 shadow-lg">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. LF-94821) or WhatsApp"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-base sm:text-xs md:text-sm bg-pearl-50 rounded-2xl border border-pearl-200 focus:outline-none focus:border-gold-400 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 sm:py-3 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-wider text-xs font-bold rounded-2xl shadow-md transition-all shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Quick Sample Order IDs Hint */}
        <div className="text-center text-xs text-neutral-400">
          <span>Try sample order IDs: </span>
          <button onClick={() => { setQuery('LF-94821'); }} className="text-gold-700 font-mono font-bold hover:underline mx-1">
            LF-94821
          </button>
          <span>•</span>
          <button onClick={() => { setQuery('LF-94822'); }} className="text-gold-700 font-mono font-bold hover:underline mx-1">
            LF-94822
          </button>
          <span>•</span>
          <button onClick={() => { setQuery('LF-94823'); }} className="text-gold-700 font-mono font-bold hover:underline mx-1">
            LF-94823
          </button>
        </div>

        {/* Results */}
        {hasSearched && !searchedOrder && (
          <div className="p-8 bg-white rounded-3xl border border-pearl-300 text-center space-y-3 max-w-lg mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-neutral-900">No Matching Order Found</h3>
            <p className="text-xs text-neutral-500">
              Please double-check your Order ID or contact our store manager directly on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum! I want to check the status of my order.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Ask on WhatsApp ({settings.displayWhatsApp})</span>
            </a>
          </div>
        )}

        {searchedOrder && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pearl-300 shadow-xl space-y-8 animate-fadeIn">
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-pearl-200 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                  Live Tracking
                </span>
                <h3 className="font-serif text-2xl font-bold text-neutral-950">
                  Order #{searchedOrder.orderNumber}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {new Date(searchedOrder.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span>Recipient: <strong>{searchedOrder.customer.fullName}</strong></span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-neutral-500 block mb-1">Current Status</span>
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  searchedOrder.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchedOrder.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : searchedOrder.status === 'processing'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {searchedOrder.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-base text-neutral-900">Delivery Progression</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Order Placed', desc: 'Received in system', icon: Clock, idx: 0 },
                  { title: 'WhatsApp Confirmed', desc: 'Verified by manager', icon: PhoneCall, idx: 1 },
                  { title: 'Quality Inspection', desc: 'Steam pressed & packed', icon: Package, idx: 2 },
                  { title: 'Dispatched / Courier', desc: 'TCS / Leopards / Trax', icon: Truck, idx: 3 },
                ].map((step) => {
                  const state = getStepStatus(searchedOrder.status, step.idx);
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className={`p-4 rounded-2xl border transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-sm'
                          : state === 'current'
                          ? 'bg-gold-50 border-gold-400 text-neutral-900 shadow-md ring-2 ring-gold-400/30'
                          : 'bg-pearl-50/40 border-pearl-200 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-xl ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'current'
                            ? 'bg-gold-500 text-charcoal-950 font-bold'
                            : 'bg-pearl-200 text-neutral-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-serif font-bold text-sm">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-xs">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination & Items preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-pearl-200 text-xs">
              <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200 space-y-2">
                <span className="font-mono uppercase text-neutral-400 font-bold block">Delivery Address:</span>
                <p className="text-neutral-800 font-medium leading-relaxed">
                  {searchedOrder.customer.address}, {searchedOrder.customer.city}, {searchedOrder.customer.province}
                </p>
                <p className="text-neutral-500">
                  WhatsApp: {searchedOrder.customer.whatsappNumber}
                </p>
              </div>

              <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200 space-y-2">
                <span className="font-mono uppercase text-neutral-400 font-bold block">Ensemble Cuts:</span>
                <ul className="space-y-1 text-neutral-800 font-medium">
                  {searchedOrder.items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span>• {item.productName} ({item.colorName})</span>
                      <span>Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-pearl-200 font-bold text-neutral-900 flex justify-between">
                  <span>Total Amount:</span>
                  <span className="text-gold-700">Rs. {searchedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Manager Contact */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <h5 className="font-bold text-emerald-950">Have a question regarding this shipment?</h5>
                <p className="text-emerald-800">Our Shewa store manager is ready to update you on WhatsApp.</p>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum Luqman Fabrics! I would like an update on my order #${searchedOrder.orderNumber}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shrink-0"
              >
                Chat on WhatsApp (+92 340 9797271)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
