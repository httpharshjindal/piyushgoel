import type { CardData } from "@/app/lib/default-data";

export const emptyCard: CardData = {
  id: "",
  section: "work",
  type: "youtube",
  title: "",
  description: "",
  url: "",
  imageUrl: "",
  useCustomThumbnail: false,
  embed: true,
  size: "standard",
  sortOrder: 0,
  metadata: {},
};

export function getYoutubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/);
  return match?.[1] || "";
}

export function getYoutubeEmbedUrl(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
}

export function getYoutubeThumbnail(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export function normalizeCard(card: Partial<CardData>): CardData {
  return {
    ...emptyCard,
    ...card,
    embed: card?.embed ?? true,
    useCustomThumbnail: card?.useCustomThumbnail ?? false,
  } as CardData;
}
