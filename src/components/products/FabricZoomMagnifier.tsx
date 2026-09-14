'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface FabricZoomMagnifierProps {
  src: string;
  alt: string;
  zoomLevel?: number;
}

export const FabricZoomMagnifier: React.FC<FabricZoomMagnifierProps> = ({
  src,
  alt,
  zoomLevel = 2.5,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const elem = imgRef.current;
    if (elem) {
      const { width, height } = elem.getBoundingClientRect();
      setSize([width, height]);
      setShowMagnifier(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const elem = imgRef.current;
    if (elem) {
      const { top, left } = elem.getBoundingClientRect();
      const xPos = e.pageX - left - window.scrollX;
      const yPos = e.pageY - top - window.scrollY;
      setXY([xPos, yPos]);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      ref={imgRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full cursor-crosshair overflow-hidden rounded-2xl bg-pearl-100 border border-pearl-300"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
        priority
      />

      {/* Floating Zoom Loupe Lens */}
      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: '140px',
            width: '140px',
            top: `${y - 70}px`,
            left: `${x - 70}px`,
            opacity: 1,
            border: '2px solid rgba(212, 175, 55, 0.8)',
            borderRadius: '50%',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + 70}px`,
            backgroundPositionY: `${-y * zoomLevel + 70}px`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25), 0 0 15px rgba(212,175,55,0.4)',
            zIndex: 30,
          }}
        />
      )}

      {/* Helper Badge */}
      <div className="absolute bottom-3 right-3 bg-charcoal-900/80 backdrop-blur-sm text-pearl-100 text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-full pointer-events-none">
        Hover to Inspect Weave
      </div>
    </div>
  );
};
