'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Phone, Mail, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, openTrackOrderModal } = useStore();

  if (!settings.showAnnouncement) return null;

  return (
    <div className="bg-charcoal-900 text-pearl-100 text-xs py-2 px-4 border-b border-gold-400/20 relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Contact Info */}
        <div className="hidden lg:flex items-center gap-4 text-pearl-300">
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            <span>WhatsApp: {settings.displayWhatsApp}</span>
          </a>
          <span className="text-neutral-600">|</span>
          <a
            href={`mailto:${settings.email}`}
            className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            <span>{settings.email}</span>
          </a>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex items-center justify-center gap-2 mx-auto sm:mx-0 font-medium tracking-wide text-[11px] sm:text-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse-subtle shrink-0" />
          <span className="text-pearl-100">{settings.announcementText}</span>
        </div>

        {/* Right: Track Order & Guarantee */}
        <div className="hidden md:flex items-center gap-3 text-gold-300/90 font-medium text-[11px]">
          <button
            onClick={() => openTrackOrderModal()}
            className="flex items-center gap-1.5 hover:text-white px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-gold-500/30 transition-all text-pearl-100 font-semibold"
            title="Track your order status with contact or Order ID"
          >
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            <span>Track Order</span>
          </button>
          <span className="text-neutral-600">|</span>
          <span>Nationwide COD</span>
        </div>
      </div>
    </div>
  );
};
