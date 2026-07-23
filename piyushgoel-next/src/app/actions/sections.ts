"use server";

import { revalidatePath } from "next/cache";
import { createSection, deleteSection, updateSection } from "@/db/dal";
import type { SectionInput } from "@/db/dal";

function cleanSection(input: Partial<SectionInput>): SectionInput {
  return {
    sectionId: input.sectionId || "",
    title: input.title || "Untitled Section",
    note: input.note || "",
    sortOrder: Number(input.sortOrder || 0),
    createdBy: process.env.ADMIN_USER_ID || "admin",
    updatedBy: process.env.ADMIN_USER_ID || "admin",
  };
}

export async function saveSectionAction(input: Partial<SectionInput> & { id?: string }) {
  try {
    const payload = cleanSection(input);
    const section = input.id
      ? await updateSection(input.id, payload)
      : await createSection(payload);

    revalidatePath("/");
    revalidatePath("/admin");

    return { ok: true, section };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function deleteSectionAction(id: string) {
  try {
    await deleteSection(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
