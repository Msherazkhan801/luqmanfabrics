'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '../../../context/StoreContext';
import { getCustomerOrderWhatsAppUrl } from '../../../lib/whatsapp';
import {
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShoppingBag,
  Printer,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  Send
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const { orders, markOrderWhatsAppSent, settings, openTrackOrderModal } = useStore();
  const orderId = params.id as string;

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);

  // Trigger confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C5A059', '#1A1A1A', '#FAF5E8'],
      });
    } catch (e) {}
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">Order Not Found</h2>
        <Link href="/shop" className="px-6 py-3 bg-charcoal-900 text-white rounded-full text-xs font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    markOrderWhatsAppSent(order.id);
    setHasSentWhatsApp(true);
    const url = getCustomerOrderWhatsAppUrl(order);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-pearl-50/60 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-pearl-300 shadow-xl text-center space-y-4 relative overflow-hidden">
          {/* Decorative ambient top glow */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold-400 via-emerald-500 to-gold-400" />

          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-700 font-bold">
              Order Successfully Received
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
              Shukriya, {order.customer.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
              Your order <strong className="font-mono text-neutral-900 font-bold">#{order.orderNumber}</strong> has been logged into our system.
            </p>
          </div>

          {/* CRITICAL ACTION: WHATSAPP CONFIRMATION BUTTON */}
          <div className="pt-4 pb-2 max-w-lg mx-auto">
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-serif tracking-wider uppercase font-bold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group animate-pulse-subtle"
            >
              <PhoneCall className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Send Order to WhatsApp ({settings.displayWhatsApp})</span>
              <Send className="w-4 h-4 text-emerald-200 ml-1" />
            </button>
            <p className="text-[11px] text-neutral-500 mt-2">
              💡 Click above to instantly open WhatsApp and send your invoice to our store manager for priority packing.
            </p>
          </div>
        </div>

        {/* Visual Progress Steps */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pearl-300 shadow-sm">
          <h3 className="font-serif font-bold text-xs sm:text-sm text-neutral-900 mb-4 sm:mb-6 text-center uppercase tracking-wider">
            Order Status Journey
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-center relative">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/50 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                ✓
              </div>
              <span className="text-[11px] font-bold text-neutral-900">Order Placed</span>
              <span className="text-[10px] text-neutral-400">Step 1</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-amber-50/50 border border-amber-200/50 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="w-8 h-8 rounded-full bg-gold-400 text-charcoal-950 flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                2
              </div>
              <span className="text-[11px] font-semibold text-neutral-800">WhatsApp Confirmation</span>
              <span className="text-[10px] text-gold-700 font-bold">In Progress</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-pearl-50 border border-pearl-200/50 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="w-8 h-8 rounded-full bg-pearl-200 text-neutral-500 flex items-center justify-center text-xs font-bold mb-1">
                3
              </div>
              <span className="text-[11px] font-medium text-neutral-500">Inspection & Packing</span>
              <span className="text-[10px] text-neutral-400">Step 3</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-pearl-50 border border-pearl-200/50 sm:bg-transparent sm:border-0 sm:p-0">
              <div className="w-8 h-8 rounded-full bg-pearl-200 text-neutral-500 flex items-center justify-center text-xs font-bold mb-1">
                4
              </div>
              <span className="text-[11px] font-medium text-neutral-500">Courier Dispatch</span>
              <span className="text-[10px] text-neutral-400">Step 4</span>
            </div>
          </div>
        </div>

        {/* Itemized Printable Invoice Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pearl-300 shadow-sm space-y-6" id="printable-invoice">
          <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
            <div>
              <span className="font-serif text-2xl font-bold text-neutral-950">
                Luqman <span className="text-gold-500 font-normal">Fabrics</span>
              </span>
              <p className="text-xs text-neutral-400">Shewa, Khyber Pakhtunkhwa • {settings.displayWhatsApp}</p>
            </div>
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-pearl-300 hover:bg-pearl-100 text-neutral-600 flex items-center gap-1.5 text-xs font-semibold print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Customer & Delivery Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 bg-pearl-50 rounded-2xl border border-pearl-200">
            <div>
              <span className="font-mono uppercase text-neutral-400 font-bold block mb-1">Customer Details:</span>
              <div className="font-bold text-neutral-900 text-sm">{order.customer.fullName}</div>
              <div className="text-neutral-600 font-medium">WhatsApp: {order.customer.whatsappNumber}</div>
              {order.customer.email && <div className="text-neutral-500">{order.customer.email}</div>}
            </div>

            <div>
              <span className="font-mono uppercase text-neutral-400 font-bold block mb-1">Delivery Destination:</span>
              <div className="text-neutral-800 leading-relaxed font-medium">
                {order.customer.address}, {order.customer.city}, {order.customer.province}
              </div>
              {order.customer.orderNotes && (
                <div className="text-neutral-500 mt-1 italic">
                  Note: "{order.customer.orderNotes}"
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-neutral-900">Ordered Fabric Cuts</h4>
            <div className="divide-y divide-pearl-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-pearl-100 shrink-0 border border-pearl-200">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-serif font-semibold text-neutral-900 text-sm">
                        {item.productName}
                      </div>
                      <div className="text-neutral-500 text-[11px] flex items-center gap-2">
                        <span>Color: {item.colorName}</span>
                        <span>•</span>
                        <span>{item.cutLength}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-neutral-500">
                      {item.quantity} × Rs. {item.price.toLocaleString()}
                    </div>
                    <div className="font-serif font-bold text-neutral-900">
                      Rs. {item.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-pearl-200 pt-4 space-y-1.5 text-xs text-neutral-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-900">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span>-Rs. {order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Nationwide Shipping:</span>
              <span className="font-semibold text-neutral-900">
                {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-pearl-200 pt-2 font-serif">
              <span>Grand Total:</span>
              <span className="text-gold-700">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-neutral-500 pt-1 text-right">
              Payment: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</strong>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs pt-4 print:hidden">
          <button
            onClick={() => openTrackOrderModal(order.orderNumber)}
            className="flex items-center gap-1.5 text-gold-800 font-semibold hover:underline"
          >
            <Truck className="w-4 h-4 text-gold-600" />
            <span>Track this order live in modal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/shop"
            className="px-6 py-3 bg-charcoal-900 text-white rounded-full font-serif uppercase tracking-wider text-xs font-semibold hover:bg-gold-500 hover:text-charcoal-950 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
