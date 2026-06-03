'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const DURATION = 5000;

// Replace `image` null with a real path string when images are ready.
// e.g. image: '/hero/banner-1.jpg'
const SLIDES: { id: number; image: string | null; bg: string; alt: string }[] = [
  { id: 1, image: null, bg: 'linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%)', alt: 'Banner 1' },
  { id: 2, image: null, bg: 'linear-gradient(135deg,#1c0a0a 0%,#3b1010 100%)', alt: 'Banner 2' },
  { id: 3, image: null, bg: 'linear-gradient(135deg,#0a0a1c 0%,#10103b 100%)', alt: 'Banner 3' },
  { id: 4, image: null, bg: 'linear-gradient(135deg,#0a1c0a 0%,#10301a 100%)', alt: 'Banner 4' },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [barKey, setBarKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setBarKey(k => k + 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      goTo((current + 1) % SLIDES.length);
    }, DURATION);
    return () => clearTimeout(timer);
  }, [current, goTo]);

  return (
    <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[400px] overflow-hidden bg-[#111111]">

      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : 0,
            background: slide.bg,
          }}
        >
          {slide.image ? (
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          ) : (
            /* Placeholder visible while images aren't ready */
            <div className="flex h-full items-center justify-center select-none">
              <span className="text-white/10 text-sm font-light tracking-[0.3em] uppercase">
                Imagen {i + 1}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goTo(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            className="rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width:  i === current ? 22 : 8,
              height: 8,
              backgroundColor:
                i === current ? '#D61C1C' : 'rgba(255,255,255,0.40)',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-10">
        <div
          key={barKey}
          className="h-full origin-left"
          style={{
            backgroundColor: '#D61C1C',
            animation: `heroProgressBar ${DURATION}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
