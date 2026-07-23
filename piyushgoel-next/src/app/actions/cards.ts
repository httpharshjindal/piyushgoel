"use server";

import { revalidatePath } from "next/cache";
import { createCard, createAuditEvent, deleteCard, updateCard } from "@/db/dal";
import type { CardInput, AuditInput } from "@/db/dal";

function cleanCard(input: Partial<CardInput>): CardInput {
  return {
    section: input.section || "work",
    type: input.type || "youtube",
    title: input.title || "Untitled",
    description: input.description || "",
    url: input.url || "",
    imageUrl: input.imageUrl || "",
    useCustomThumbnail: Boolean(input.useCustomThumbnail),
    embed: Boolean(input.embed),
    size: input.size || "standard",
    sortOrder: Number(input.sortOrder || 0),
    updatedBy: process.env.ADMIN_USER_ID || "admin",
    createdBy: process.env.ADMIN_USER_ID || "admin",
  };
}

export async function saveCardAction(input: Partial<CardInput> & { id?: string }) {
  try {
    const payload = cleanCard(input);
    const card = input.id?.startsWith("seed-")
      ? await createCard(payload)
      : input.id
        ? await updateCard(input.id, payload)
        : await createCard(payload);

    revalidatePath("/");
    revalidatePath("/admin");

    return { ok: true, card };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function deleteCardAction(id: string) {
  try {
    if (!id || id.startsWith("seed-")) {
      return { ok: true, deletedId: id };
    }

    await deleteCard(id);
    revalidatePath("/");
    revalidatePath("/admin");

    return { ok: true, deletedId: id };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function auditAction(input: AuditInput) {
  try {
    await createAuditEvent({
      event: input.event || "click",
      targetType: input.targetType || "card",
      targetId: input.targetId || "",
      location: input.location || "portfolio",
      userId: input.userId || "anonymous",
      metadata: input.metadata || {},
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
