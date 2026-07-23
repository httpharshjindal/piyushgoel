"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CardData, SectionData } from "@/app/lib/default-data";

interface TestimonialStripProps {
  section?: SectionData;
  cards: CardData[];
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
  onAdd?: (sectionId: string) => void;
  onEditSection?: (section: SectionData) => void;
  onRemoveSection?: (section: SectionData) => void;
}

// Premium presets for collectible cards
const GRADIENTS = [
  "linear-gradient(135deg, #0c1445 0%, #2563eb 60%, #60a5fa 100%)", // Deep Blue
  "linear-gradient(135deg, #3b0764 0%, #7c3aed 60%, #a78bfa 100%)", // Violet
  "linear-gradient(135deg, #022c22 0%, #059669 60%, #34d399 100%)", // Emerald
  "linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fbbf24 100%)", // Amber
  "linear-gradient(135deg, #831843 0%, #db2777 60%, #f472b6 100%)", // Rose
];

// SSR-Safe hook to detect desktop with a fine pointer and screen min-width
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const checkIsDesktop = () => {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isWideEnough = window.innerWidth >= 1024;
      setIsDesktop(isFinePointer && isWideEnough);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);
  return isDesktop;
}

// Sub-component to encapsulate mouse coordinates and holographic effect for each card
export function HolographicCard({
  card,
  index,
  layoutInfo,
  isHovered,
  onHoverStart,
  onHoverEnd,
  adminMode,
  onEdit,
  onRemove
}: {
  card: CardData;
  index: number;
  layoutInfo: {
    rotate: number;
    x: number;
    y: number;
    scale: number;
    zIndex: number;
  };
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
}) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const x = Math.max(15, Math.min(85, rawX));
    const y = Math.max(15, Math.min(85, rawY));
    setCoords({ x, y });
  };

  const meta = card.metadata || {};
  const role = (meta.role as string) || "";
  const company = (meta.company as string) || "";
  const projectName = (meta.projectName as string) || "";
  const service = (meta.service as string) || "";
  const tags = (meta.tags as string) || "";
  const preview = (meta.quotePreview as string) || card.description.slice(0, 75);
  const accent = (meta.accent as string) || GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      layout
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onMouseMove={handleMouseMove}
      className="absolute cursor-pointer select-none origin-center"
      style={{
        width: "350px",
        left: "calc(50% - 175px)",
        top: "40px",
        zIndex: layoutInfo.zIndex,
      }}
      animate={{
        x: layoutInfo.x,
        y: layoutInfo.y,
        rotate: layoutInfo.rotate,
        scale: layoutInfo.scale,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 22,
        mass: 0.8,
      }}
    >
      <div
        className="relative rounded-[30px] border border-white/15 transition-shadow duration-300 group"
        style={{
          background: accent,
          boxShadow: isHovered
            ? "0 45px 90px -20px rgba(0,0,0,0.85), 0 0 50px -5px rgba(255,255,255,0.2)"
            : "0 22px 50px -15px rgba(0,0,0,0.65), 0 0 35px -15px rgba(255,255,255,0.06)",
        }}
      >
        {/* Holographic Mouse Shine */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.35) 0%, transparent 40%)`,
          }}
        />

        {/* Premium Glass Highlights & Soft Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/12 to-transparent pointer-events-none" />

        <div className="relative p-4 flex flex-col min-h-[480px]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-lg font-bold text-white leading-tight">{card.title}</div>
              <div className="text-xs text-white/70">{role ? `${role}` : ""}{role && company ? " at " : ""}{company || ""}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-base leading-relaxed text-white/90 font-medium">
              &ldquo;{card.description}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Admin actions inside the card */}
      {adminMode && (
        <div className="absolute right-4 top-4 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur hover:bg-black/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(card);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full bg-red-600/80 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(card);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function TestimonialStrip({
  section,
  cards,
  adminMode,
  onEdit,
  onRemove,
  onAdd,
  onEditSection,
  onRemoveSection,
}: TestimonialStripProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isDesktop = useIsDesktop();

  // Show up to 5 cards in the fan composition
  const orderedCards = useMemo(() => cards.slice(0, 5), [cards]);

  if (orderedCards.length === 0) return null;

  // Compute layout values dynamically for the fan layout on desktop
  const layoutCards = orderedCards.map((card, index) => {
    const centerIndex = (orderedCards.length - 1) / 2;
    const offset = index - centerIndex;

    // Default stacked layout variables — petal effect: center card highest, outer cards lower
    const maxOffset = (orderedCards.length - 1) / 2;
    let rotate = Math.max(-20, Math.min(20, offset * 12));
    let x = offset * 150;
    let y = Math.pow(Math.abs(offset), 2) * 15; // center=0, next=15, edges=60
    let scale = 1 - Math.abs(offset) * 0.05;
    let zIndex = 30 - Math.abs(offset);

    // Apply active hovering adjustments
    if (hoveredIndex !== null) {
      if (index === hoveredIndex) {
        rotate = 0;
        y = maxOffset * 20 + 10; // push hovered card to the very bottom
        scale = 1.06;
        zIndex = 50;
      } else {
        const shiftAmount = index < hoveredIndex ? -45 : 45;
        x += shiftAmount;
        scale *= 0.93;
        y -= 10; // push non-hovered cards even higher
      }
    }

    return {
      card,
      index,
      offset,
      rotate,
      x,
      y,
      scale,
      zIndex,
    };
  });

  return (
    <div className="relative rounded-[32px] border border-white/10 bg-[#0B0B0F] px-4 py-5 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:px-6 overflow-hidden">
      {/* Absolute Background Perspective Grid */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] opacity-25 overflow-hidden"
        style={{
          perspective: "600px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="h-full w-full origin-bottom"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
            transform: "rotateX(62deg) scale(2.2)",
            maskImage: "linear-gradient(to top, black 20%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 90%)",
          }}
        />
      </div>

      {/* Glowing Blob Backdrops */}
      <div className="pointer-events-none absolute left-8 top-12 h-36 w-36 rounded-full bg-cyan-500/10 blur-[90px]" />
      <div className="pointer-events-none absolute right-12 top-24 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-12 left-1/3 h-48 w-48 rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Header Container */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 shadow-sm backdrop-blur-sm">
          <span>⭐</span> Trusted by Clients Worldwide
        </div>

        {/* Heading */}
        <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          {section?.title || "What People Say"}
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-5 text-sm leading-relaxed text-white/55 sm:text-sm md:text-base">
          {section?.note || "Here's what people have to say about working with me."}
        </p>
      </div>

      {/* Admin Floating Control Bar */}
      {adminMode && (
        <div className="absolute top-4 right-4 z-30 flex gap-2 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
          {onEditSection && (
            <button
              type="button"
              className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              onClick={() => onEditSection(section!)}
            >
              Edit Section Settings
            </button>
          )}
          {onRemoveSection && (
            <button
              type="button"
              className="rounded-full border border-red-500/20 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => onRemoveSection(section!)}
            >
              Remove Section
            </button>
          )}
          {onAdd && (
            <button
              type="button"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-white/90 transition-colors"
              onClick={() => onAdd(section!.sectionId)}
            >
              + Add Testimonial Card
            </button>
          )}
        </div>
      )}

      {/* Testimonials Deck / Area */}
      <div className="relative mt-4 min-h-[150px] md:min-h-[150px]">
        {isDesktop ? (
          /* Desktop Fanned Out Layout */
          <div className="relative mx-auto h-[400px] w-full max-w-[960px]">
            {layoutCards.map(({ card, index, rotate, x, y, scale, zIndex }) => (
              <HolographicCard
                key={card.id}
                card={card}
                index={index}
                layoutInfo={{ rotate, x, y, scale, zIndex }}
                isHovered={hoveredIndex === index}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                adminMode={adminMode}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </div>
        ) : (
          /* Mobile Horizontal Scrollable Snap Layout */
          <div className="-mx-4 overflow-x-auto px-4 pb-8 scrollbar-none snap-x snap-mandatory">
            <div className="flex gap-5 w-max mx-auto px-[8vw]">
              {orderedCards.map((card, idx) => {
                const meta = card.metadata || {};
                const role = (meta.role as string) || "";
                const company = (meta.company as string) || "";
                const preview = (meta.quotePreview as string) || card.description;
                const accent = (meta.accent as string) || GRADIENTS[idx % GRADIENTS.length];

                return (
                  <div
                    key={card.id}
                    className="w-[290px] sm:w-[350px] snap-center select-none"
                  >
                    <div className="w-full text-left rounded-[30px]">
                      <div
                        className="relative rounded-[30px] border border-white/15 p-4 flex flex-col min-h-[480px] shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
                        style={{ background: accent }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_35%)] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                        <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-bold text-white leading-tight">{card.title}</div>
                              <div className="text-[10px] text-white/70">{role ? `${role}` : ""}{role && company ? " at " : ""}{company || ""}</div>
                            </div>
                        </div>

                        <div className="mt-4 text-base leading-relaxed text-white/90 font-medium">
                          &ldquo;{card.description}&rdquo;
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
