"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useVideoState } from "./VideoContext";
import type { ReactNode } from "react";

interface CardCarouselProps {
  children: ReactNode[];
  cardWidth?: number;
}

export function CardCarousel({ children, cardWidth = 320 }: CardCarouselProps) {
  const total = children.length;
  const viewRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { isVideoPlaying } = useVideoState();
  const stopped = paused || isVideoPlaying || total <= 1;
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const doneRef = useRef(false);
  const speedRef = useRef(0.4);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const tick = useCallback(() => {
    if (doneRef.current) return;
    const el = viewRef.current;
    if (el) {
      const half = el.scrollWidth / 2;
      if (!stopped) {
        el.scrollLeft += speedRef.current;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [stopped]);

  useEffect(() => {
    doneRef.current = false;
    rafRef.current = requestAnimationFrame(tick);
    return () => { doneRef.current = true; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  const updateScrollButtons = useCallback(() => {
    const el = viewRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    const pos = el.scrollLeft % half;
    setCanScrollLeft(pos > 10);
    setCanScrollRight(pos < half - 10);
  }, []);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons, children]);

  const scrollBy = (direction: "left" | "right") => {
    const el = viewRef.current;
    if (!el) return;
    const amount = (cardWidth + 16) * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const onDragStart = (clientX: number) => {
    const el = viewRef.current;
    if (!el) return;
    dragRef.current = { active: true, startX: clientX, scrollLeft: el.scrollLeft };
  };

  const onDragMove = (clientX: number) => {
    if (!dragRef.current.active) return;
    const el = viewRef.current;
    if (!el) return;
    el.scrollLeft = dragRef.current.scrollLeft + (dragRef.current.startX - clientX);
  };

  const onDragEnd = () => {
    dragRef.current.active = false;
  };

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const amount = e.deltaX || e.deltaY;
      el.scrollLeft += amount * 0.6;
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  if (total === 0) return null;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); }}
    >
      <div
        ref={viewRef}
        className="flex overflow-hidden scroll-smooth"
        style={{ gap: "1rem" }}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        {children.map((child, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: cardWidth }}>
            {child}
          </div>
        ))}
        {children.map((child, i) => (
          <div key={`dup-${i}`} className="flex-shrink-0" style={{ width: cardWidth }}>
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() => scrollBy("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl disabled:opacity-0 disabled:pointer-events-none"
        aria-label="Scroll left"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollBy("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl disabled:opacity-0 disabled:pointer-events-none"
        aria-label="Scroll right"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
