'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Calculator,
  Scissors,
  User,
  Sparkles,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export const FabricCalculatorModal: React.FC = () => {
  const { isCalculatorOpen, setIsCalculatorOpen, settings } = useStore();

  const [garmentType, setGarmentType] = useState<'men-suit' | 'women-suit' | 'maxi' | 'waistcoat' | 'kurta'>('men-suit');
  const [personSize, setPersonSize] = useState<'regular' | 'large' | 'tall'>('regular');
  const [fabricWidth, setFabricWidth] = useState<'double' | 'single'>('double'); // double = 54-58" (Bara Arzz), single = 36-40" (Chota Arzz)

  if (!isCalculatorOpen) return null;

  // Calculate recommended meters & yards
  const getCalculation = () => {
    let meters = 4.0;
    let explanation = '';

    if (garmentType === 'men-suit') {
      if (fabricWidth === 'double') {
        if (personSize === 'regular') meters = 4.0;
        else if (personSize === 'large') meters = 4.25;
        else meters = 4.5;
        explanation = 'Standard Bara Arzz (54"-58" width) Shalwar & Kameez with cuffs & collar.';
      } else {
        if (personSize === 'regular') meters = 7.0;
        else if (personSize === 'large') meters = 7.5;
        else meters = 8.0;
        explanation = 'Single Arzz (36"-40" width) requirement.';
      }
    } else if (garmentType === 'women-suit') {
      if (personSize === 'regular') meters = 5.0; // 2.5m shirt + 2.5m trouser
      else meters = 5.5;
      explanation = '2-Piece (Shirt + Trouser). For 3-Piece add 2.5m for Dupatta (Total 7.5m).';
    } else if (garmentType === 'maxi') {
      if (personSize === 'regular') meters = 6.0;
      else meters = 7.5;
      explanation = 'Full flared Kalidar/Anarkali Maxi or Long Gown with inner lining.';
    } else if (garmentType === 'waistcoat') {
      meters = 1.25;
      explanation = 'Men\'s formal Prince Coat or Waistcoat length.';
    } else if (garmentType === 'kurta') {
      meters = personSize === 'regular' ? 2.25 : 2.5;
      explanation = 'Single Men\'s or Women\'s Straight Long Kurta / Shirt.';
    }

    const yards = (meters * 1.09361).toFixed(2);
    return { meters, yards, explanation };
  };

  const result = getCalculation();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden">
        {/* Header */}
        <div className="bg-charcoal-950 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-400/20 text-gold-400 rounded-xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-pearl-50">Fabric Meter Calculator</h3>
                <p className="text-xs text-neutral-400">Tailoring guidance from Luqman Fabrics Master Cutters</p>
              </div>
            </div>
            <button
              onClick={() => setIsCalculatorOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Garment Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
              1. Select Garment Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'men-suit', label: "Men's Shalwar Kameez" },
                { id: 'women-suit', label: "Women's 2-Piece Suit" },
                { id: 'maxi', label: "Flared Maxi / Gown" },
                { id: 'kurta', label: "Single Kurta / Shirt" },
                { id: 'waistcoat', label: "Formal Waistcoat" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGarmentType(item.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all font-medium ${
                    garmentType === item.id
                      ? 'bg-gold-50 border-gold-400 text-gold-900 shadow-sm font-semibold'
                      : 'bg-white border-pearl-300 text-neutral-600 hover:bg-pearl-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size / Fit */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
              2. Body Size & Height
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'regular', label: 'Standard (Up to 5\'9", S/M/L)' },
                { id: 'large', label: 'Plus Size / XL-2XL' },
                { id: 'tall', label: 'Tall Height (5\'11"+)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPersonSize(item.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    personSize === item.id
                      ? 'bg-charcoal-900 text-gold-400 border-charcoal-900 font-semibold shadow-sm'
                      : 'bg-white border-pearl-300 text-neutral-600 hover:bg-pearl-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Width / Arzz */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
              3. Fabric Width (Arzz)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setFabricWidth('double')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fabricWidth === 'double'
                    ? 'bg-amber-50/80 border-gold-400 text-neutral-900 font-semibold'
                    : 'bg-white border-pearl-300 text-neutral-600'
                }`}
              >
                <div className="font-bold">Bara Arzz (54"-58" Wide)</div>
                <div className="text-[11px] text-neutral-500 font-normal">Most Men's Boski, Wash & Wear, Cotton</div>
              </button>
              <button
                onClick={() => setFabricWidth('single')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fabricWidth === 'single'
                    ? 'bg-amber-50/80 border-gold-400 text-neutral-900 font-semibold'
                    : 'bg-white border-pearl-300 text-neutral-600'
                }`}
              >
                <div className="font-bold">Chota Arzz (36"-40" Wide)</div>
                <div className="text-[11px] text-neutral-500 font-normal">Traditional Latha & Handloom Silk</div>
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-charcoal-950 to-charcoal-900 text-white p-5 rounded-2xl border border-gold-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                Recommended Fabric Cut
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tailor Verified
              </span>
            </div>
            <div className="flex items-baseline gap-4 pt-1">
              <span className="text-3xl font-serif font-bold text-white tracking-wide">
                {result.meters} <span className="text-lg font-sans font-normal text-pearl-300">Meters</span>
              </span>
              <span className="text-sm text-neutral-400">
                (~{result.yards} Gaz / Yards)
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed pt-1">
              {result.explanation}
            </p>
          </div>

          {/* WhatsApp Tailor Assistance */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-500">
              Need custom size stitching or designer cutting?
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum Luqman Fabrics! I need custom cutting advice for ${garmentType} (${result.meters} meters). Can you assist?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
