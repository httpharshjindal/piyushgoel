import { listCards, listSections } from "@/db/dal";
import { defaultCards, defaultSections } from "./default-data";
import type { CardData, SectionData } from "./default-data";

function normalizeDbCard(card: Awaited<ReturnType<typeof listCards>>[number]): CardData {
  return {
    id: card.id,
    section: card.section,
    type: card.type,
    title: card.title,
    description: card.description ?? "",
    url: card.url ?? "",
    imageUrl: card.imageUrl ?? "",
    useCustomThumbnail: card.useCustomThumbnail ?? false,
    embed: card.embed ?? false,
    size: card.size ?? "standard",
    sortOrder: card.sortOrder ?? 0,
    metadata: (card.metadata as Record<string, unknown> | undefined) ?? undefined,
  };
}

export async function getPortfolioCards(): Promise<CardData[]> {
  try {
    const cards = await listCards();
    if (cards.length > 0) {
      const dbCards = cards.map(normalizeDbCard);
      const dbIds = new Set(dbCards.map((c) => c.id));
      const missingDefaultCards = defaultCards.filter((d) => !dbIds.has(d.id));
      return [...dbCards, ...missingDefaultCards];
    }
    return defaultCards;
  } catch {
    return defaultCards;
  }
}

export async function getPortfolioSections(): Promise<SectionData[]> {
  try {
    const dbSections = await listSections();
    if (dbSections.length > 0) {
      const dbMapped = dbSections.map((s) => ({
        id: s.id,
        sectionId: s.sectionId,
        title: s.title,
        note: s.note,
        sortOrder: s.sortOrder,
        metadata: (s.metadata as Record<string, unknown> | undefined) ?? undefined,
      }));
      const dbIds = new Set(dbMapped.map((s) => s.sectionId));
      const missingDefaults = defaultSections.filter((d) => !dbIds.has(d.sectionId));
      return [...dbMapped, ...missingDefaults];
    }
    return defaultSections;
  } catch {
    return defaultSections;
  }
}
