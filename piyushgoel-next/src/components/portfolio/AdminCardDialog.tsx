"use client";

import { useMemo } from "react";
import { emptyCard, normalizeCard } from "./cardUtils";
import { MediaCard } from "./MediaCard";
import type { CardData } from "@/app/lib/default-data";

interface AdminCardDialogProps {
  open: boolean;
  draft: CardData | null;
  onChange: (card: CardData) => void;
  onClose: () => void;
  onSave: (card: CardData) => void;
}

const fieldClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm";

export function AdminCardDialog({ open, draft, onChange, onClose, onSave }: AdminCardDialogProps) {
  const card = useMemo(() => normalizeCard(draft || emptyCard), [draft]);

  if (!open) return null;

  function update<K extends keyof CardData>(field: K, value: CardData[K]) {
    const next = { ...card, [field]: value };
    if (field === "url" && typeof value === "string") {
      const url = value.toLowerCase();
      if (url.includes("instagram.com")) {
        next.type = "instagram" as unknown as string;
        next.embed = true;
      } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
        next.type = "youtube" as unknown as string;
        next.embed = true;
      }
    }
    if (field === "type" && value === "company" && !/^\d+$/.test(card.size)) {
      next.size = "80" as unknown as string;
    }
    onChange(next);
  }

  function updateMeta(key: string, value: unknown) {
    onChange({ ...card, metadata: { ...card.metadata, [key]: value } });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="grid max-h-[92vh] w-full max-w-5xl grid-cols-[1fr_380px] gap-5 overflow-auto rounded-lg bg-paper p-5 shadow-2xl max-[860px]:grid-cols-1">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(card);
          }}
        >
          <div>
            <h2 className="font-serif text-4xl font-bold text-oxblood">Card Editor</h2>
            <p className="mt-1 text-sm text-muted">Changes preview instantly on the right.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-[680px]:grid-cols-1">
            <label className="grid gap-1 text-sm">
              Section
              <select className={fieldClass} value={card.section} onChange={(e) => update("section", e.target.value)}>
                <option value="work">Previous Work</option>
                <option value="social">Social Work</option>
                <option value="companies">Companies</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              URL Type
              <select className={fieldClass} value={card.type} onChange={(e) => update("type", e.target.value)}>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="custom">Custom Link</option>
                <option value="company">Company</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            Title
            <input className={fieldClass} value={card.title} onChange={(e) => update("title", e.target.value)} />
          </label>

          <label className="grid gap-1 text-sm">
            Description
            <textarea className={`${fieldClass} min-h-24`} value={card.description} onChange={(e) => update("description", e.target.value)} />
          </label>

          <label className="grid gap-1 text-sm">
            URL
            <input className={fieldClass} value={card.url} onChange={(e) => update("url", e.target.value)} />
          </label>

          <label className="grid gap-1 text-sm">
            Custom Thumbnail / Image URL
            <input className={fieldClass} value={card.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
          </label>

          <div className="grid grid-cols-2 gap-3 max-[680px]:grid-cols-1">
            <label className="grid gap-1 text-sm">
              Sort Order
              <input className={fieldClass} type="number" value={card.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} />
            </label>
            {card.type === "company" ? (
              <label className="grid gap-1 text-sm">
                Logo Size: <span className="font-semibold text-oxblood">{card.size}px</span>
                <input
                  type="range" min="32" max="2000" step="20" className="w-full accent-oxblood"
                  value={/^\d+$/.test(card.size) ? card.size : "80"}
                  onChange={(e) => update("size", e.target.value)}
                />
              </label>
            ) : (
              <>
                <label className="grid gap-1 text-sm">
                  Card Size
                  <select className={fieldClass} value={card.size} onChange={(e) => update("size", e.target.value)}>
                    <option value="standard">Standard</option>
                    <option value="wide">Wide</option>
                    <option value="compact">Compact</option>
                  </select>
                </label>
                <div className="grid content-end gap-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={card.embed} onChange={(e) => update("embed", e.target.checked)} />
                    Embed
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={card.useCustomThumbnail} onChange={(e) => update("useCustomThumbnail", e.target.checked)} />
                    Custom thumbnail
                  </label>
                </div>
              </>
            )}
          </div>

          {card.type !== "company" ? (
            <label className="grid gap-1 text-sm">
              Media Aspect Ratio
              <select className={fieldClass} value={(card.metadata?.aspectRatio as string) || "16:9"} onChange={(e) => updateMeta("aspectRatio", e.target.value)}>
                <option value="16:9">YouTube / Landscape (16:9)</option>
                <option value="9:16">Shorts / Reels (9:16)</option>
                <option value="1:1">Square (1:1)</option>
                <option value="4:3">Standard (4:3)</option>
              </select>
            </label>
          ) : null}

          <details className="rounded-lg border border-ink/10 bg-white/50">
            <summary className="cursor-pointer px-3 py-2 text-sm font-bold text-muted hover:text-ink">
              Advanced Options
            </summary>
            <div className="grid gap-3 border-t border-ink/10 p-3">
              <label className="grid gap-1 text-sm">
                Badge / Label
                <input className={fieldClass} placeholder="e.g. Featured, New, Award" value={(card.metadata?.badge as string) || ""} onChange={(e) => updateMeta("badge", e.target.value)} />
              </label>
              <label className="grid gap-1 text-sm">
                Link Button Text
                <input className={fieldClass} placeholder="e.g. Watch Now, Visit Site" value={(card.metadata?.linkText as string) || ""} onChange={(e) => updateMeta("linkText", e.target.value)} />
              </label>
              <label className="grid gap-1 text-sm">
                Tags (comma separated)
                <input className={fieldClass} placeholder="e.g. radio, hosting, news" value={(card.metadata?.tags as string) || ""} onChange={(e) => updateMeta("tags", e.target.value)} />
              </label>
              <label className="grid gap-1 text-sm">
                Background Color
                <div className="flex gap-2">
                  <input type="color" className="h-9 w-9 cursor-pointer rounded border border-ink/10" value={(card.metadata?.bgColor as string) || "#ffffff"} onChange={(e) => updateMeta("bgColor", e.target.value)} />
                  <input className={fieldClass} placeholder="#ffffff" value={(card.metadata?.bgColor as string) || ""} onChange={(e) => updateMeta("bgColor", e.target.value)} />
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={(card.metadata?.published as boolean) !== false} onChange={(e) => updateMeta("published", e.target.checked)} />
                Published (uncheck to hide this card)
              </label>
            </div>
          </details>

          <div className="flex justify-end gap-3">
            <button type="button" className="rounded-full border border-ink/10 px-5 py-3 font-bold" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-oxblood px-5 py-3 font-bold text-white">
              Save
            </button>
          </div>
        </form>

        <aside>
          <div className="sticky top-4">
            <h3 className="mb-3 text-sm font-bold uppercase text-muted">Live Preview</h3>
            <MediaCard card={card} />
          </div>
        </aside>
      </div>
    </div>
  );
}
