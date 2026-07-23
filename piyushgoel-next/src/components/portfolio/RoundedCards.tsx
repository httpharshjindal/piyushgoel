"use client";

import React from "react";
import { Users } from "lucide-react";
import type { CardData } from "@/app/lib/default-data";

const FAN_STEPS = [
  { rotate: 0, x: 0, y: 0 },
  { rotate: 9, x: 132, y: 46 },
  { rotate: 17, x: 252, y: 128 },
  { rotate: 24, x: 356, y: 230 },
];

const GRADIENTS = [
  "#7C5CFF",
  "#E24B6B",
  "#3AA0FF",
  "#20C997",
  "#4C6FFF",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
];

interface FannedCardDeckProps {
  items?: CardData[];
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
}

export function FannedCardDeck({
  items = [],
  adminMode,
  onEdit,
  onRemove,
}: FannedCardDeckProps) {
  const centerIndex = Math.floor((items.length - 1) / 2);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted">
        {adminMode ? <>No cards yet. Click &quot;Add Card&quot; to add one.</> : null}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-24 px-6">
      <style>{`
        .fan-card {
          position: absolute;
          transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--scale, 1));
          transform-origin: bottom center;
          transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
          z-index: var(--z);
          outline: none;
        }
        .fan-card:hover,
        .fan-card:focus-visible {
          --tx: 0px !important;
          --ty: -24px !important;
          --rot: 0deg !important;
          --scale: 1.08 !important;
          z-index: 60 !important;
        }
        .fan-card:hover .fan-card-inner,
        .fan-card:focus-visible .fan-card-inner {
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.55), 0 10px 20px -5px rgba(0,0,0,0.35) !important;
        }
        .fan-card:focus-visible .fan-card-inner {
          box-shadow: 0 0 0 3px rgba(255,255,255,0.7), 0 30px 60px -15px rgba(0,0,0,0.55) !important;
        }
      `}</style>

      <div
        className="relative flex items-center justify-center"
        style={{ height: 420, width: "100%", maxWidth: 980 }}
      >
        {items.map((item, i) => {
          const distance = i - centerIndex;
          const step = FAN_STEPS[Math.min(Math.abs(distance), FAN_STEPS.length - 1)];
          const side = Math.sign(distance);

          return (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.title}`}
              className="fan-card"
              style={
                {
                  "--tx": `${step.x * side}px`,
                  "--ty": `${step.y}px`,
                  "--rot": `${step.rotate * side}deg`,
                  "--z": 10 + (FAN_STEPS.length - Math.abs(distance)),
                } as React.CSSProperties
              }
            >
              <Card
                item={item}
                index={i}
                adminMode={adminMode}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

type CardProps = {
  item: CardData;
  index: number;
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
};

function Card({ item, index, adminMode, onEdit, onRemove }: CardProps) {
  const meta = item.metadata ?? {};
  const tag = typeof meta.tag === "string" ? meta.tag : "";
  const score = typeof meta.score === "number" ? meta.score : 0;
  const color = typeof meta.color === "string" ? meta.color : GRADIENTS[index % GRADIENTS.length];

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove?.(item);
  };

  return (
    <div
      className="fan-card-inner relative overflow-hidden select-none"
      style={{
        width: 220,
        height: 300,
        borderRadius: "28px 28px 0 0",
        background: `linear-gradient(180deg, ${color} 0%, ${shade(color, -18)} 100%)`,
        boxShadow: "0 18px 30px -12px rgba(0,0,0,0.45)",
        transition: "box-shadow 380ms ease",
      }}
    >
      {adminMode && (
        <div className="absolute right-2 top-2 z-20 flex gap-1.5">
          <button
            type="button"
            className="rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur hover:bg-black/60"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-red-600"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
        <div>
          <div className="text-white font-semibold text-[19px] leading-tight tracking-tight">
            {item.title}
          </div>
          <div className="text-white/75 text-[12px] mt-0.5">{tag}</div>
        </div>
        <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm rounded-full pl-1.5 pr-2 py-1">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/25">
            <Users size={10} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="text-white text-[11px] font-medium">{score}</span>
        </div>
      </div>

      <img
        src={item.imageUrl || `https://picsum.photos/seed/${item.title.toLowerCase().replace(/\s+/g, "-")}/400/520`}
        alt={item.title}
        draggable={false}
        className="absolute bottom-0 left-0 right-0 w-full object-cover"
        style={{ height: "72%" }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.12) 100%)",
        }}
      />
    </div>
  );
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
