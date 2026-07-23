import { asc, eq } from "drizzle-orm";
import { db } from "./index";
import { auditEvents, cards, sections } from "./schema";

export interface CardInput {
  section?: string;
  type?: string;
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  useCustomThumbnail?: boolean;
  embed?: boolean;
  size?: string;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  updatedBy?: string;
}

export interface AuditInput {
  event: string;
  targetType?: string;
  targetId?: string;
  location?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface SectionInput {
  sectionId: string;
  title: string;
  note?: string;
  sortOrder?: number;
  createdBy?: string;
  updatedBy?: string;
}

// ── Cards ──

export async function listCards({ section }: { section?: string } = {}) {
  const query = db.select().from(cards).orderBy(asc(cards.sortOrder), asc(cards.createdAt));

  if (!section) {
    return query;
  }

  return db
    .select()
    .from(cards)
    .where(eq(cards.section, section))
    .orderBy(asc(cards.sortOrder), asc(cards.createdAt));
}

export async function createCard(input: CardInput) {
  const [card] = await db.insert(cards).values(input).returning();
  return card;
}

export async function updateCard(id: string, input: Partial<CardInput>) {
  const [card] = await db
    .update(cards)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(cards.id, id))
    .returning();
  return card;
}

export async function deleteCard(id: string) {
  const [card] = await db.delete(cards).where(eq(cards.id, id)).returning();
  return card;
}

// ── Sections ──

export async function listSections() {
  return db.select().from(sections).orderBy(asc(sections.sortOrder));
}

export async function createSection(input: SectionInput) {
  const [section] = await db.insert(sections).values(input).returning();
  return section;
}

export async function updateSection(id: string, input: Partial<SectionInput>) {
  const [section] = await db
    .update(sections)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(sections.id, id))
    .returning();
  return section;
}

export async function deleteSection(id: string) {
  const [section] = await db.delete(sections).where(eq(sections.id, id)).returning();
  return section;
}

// ── Audit ──

export async function createAuditEvent(input: AuditInput) {
  const [event] = await db.insert(auditEvents).values(input).returning();
  return event;
}
