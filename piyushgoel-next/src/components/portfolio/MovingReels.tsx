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
  const imageCards = useMemo(() => cards.filter((c) => c.imageUrl), [cards]);

  return (
    <div className="w-full relative">
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

      {imageCards.length === 0 ? (
        adminMode ? <div className="text-center text-muted text-sm py-8">Add images to fill this section</div> : null
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {imageCards.map((card) => (
            <div key={card.id} className="flex-shrink-0 w-[180px]">
              <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                <Image src={card.imageUrl} alt={card.title || ""} fill className="object-cover" />
              </div>
              {card.title && <p className="mt-1.5 text-sm font-medium text-ink truncate">{card.title}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
