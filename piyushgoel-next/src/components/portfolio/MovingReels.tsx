"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { CardData, SectionData } from "@/app/lib/default-data";

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

export function MovingReels({ section, cards, adminMode, onAdd, onEdit, onRemove, onEditSection, onRemoveSection }: MovingReelsProps) {
  const imageUrls = useMemo(() => cards.filter((c) => c.imageUrl).map((c) => c.imageUrl), [cards]);

  const rows = useMemo(() => {
    if (imageUrls.length < 6) return [];
    const chunkSize = Math.ceil(imageUrls.length / 3);
    return [
      { photos: imageUrls.slice(0, chunkSize), direction: "left", duration: 26 },
      { photos: imageUrls.slice(chunkSize, chunkSize * 2), direction: "right", duration: 32 },
      { photos: imageUrls.slice(chunkSize * 2, chunkSize * 3), direction: "left", duration: 22 },
    ].filter((r) => r.photos.length > 0);
  }, [imageUrls]);

  return (
    <div className="w-full flex items-center justify-center bg-black py-6 relative">
      {adminMode && (
        <div className="absolute top-4 right-4 z-30 flex gap-2 rounded-full border border-white/10 bg-black/60 p-1.5 backdrop-blur-md">
          {onEditSection && (
            <button type="button" className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors" onClick={() => onEditSection(section!)}>Edit Section</button>
          )}
          {onRemoveSection && (
            <button type="button" className="rounded-full border border-red-500/20 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors" onClick={() => onRemoveSection(section!)}>Remove</button>
          )}
          {onAdd && (
            <button type="button" className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-white/90 transition-colors" onClick={() => onAdd(section!.sectionId)}>+ Add Image</button>
          )}
        </div>
      )}

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

      <div className="relative bg-black overflow-hidden" style={{ width: "min(92vw, 405px)", aspectRatio: "9 / 16", borderRadius: 18 }}>
        <div className="absolute inset-0 flex flex-col justify-center gap-[10px]">
          {rows.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/30 text-xs">
              {adminMode ? "Add images to fill the reel" : ""}
            </div>
          ) : (
            rows.map((row, i) => (
              <div key={i} className="overflow-hidden w-full">
                <div className={`row-track ${row.direction === "left" ? "row-left" : "row-right"}`} style={{ animationDuration: `${row.duration}s` }}>
                  {[...row.photos, ...row.photos].map((src, idx) => (
                    <Image key={idx} src={src} alt="" width={108} height={140} draggable={false} className="select-none object-cover flex-shrink-0" style={{ borderRadius: 14 }} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 92%, rgba(0,0,0,0.9) 100%)" }} />
      </div>
    </div>
  );
}
