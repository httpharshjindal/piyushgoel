"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { CardData, SectionData } from "@/app/lib/default-data";

function platformIcon(url: string) {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
      </svg>
    );
  if (u.includes("instagram.com"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.35 2.63 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.63 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C21.73 2.7 19.3.27 14.95.07 13.67.01 13.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.41a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"/>
      </svg>
    );
  if (u.includes("facebook.com") || u.includes("fb.com"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/>
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

interface MovingReelsProps {
  section?: SectionData;
  cards: CardData[];
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
  onAdd?: (sectionId: string) => void;
  onEditSection?: (section: SectionData) => void;
  onRemoveSection?: (section: SectionData) => void;
}

export function MovingReels({ section, cards, adminMode, onEdit }: MovingReelsProps) {
  const imageCards = useMemo(() => cards.filter((c) => c.imageUrl), [cards]);

  const rows = useMemo(() => {
    if (imageCards.length === 0) return [];
    const chunkSize = Math.ceil(imageCards.length / 3);
    return [
      { cards: imageCards.slice(0, chunkSize), direction: "left", duration: 50 },
      { cards: imageCards.slice(chunkSize, chunkSize * 2), direction: "right", duration: 60 },
      { cards: imageCards.slice(chunkSize * 2), direction: "left", duration: 45 },
    ].filter((r) => r.cards.length > 0);
  }, [imageCards]);

  return (
    <div className="w-full relative">
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .row-track {
          display: flex;
          width: max-content;
          gap: 10px;
        }
        .row-left  { animation: scroll-left  linear infinite; }
        .row-right { animation: scroll-right linear infinite; }
      `}</style>

      {rows.length === 0 ? (
        adminMode ? <div className="text-center text-muted text-sm py-8">Add images to fill this section</div> : null
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={i} className="overflow-hidden w-full">
              <div className={`row-track ${row.direction === "left" ? "row-left" : "row-right"}`} style={{ animationDuration: `${row.duration}s` }}>
                {[...row.cards, ...row.cards].map((card, idx) => (
                  <div
                    key={idx}
                    className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => {
                      if (adminMode) onEdit?.(card);
                      else if (card.url) window.open(card.url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <div className="w-[120px] h-[213px] overflow-hidden rounded-xl">
                      <Image
                        src={card.imageUrl}
                        alt=""
                        fill
                        draggable={false}
                        className="select-none pointer-events-none"
                        style={{
                          objectFit: "cover",
                          objectPosition: `${50 + (card.metadata?.cropX as number || 0)}% ${50 + (card.metadata?.cropY as number || 0)}%`,
                          transform: `scale(${card.metadata?.cropZoom as number || 1})`,
                        }}
                      />
                    </div>
                    {adminMode && (
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white pointer-events-none">
                        Edit
                      </div>
                    )}
                    {!adminMode && card.url && (
                      <div className="absolute top-1.5 left-1.5 rounded bg-black/50 p-1 text-white pointer-events-none">
                        {platformIcon(card.url)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
