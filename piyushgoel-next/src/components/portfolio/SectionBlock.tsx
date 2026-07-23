"use client";

import { motion } from "framer-motion";
import { MediaCard } from "./MediaCard";
import { CardCarousel } from "./CardCarousel";
import { VideoProvider } from "./VideoContext";
import { TestimonialStrip } from "./TestimonialStrip";
import { FannedCardDeck } from "./RoundedCards";
import { MovingReels } from "./MovingReels";
import type { CardData, SectionData } from "@/app/lib/default-data";

interface SectionBlockProps {
  section: SectionData;
  cards: CardData[];
  adminMode?: boolean;
  onAdd: (sectionId: string) => void;
  onEdit: (card: CardData) => void;
  onRemove: (card: CardData) => void;
  onAudit: (card: CardData) => void;
  onEditSection?: (section: SectionData) => void;
  onRemoveSection?: (section: SectionData) => void;
}

export function SectionBlock({ section, cards, adminMode, onAdd, onEdit, onRemove, onAudit, onEditSection, onRemoveSection }: SectionBlockProps) {
  const meta = section.metadata || {};
  const hidden = meta.hidden as boolean;
  const layout = (meta.layout as string) || "carousel";
  const accentColor = (meta.accentColor as string) || "#8B3A3A";
  const columns = (meta.columns as number) || 3;
  const cardWidth = (meta.cardWidth as number) || 320;
  const fixedHeight = (meta.cardHeight as number) || undefined;

  if (!adminMode && hidden) return null;

  if (layout === "testimonials") {
    return (
      <TestimonialStrip
        section={section}
        cards={cards}
        adminMode={adminMode}
        onEdit={onEdit}
        onRemove={onRemove}
        onAdd={onAdd}
        onEditSection={onEditSection}
        onRemoveSection={onRemoveSection}
      />
    );
  }

  if (layout === "fan") {
    const fanCards = cards.filter((c) => c.type === "fan" || !c.type);
    return (
      <motion.section
        id={section.sectionId}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        {adminMode && (
          <div className="flex justify-end gap-2 mb-2">
            {onEditSection && (
              <button type="button" className="rounded-full border border-ink/10 px-3 py-1 text-sm" onClick={() => onEditSection(section)}>
                Edit Section
              </button>
            )}
            {onRemoveSection && (
              <button type="button" className="rounded-full border border-red-400/50 px-3 py-1 text-sm text-red-600" onClick={() => onRemoveSection(section)}>
                Remove Section
              </button>
            )}
            <button type="button" className="rounded-full bg-oxblood px-5 py-3 font-bold text-white" onClick={() => onAdd(section.sectionId)}>
              Add Card
            </button>
          </div>
        )}
        <FannedCardDeck items={fanCards} adminMode={adminMode} onEdit={onEdit} onRemove={onRemove} />
      </motion.section>
    );
  }

  if (layout === "reels") {
    return (
      <motion.section
        id={section.sectionId}
        className="mt-7 w-full"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <MovingReels
          section={section}
          cards={cards}
          adminMode={adminMode}
          onEdit={onEdit}
          onRemove={onRemove}
          onAdd={onAdd}
          onEditSection={onEditSection}
          onRemoveSection={onRemoveSection}
        />
      </motion.section>
    );
  }

  function renderCards() {
    if (section.sectionId === "companies") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {cards.map((card) => (
            <MediaCard key={card.id} card={card} adminMode={adminMode} onEdit={onEdit} onRemove={onRemove} onAudit={onAudit} fixedHeight={fixedHeight} />
          ))}
        </div>
      );
    }

    if (layout === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {cards.map((card) => (
            <MediaCard key={card.id} card={card} adminMode={adminMode} onEdit={onEdit} onRemove={onRemove} onAudit={onAudit} fixedHeight={fixedHeight} />
          ))}
        </div>
      );
    }

    if (layout === "list") {
      return (
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <MediaCard key={card.id} card={card} adminMode={adminMode} onEdit={onEdit} onRemove={onRemove} onAudit={onAudit} fixedHeight={fixedHeight} />
          ))}
        </div>
      );
    }

    return (
      <VideoProvider>
        <CardCarousel cardWidth={cardWidth}>
          {cards.map((card) => (
            <MediaCard key={card.id} card={card} adminMode={adminMode} onEdit={onEdit} onRemove={onRemove} onAudit={onAudit} fixedHeight={fixedHeight} />
          ))}
        </CardCarousel>
      </VideoProvider>
    );
  }

  const isWorkSection = section.sectionId === "work";

  return (
    <motion.section
      id={section.sectionId}
      className={`mt-5 sm:mt-7 rounded-lg border border-ink/10 px-4 sm:px-[18px] py-5 sm:py-7 shadow-[0_18px_50px_rgba(40,24,18,0.08)] ${section.metadata?.layout === "testimonials" ? "bg-transparent" : "bg-white/70"}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-none" style={{ color: accentColor }}>{section.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{section.note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {adminMode && onEditSection ? (
            <button type="button" className="rounded-full border border-ink/10 px-3 py-1 text-sm" onClick={() => onEditSection(section)}>
              Edit Section
            </button>
          ) : null}
          {adminMode && onRemoveSection ? (
            <button type="button" className="rounded-full border border-red-400/50 px-3 py-1 text-sm text-red-600" onClick={() => onRemoveSection(section)}>
              Remove Section
            </button>
          ) : null}
          {adminMode ? (
            <button type="button" className="rounded-full bg-oxblood px-5 py-3 font-bold text-white" onClick={() => onAdd(section.sectionId)}>
              Add Card
            </button>
          ) : null}
        </div>
      </div>

      {renderCards()}
    </motion.section>
  );
}
