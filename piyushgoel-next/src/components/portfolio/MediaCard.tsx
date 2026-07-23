"use client";

import Image from "next/image";
import { getYoutubeThumbnail, getYoutubeId, normalizeCard } from "./cardUtils";
import { InstagramEmbed } from "./InstagramEmbed";
import { YouTubePlayer } from "./YouTubePlayer";
import type { CardData } from "@/app/lib/default-data";

const logoSizeMap: Record<string, number> = {
  small: 48,
  standard: 80,
  large: 112,
};

interface MediaCardProps {
  card: Partial<CardData>;
  adminMode?: boolean;
  onEdit?: (card: CardData) => void;
  onRemove?: (card: CardData) => void;
  onAudit?: (card: CardData) => void;
  fixedHeight?: number;
}

export function MediaCard({ card, adminMode, onEdit, onRemove, onAudit, fixedHeight }: MediaCardProps) {
  const item = normalizeCard(card);
  const thumbnail = item.imageUrl || getYoutubeThumbnail(item.url);
  const videoId = getYoutubeId(item.url);
  const meta = item.metadata || {};
  const published = meta.published as boolean | undefined;
  const badge = meta.badge as string | undefined;
  const linkText = meta.linkText as string | undefined;
  const tags = meta.tags as string | undefined;
  const bgColor = meta.bgColor as string | undefined;

  const aspectMap: Record<string, string> = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
  };
  const aspectClass = aspectMap[(meta.aspectRatio as string)] || "aspect-video";
  const isPublished = published !== false;

  if (!adminMode && !isPublished) return null;

  function renderMedia() {
    if (item.type === "company") {
      const logoPx = /^\d+$/.test(item.size) ? Number(item.size) : (logoSizeMap[item.size] || 80);
      return (
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-paper p-3">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-contain"
            />
          ) : (
            <span className="text-sm text-muted">No Logo</span>
          )}
        </div>
      );
    }

    if (item.type === "youtube" && item.embed && !item.useCustomThumbnail && videoId) {
      return <YouTubePlayer videoId={videoId} title={item.title} />;
    }

    if (item.type === "instagram" && item.embed) {
      return <InstagramEmbed url={item.url} />;
    }

    if (thumbnail) {
      return (
        <a
          href={item.url || "#"}
          target="_blank"
          rel="noreferrer"
          className="relative block overflow-hidden"
          onClick={() => onAudit?.(item)}
        >
          <Image className={`${aspectClass} w-full object-cover`} src={thumbnail} alt={item.title} width={640} height={360} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10">
            <svg className="h-12 w-12 text-white drop-shadow-lg opacity-80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </a>
      );
    }

    return (
      <a
        href={item.url || "#"}
        target="_blank"
        rel="noreferrer"
        className={`flex ${aspectClass} items-center justify-center bg-paper text-sm font-semibold text-oxblood`}
        onClick={() => onAudit?.(item)}
      >
        {item.type === "instagram" ? "Open Instagram" : linkText || "Open Link"}
      </a>
    );
  }

  return (
    <article
      className="group relative overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_10px_30px_rgba(40,24,18,0.06)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(40,24,18,0.12)]"
      style={{
        ...(bgColor ? { backgroundColor: bgColor } : {}),
        ...(fixedHeight ? { height: fixedHeight } : {}),
      }}
    >
      {!isPublished && adminMode ? (
        <div className="absolute left-2 top-2 z-20 rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-bold text-yellow-800">
          Draft
        </div>
      ) : null}

      {badge ? (
        <div className="absolute left-2 top-2 z-20 rounded-full bg-oxblood px-2 py-0.5 text-xs font-bold text-white">
          {badge}
        </div>
      ) : null}

      {adminMode ? (
        <div className="absolute right-2 top-2 z-20 flex gap-2">
          <button
            type="button"
            className="rounded-full border border-ink/10 bg-white/90 px-3 py-1 text-sm shadow-sm hover:bg-white"
            onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full bg-oxblood px-3 py-1 text-sm text-white shadow-sm"
            onClick={(e) => { e.stopPropagation(); onRemove?.(item); }}
          >
            Remove
          </button>
        </div>
      ) : null}

      <div className="[&>div:first-child]:rounded-t-lg [&>iframe]:rounded-t-lg">
        {renderMedia()}
      </div>

      <div className="px-4 pb-4 pt-3">
        <h3 className="text-base font-bold leading-tight text-ink">{item.title || "Untitled"}</h3>
        <p className="mt-1.5 text-sm leading-5 text-muted">{item.description}</p>
        {tags ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.split(",").map((tag) => (
              <span key={tag.trim()} className="rounded-full border border-ink/10 px-2 py-0.5 text-xs text-muted">
                {tag.trim()}
              </span>
            ))}
          </div>
        ) : null}
        {item.url && !thumbnail && !(item.type === "youtube" && item.embed) ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-oxblood hover:underline"
            onClick={() => onAudit?.(item)}
          >
            {linkText || "Visit Link"} &rarr;
          </a>
        ) : null}
      </div>
    </article>
  );
}
