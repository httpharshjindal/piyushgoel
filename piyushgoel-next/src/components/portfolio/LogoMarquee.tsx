"use client";

import Image from "next/image";
import type { CardData } from "@/app/lib/default-data";

interface LogoMarqueeProps {
  cards: CardData[];
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
}

export function LogoMarquee({ cards, adminMode, onEdit, onRemove }: LogoMarqueeProps) {
  if (cards.length === 0) return null;

  const allCards = [...cards, ...cards, ...cards];

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/35 bg-white/45 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div
        className="flex gap-12"
        style={{
          animation: "marquee 40s linear infinite",
          width: "max-content",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
      >
        {allCards.map((card, i) => (
          <div key={`${card.id}-${i}`} className="relative flex flex-shrink-0 items-center justify-center rounded-2xl bg-white/45 px-8 py-4 shadow-sm" style={{ width: 168, height: 108 }}>
            {adminMode ? (
              <div className="absolute -top-1 -right-1 z-20 flex gap-1">
                <button className="rounded-full border border-ink/10 bg-white/90 px-2 py-0.5 text-xs shadow-sm" onClick={() => onEdit?.(card)}>Edit</button>
                <button className="rounded-full bg-oxblood px-2 py-0.5 text-xs text-white shadow-sm" onClick={() => onRemove?.(card)}>X</button>
              </div>
            ) : null}
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-contain opacity-55 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="text-center text-sm font-semibold text-ink/45">{card.title}</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
