'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function ContactPage() {
  const { settings } = useStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: 'General Fabric Inquiry',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*Assalam-o-Alaikum Luqman Fabrics!* 🌸\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Subject:* ${form.subject}\n\n*Message:* ${form.message}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: 'How do I place an order without creating an account?',
      a: 'Simply browse our catalog, select your desired fabric and color, add to shopping bag, and click Checkout. You only need to enter your delivery address and WhatsApp number. No password or registration required!',
    },
    {
      q: 'Can I see a real video of the fabric before dispatch?',
      a: 'Yes! After placing your order or inquiring, click the "Chat on WhatsApp" button and our Shewa team will record a live HD video of the fabric texture, fall, and embroidery for your confirmation.',
    },
    {
      q: 'How long does delivery take across Pakistan?',
      a: 'Major cities (Islamabad, Peshawar, Lahore, Rawalpindi, Karachi) receive delivery within 2 to 3 working days. Other nationwide regions take 3 to 4 working days via TCS / Leopards Courier with Cash on Delivery.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer a 7-day hassle-free exchange guarantee. If you are not satisfied with the fabric quality or hand-feel, contact us on WhatsApp (+92 340 9797271) for an exchange or return.',
    },
  ];

  return (
    <div className="bg-pearl-50/50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700 font-bold block">
            We Are Here To Assist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950">
            Contact Luqman Fabrics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Connect with our fabric consultants in Shewa for orders, video previews, and custom tailoring advice.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 rounded-3xl bg-white border border-pearl-300 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all text-center space-y-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">Official WhatsApp</h3>
              <p className="text-xs text-neutral-500 mt-1">Direct message & live video preview</p>
              <div className="font-mono font-bold text-emerald-800 mt-2 text-sm">
                {settings.displayWhatsApp}
              </div>
            </div>
          </a>

          <a
            href={`mailto:${settings.email}`}
            className="p-8 rounded-3xl bg-white border border-pearl-300 shadow-sm hover:shadow-xl hover:border-gold-400 transition-all text-center space-y-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">Email Inquiries</h3>
              <p className="text-xs text-neutral-500 mt-1">Corporate & bulk orders</p>
              <div className="font-mono font-medium text-neutral-800 mt-2 text-xs truncate">
                {settings.email}
              </div>
            </div>
          </a>

          <div className="p-8 rounded-3xl bg-white border border-pearl-300 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-pearl-200 text-neutral-800 flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">Store Boutique</h3>
              <p className="text-xs text-neutral-500 mt-1">Physical location</p>
              <div className="text-xs font-semibold text-neutral-800 mt-2">
                {settings.location}
              </div>
            </div>
          </div>
        </div>

        {/* Form and Map/Hours Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-pearl-300 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-neutral-950">
                Send a Direct Message
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Fill out the form below to initiate an instant WhatsApp chat with pre-filled inquiry details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamran Ali"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">WhatsApp Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX XXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Inquiry Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pearl-300 bg-white cursor-pointer"
                >
                  <option value="Men's Boski & Wash & Wear Inquiry">Men's Boski & Wash & Wear Inquiry</option>
                  <option value="Women's Swiss Lawn & Chiffon Inquiry">Women's Swiss Lawn & Chiffon Inquiry</option>
                  <option value="Order Tracking & Courier Status">Order Tracking & Courier Status</option>
                  <option value="Custom Meterage / Tailoring Advice">Custom Meterage / Tailoring Advice</option>
                  <option value="Bulk & Wholesale Purchase">Bulk & Wholesale Purchase</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our fabric specialists assist you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-widest text-xs font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-gold-400" />
                <span>Send to WhatsApp (+92 340 9797271)</span>
              </button>
            </form>
          </div>

          {/* Right: Store Hours & Assistance (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-pearl-300 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-neutral-900">
                <Clock className="w-5 h-5 text-gold-600" />
                <span>Customer Assistance Hours</span>
              </div>
              <p className="text-xs text-neutral-500">
                Our support desk and Shewa dispatch center operate 7 days a week:
              </p>
              <div className="space-y-2 text-xs font-medium text-neutral-700 pt-2 border-t border-pearl-200">
                <div className="flex justify-between">
                  <span>Monday - Saturday:</span>
                  <span className="font-bold text-neutral-900">9:00 AM - 10:00 PM PKT</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-bold text-neutral-900">11:00 AM - 8:00 PM PKT</span>
                </div>
                <div className="flex justify-between text-emerald-700 pt-1">
                  <span>WhatsApp Online:</span>
                  <span className="font-bold">24/7 Priority Response</span>
                </div>
              </div>
            </div>

            {/* Quality Commitment Box */}
            <div className="bg-gradient-to-br from-charcoal-950 to-charcoal-900 text-white p-8 rounded-3xl border border-gold-400/30 space-y-3">
              <ShieldCheck className="w-8 h-8 text-gold-400" />
              <h4 className="font-serif font-bold text-lg text-pearl-50">
                100% Pure Fabric Guarantee
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                If you ever find any synthetic blend in our pure Boski or pure Swiss Lawn contrary to our specifications, we offer an immediate full refund.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-pearl-300 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700 font-bold block">
              Got Questions?
            </span>
            <h3 className="font-serif text-3xl font-bold text-neutral-950">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-pearl-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-pearl-50/50 hover:bg-pearl-100/50 text-neutral-900 font-serif font-bold text-sm sm:text-base transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-600 transition-transform duration-300 shrink-0 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-pearl-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
