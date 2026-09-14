'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [hasPrompted, setHasPrompted] = useState(false);

  // Show subtle greeting popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    const message = customMsg.trim() || 'Assalam-o-Alaikum Luqman Fabrics! I would like to inquire about your fabric collections.';
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Greeting Bubble if collapsed and prompted */}
      {!isOpen && hasPrompted && (
        <div className="mb-3 mr-1 bg-white text-neutral-800 p-3.5 rounded-2xl shadow-xl border border-gold-400/30 max-w-xs text-xs animate-float relative hidden sm:block">
          <button
            onClick={() => setHasPrompted(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Luqman Fabrics WhatsApp</span>
          </div>
          <p className="text-neutral-600">
            Need fabric advice, video preview, or quick order? Chat with us live on WhatsApp!
          </p>
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-b border-r border-gold-400/30 rotate-45" />
        </div>
      )}

      {/* Expanded Interactive Chat Modal */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-pearl-300 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-serif text-lg font-bold text-amber-200 border border-white/30">
                LF
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-800" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold tracking-wider">{settings.storeName} Support</h4>
                <p className="text-[11px] text-emerald-100/80">Online | Shewa, Pakistan</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-pearl-50/50 space-y-3 max-h-72 overflow-y-auto text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-pearl-200 text-neutral-800 leading-relaxed">
              <p className="font-medium text-emerald-900 mb-1">Assalam-o-Alaikum! 🌸</p>
              <p>Welcome to Luqman Fabrics. How may we assist you today?</p>
              <ul className="mt-2 space-y-1 text-neutral-600 list-disc list-inside">
                <li>Check availability & original Boski / Lawn</li>
                <li>Request WhatsApp video texture preview</li>
                <li>Custom meterage & tailoring advice</li>
              </ul>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum! Can you please send photos/videos of available Men Boski & Wash and Wear fabrics?')}`;
                  window.open(url, '_blank');
                }}
                className="w-full text-left p-2 rounded-lg bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                👔 View Men's Boski & Wash & Wear Catalogue
              </button>
              <button
                onClick={() => {
                  const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum! I want to inquire about Women Swiss Lawn and Chiffon embroidered 3-piece collections.')}`;
                  window.open(url, '_blank');
                }}
                className="w-full text-left p-2 rounded-lg bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                👗 Women's Luxury Lawn & Chiffon
              </button>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-pearl-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 text-xs py-2 px-3 bg-pearl-50 border border-pearl-300 rounded-full focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full shadow-2xl border-2 border-white/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Contact on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Chat on WhatsApp</span>
      </button>
    </div>
  );
};
