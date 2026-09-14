'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'gold';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
  size = 'md',
}) => {
  const isLight = variant === 'light';
  
  const iconSizes = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
  };

  const titleSizes = {
    sm: 'text-xs sm:text-sm tracking-widest',
    md: 'text-xs sm:text-base md:text-xl tracking-[0.12em] sm:tracking-[0.18em]',
    lg: 'text-lg sm:text-2xl md:text-3xl tracking-[0.18em] sm:tracking-[0.25em]',
  };

  const taglineSizes = {
    sm: 'text-[7px] sm:text-[8px] tracking-[0.12em]',
    md: 'text-[7px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.2em]',
    lg: 'text-[9px] sm:text-xs md:text-sm tracking-[0.16em] sm:tracking-[0.25em]',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-1.5 sm:gap-2.5 md:gap-3 group select-none shrink-0 ${className}`}>
      {/* Luxury Brand Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm transition-transform duration-500 group-hover:scale-105">
          {/* Outer circle subtle border */}
          <circle cx="50" cy="50" r="46" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          
          {/* Botanical leaf laurel flourishes */}
          <path d="M22 36C21 28 28 23 35 27C31 34 26 36 22 36Z" fill="url(#goldGradient)" opacity="0.85" />
          <path d="M18 50C16 42 22 37 30 40C26 47 22 50 18 50Z" fill="url(#goldGradient)" opacity="0.85" />
          <path d="M78 36C79 28 72 23 65 27C69 34 74 36 78 36Z" fill="url(#goldGradient)" opacity="0.85" />
          <path d="M82 50C84 42 78 37 70 40C74 47 78 50 82 50Z" fill="url(#goldGradient)" opacity="0.85" />
          
          {/* Mannequin head dot */}
          <circle cx="50" cy="24" r="5" fill="url(#goldGradient)" />
          
          {/* Mannequin neck and royal neckline */}
          <path d="M47 30H53L57 37L50 42L43 37L47 30Z" fill="url(#goldGradient)" />
          
          {/* Luxury draped gown silhouette */}
          <path d="M43 37C45 44 44 50 38 64C44 58 48 55 50 55C52 55 56 58 62 64C56 50 55 44 57 37L50 42L43 37Z" fill="url(#goldGradient)" />
          
          {/* Flowing gown center pleat */}
          <path d="M50 55C47 65 42 74 32 80C42 77 48 72 50 63C52 72 58 77 68 80C58 74 53 65 50 55Z" fill="#FAF5E8" />
          <path d="M50 63C47 70 44 76 38 80C44 78 48 74 50 63Z" fill="url(#goldGradient)" opacity="0.9" />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5E4B2" />
              <stop offset="0.4" stopColor="#D4AF37" />
              <stop offset="0.8" stopColor="#B38B28" />
              <stop offset="1" stopColor="#8C6819" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <span
          className={`font-serif font-bold uppercase transition-colors duration-300 whitespace-nowrap ${
            isLight ? 'text-white' : 'text-neutral-900'
          } ${titleSizes[size]}`}
        >
          Luqman <span className="text-gold-500 font-normal">Fabrics</span>
        </span>
        {showTagline && (
          <span
            className={`font-sans font-medium uppercase transition-colors duration-300 hidden sm:block ${
              isLight ? 'text-amber-100/70' : 'text-neutral-500'
            } ${taglineSizes[size]}`}
          >
            Quality You Feel, Style You Love
          </span>
        )}
      </div>
    </Link>
  );
};
