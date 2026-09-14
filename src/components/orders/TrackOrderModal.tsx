'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../lib/types';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  PhoneCall,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export const TrackOrderModal: React.FC = () => {
  const {
    orders,
    settings,
    isTrackOrderOpen,
    closeTrackOrderModal,
    trackOrderPrefill
  } = useStore();

  const [contactInput, setContactInput] = useState('');
  const [matchingOrders, setMatchingOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sync prefill when modal opens
  useEffect(() => {
    if (isTrackOrderOpen) {
      if (trackOrderPrefill) {
        setContactInput(trackOrderPrefill);
        executeSearch(trackOrderPrefill);
      } else {
        // Check if there is a recently placed order in local storage
        try {
          const savedOrders = localStorage.getItem('luqman_fabrics_orders');
          if (savedOrders) {
            const parsed = JSON.parse(savedOrders);
            if (Array.isArray(parsed) && parsed.length > 0 && !hasSearched) {
              const latest = parsed[0];
              if (latest?.customer?.whatsappNumber) {
                // Keep input ready
                setContactInput(latest.customer.whatsappNumber);
              }
            }
          }
        } catch (e) {}
      }
    } else {
      // Reset search on close
      setHasSearched(false);
      setMatchingOrders([]);
      setSelectedOrder(null);
    }
  }, [isTrackOrderOpen, trackOrderPrefill]);

  const executeSearch = (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setHasSearched(true);

    const cleanDigits = trimmed.replace(/\D/g, '');
    const cleanOrderStr = trimmed.toUpperCase().replace('#', '');

    const results = orders.filter((order) => {
      // 1. Check exact or partial Order Number (e.g. LF-94821 or 94821)
      const orderNoUpper = order.orderNumber.toUpperCase();
      const matchOrderNo =
        orderNoUpper.includes(cleanOrderStr) ||
        order.id.toUpperCase().includes(cleanOrderStr) ||
        order.orderNumber.replace(/\D/g, '').includes(cleanDigits);

      // 2. Check Customer WhatsApp / Phone digits
      const phoneDigits = order.customer.whatsappNumber.replace(/\D/g, '');
      const altPhoneDigits = order.customer.alternatePhone ? order.customer.alternatePhone.replace(/\D/g, '') : '';
      
      const matchPhone =
        cleanDigits.length >= 4 &&
        (phoneDigits.includes(cleanDigits) ||
          (cleanDigits.length >= 7 && phoneDigits.endsWith(cleanDigits.slice(-7))) ||
          altPhoneDigits.includes(cleanDigits));

      // 3. Check customer name match
      const matchName =
        trimmed.length >= 3 &&
        order.customer.fullName.toLowerCase().includes(trimmed.toLowerCase());

      return matchOrderNo || matchPhone || matchName;
    });

    // Sort by latest order first
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setMatchingOrders(results);
    setSelectedOrder(results.length > 0 ? results[0] : null);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(contactInput);
  };

  const getStepStatus = (status: OrderStatus, stepIndex: number) => {
    const sequence: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = sequence.indexOf(status);

    if (status === 'cancelled') {
      return stepIndex === 0 ? 'completed' : 'upcoming';
    }

    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'upcoming';
  };

  if (!isTrackOrderOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-charcoal-900 text-white px-6 py-4 flex items-center justify-between border-b border-gold-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 font-bold block">
                Luqman Fabrics Shewa
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-pearl-50">
                Track Order & Dispatch Status
              </h2>
            </div>
          </div>

          <button
            onClick={closeTrackOrderModal}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container with Scroll */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Search Form Box */}
          <div className="bg-pearl-50 p-4 sm:p-5 rounded-2xl border border-pearl-200 shadow-sm space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <span>Enter Contact Number or Order ID</span>
                <span className="text-[10px] font-normal text-neutral-500 font-mono">
                  (WhatsApp / Phone / LF-XXXXX)
                </span>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. 0340 9797271 or LF-94821"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 font-medium text-neutral-900 shadow-sm"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSearching || !contactInput.trim()}
                className="px-6 py-3 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-wider text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:bg-neutral-300"
              >
                <Search className="w-3.5 h-3.5 text-gold-400 group-hover:text-charcoal-950" />
                <span>Track Status</span>
              </button>
            </form>

            {/* Quick Sample Queries */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
              <span className="text-neutral-400">Quick suggestions:</span>
              <button
                type="button"
                onClick={() => {
                  setContactInput('03409797271');
                  executeSearch('03409797271');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-pearl-300 text-gold-700 font-mono font-semibold hover:border-gold-400"
              >
                03409797271
              </button>
              <button
                type="button"
                onClick={() => {
                  setContactInput('LF-94821');
                  executeSearch('LF-94821');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-pearl-300 text-gold-700 font-mono font-semibold hover:border-gold-400"
              >
                LF-94821
              </button>
              <button
                type="button"
                onClick={() => {
                  setContactInput('LF-94822');
                  executeSearch('LF-94822');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-pearl-300 text-gold-700 font-mono font-semibold hover:border-gold-400"
              >
                LF-94822
              </button>
            </div>
          </div>

          {/* Multiple Orders Found Selector Tabs */}
          {matchingOrders.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-700 block">
                Found {matchingOrders.length} orders for this contact:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {matchingOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left shrink-0 transition-all ${
                      selectedOrder?.id === ord.id
                        ? 'bg-charcoal-900 text-gold-400 border-charcoal-900 shadow-sm'
                        : 'bg-white text-neutral-700 border-pearl-300 hover:bg-pearl-50'
                    }`}
                  >
                    <div className="font-mono font-bold">#{ord.orderNumber}</div>
                    <div className="text-[10px] opacity-80">
                      Rs. {ord.totalAmount.toLocaleString()} • {ord.status.toUpperCase()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Result: Found Order Details */}
          {selectedOrder && (
            <div className="space-y-6 animate-fadeIn">
              {/* Status Banner */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-pearl-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold text-neutral-950">
                      Order #{selectedOrder.orderNumber}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedOrder.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedOrder.status === 'confirmed'
                          ? 'bg-gold-100 text-gold-900'
                          : selectedOrder.status === 'processing'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedOrder.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      Customer: <strong>{selectedOrder.customer.fullName}</strong>
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] text-neutral-400 block font-mono">Total Payable:</span>
                  <span className="font-serif text-xl font-bold text-gold-700">
                    Rs. {selectedOrder.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                    {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                  </span>
                </div>
              </div>

              {/* 4-Stage Stepper Progression */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-pearl-300 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600" />
                  <span>Shipment & Dispatch Progress</span>
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                  {[
                    { title: '1. Received', desc: 'Order placed in DB', icon: Clock, idx: 0 },
                    { title: '2. Confirmed', desc: 'WhatsApp verified', icon: PhoneCall, idx: 1 },
                    { title: '3. Inspection', desc: 'Packed in luxury box', icon: Package, idx: 2 },
                    { title: '4. Dispatched', desc: 'Handed to courier', icon: Truck, idx: 3 },
                  ].map((step) => {
                    const state = getStepStatus(selectedOrder.status, step.idx);
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.title}
                        className={`p-3 rounded-xl border transition-all ${
                          state === 'completed'
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                            : state === 'current'
                            ? 'bg-gold-50 border-gold-400 text-neutral-900 ring-2 ring-gold-400/30 font-semibold'
                            : 'bg-pearl-50/40 border-pearl-200 text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className={`p-1.5 rounded-lg ${
                              state === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : state === 'current'
                                ? 'bg-gold-500 text-charcoal-950 font-bold'
                                : 'bg-pearl-200 text-neutral-500'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-serif font-bold text-xs">{step.title}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <MapPin className="w-3.5 h-3.5 text-gold-600" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed font-medium">
                    {selectedOrder.customer.address}
                  </p>
                  <p className="text-neutral-600">
                    📍 {selectedOrder.customer.city}, {selectedOrder.customer.province}
                  </p>
                  <p className="text-emerald-800 font-mono font-semibold pt-1">
                    WhatsApp: {selectedOrder.customer.whatsappNumber}
                  </p>
                  {selectedOrder.customer.orderNotes && (
                    <div className="text-neutral-500 italic mt-1 pt-1 border-t border-pearl-200">
                      Notes: "{selectedOrder.customer.orderNotes}"
                    </div>
                  )}
                </div>

                {/* Ordered Fabric Items */}
                <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gold-600" />
                      <span>Ensemble Items ({selectedOrder.items.length})</span>
                    </span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-pearl-200/60 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded bg-pearl-200 overflow-hidden shrink-0">
                            {item.image && (
                              <Image src={item.image} alt={item.productName} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block line-clamp-1">
                              {item.productName}
                            </span>
                            <span className="text-neutral-500 text-[10px]">
                              {item.colorName} • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-neutral-900 shrink-0">
                          Rs. {item.total.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-pearl-200 flex justify-between font-bold text-xs text-neutral-900">
                    <span>Total Amount:</span>
                    <span className="text-gold-700">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Print */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Luqman Fabrics! I want to check the status of my Order #${selectedOrder.orderNumber} placed for ${selectedOrder.customer.fullName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Contact Store Manager on WhatsApp ({settings.displayWhatsApp})</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 bg-pearl-100 hover:bg-pearl-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}

          {/* Search Result: Not Found */}
          {hasSearched && !selectedOrder && !isSearching && (
            <div className="p-6 bg-white rounded-2xl border border-pearl-300 text-center space-y-3 shadow-sm animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                No Orders Found for "{contactInput}"
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                We couldn't find any orders matching this contact number or Order ID. Please check the digits or contact our store manager directly on WhatsApp.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Luqman Fabrics! I need help tracking my order with contact: ${contactInput}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Ask Support on WhatsApp ({settings.displayWhatsApp})</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
