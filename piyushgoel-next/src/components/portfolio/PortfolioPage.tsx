"use client";

import { useMemo, useState, useTransition } from "react";
import { auditAction, deleteCardAction, saveCardAction } from "@/app/actions/cards";
import { saveSectionAction, deleteSectionAction } from "@/app/actions/sections";
import { AdminCardDialog } from "./AdminCardDialog";
import { FanCardDialog } from "./FanCardDialog";
import { emptyCard, normalizeCard } from "./cardUtils";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { SectionBlock } from "./SectionBlock";
import type { CardData, SectionData } from "@/app/lib/default-data";
import type { SectionInput } from "@/db/dal";

const fieldClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm";

export function PortfolioPage({
  initialCards,
  initialSections,
  adminMode = false,
}: {
  initialCards: CardData[];
  initialSections: SectionData[];
  adminMode?: boolean;
}) {
  const [cards, setCards] = useState<CardData[]>(initialCards.map(normalizeCard));
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const [draft, setDraft] = useState<CardData | null>(null);
  const [sectionDraft, setSectionDraft] = useState<Partial<SectionData> & { id?: string } | null>(null);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeSectionIds = useMemo(() => new Set(sections.map((s) => s.sectionId)), [sections]);

  const cardsBySection = useMemo(() => {
    return sections.reduce<Record<string, CardData[]>>((acc, section) => {
      acc[section.sectionId] = cards
        .filter((card) => card.section === section.sectionId)
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
      return acc;
    }, {});
  }, [cards, sections]);

  function openNewCard(sectionId: string) {
    const isFan = sections.some((s) => s.sectionId === sectionId && (s.metadata?.layout as string) === "fan");
    setDraft({
      ...emptyCard,
      id: `local-${crypto.randomUUID()}`,
      section: sectionId,
      type: isFan ? "fan" : "youtube",
      sortOrder: cards.length + 1,
      metadata: isFan ? { tag: "", score: 0 } : {},
    });
  }

  function saveCard(card: CardData) {
    const nextCard = normalizeCard(card);
    setCards((current) => {
      const exists = current.some((item) => item.id === nextCard.id);
      return exists
        ? current.map((item) => (item.id === nextCard.id ? nextCard : item))
        : [...current, nextCard];
    });
    setDraft(null);
    setStatus("Saving...");

    startTransition(async () => {
      const result = await saveCardAction(nextCard);
      if (result.ok && result.card) {
        setCards((current) =>
          current.map((item) => (item.id === nextCard.id ? normalizeCard(result.card as CardData) : item)),
        );
        setStatus("Saved.");
      } else {
        setStatus(result.message ? `Local only: ${result.message}` : "Local only.");
      }
    });
  }

  function removeCard(card: CardData) {
    setCards((current) => current.filter((item) => item.id !== card.id));
    setStatus("Removing...");

    startTransition(async () => {
      const result = await deleteCardAction(card.id);
      setStatus(result.ok ? "Removed." : `Remove failed: ${result.message}`);
    });
  }

  function audit(card: CardData) {
    startTransition(async () => {
      await auditAction({
        event: "card_click",
        targetType: "card",
        targetId: card.id,
        location: adminMode ? "admin" : "portfolio",
        metadata: { title: card.title, url: card.url, type: card.type },
      });
    });
  }

  function saveSection(section: typeof sectionDraft) {
    if (!section) return;
    setSectionDraft(null);

    if (section.id) {
      setSections((current) =>
        current.map((s) =>
          s.id === section.id
            ? { ...s, title: section.title || s.title, note: section.note || s.note, metadata: section.metadata || s.metadata }
            : s,
        ),
      );
    } else {
      const newSection: SectionData = {
        id: section.sectionId || crypto.randomUUID(),
        sectionId: section.sectionId || "",
        title: section.title || "New Section",
        note: section.note || "",
        sortOrder: sections.length,
        metadata: section.metadata || {},
      };
      setSections((current) => [...current, newSection]);
    }

    setStatus("Saving section...");
    startTransition(async () => {
      const result = await saveSectionAction(section as Partial<SectionInput> & { id?: string });
      setStatus(result.ok ? "Section saved." : `Section error: ${result.message}`);
    });
  }

  function removeSection(section: SectionData) {
    setSections((current) => current.filter((s) => s.sectionId !== section.sectionId));
    setStatus("Removing section...");

    if (!section.id.startsWith("seed-")) {
      startTransition(async () => {
        await deleteSectionAction(section.id);
        setStatus("Section removed.");
      });
    }
  }

  return (
    <div className="px-[18px] pb-12 text-ink">
        <Header adminMode={adminMode} />

        {adminMode ? (
          <div className="mb-3 rounded-lg border border-oxblood/20 bg-white/70 px-4 py-3 text-sm text-muted">
            Admin mode active. Add, edit, remove cards and sections.
            {status ? <span className="ml-2 font-semibold text-oxblood">{status}</span> : null}
            {isPending ? <span className="ml-2">Working...</span> : null}
          </div>
        ) : null}

        {adminMode ? (
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className="rounded-full bg-oxblood px-5 py-3 font-bold text-white text-sm"
              onClick={() =>
                setSectionDraft({ sectionId: "", title: "", note: "", sortOrder: sections.length })
              }
            >
              + Add Section
            </button>
          </div>
        ) : null}

        <main>
          <Hero />

          <section
            id="about"
            className="mt-7 rounded-lg border border-ink/10 bg-white/70 px-[18px] py-7 shadow-[0_18px_50px_rgba(40,24,18,0.08)]"
          >
            <h2 className="font-serif text-5xl font-bold leading-none text-oxblood">About</h2>
            <p className="mt-4 max-w-4xl leading-8 text-muted">
              Hi, I&apos;m Piyush Goel, a Voice Artist, UGC Creator, and Content Host. I create
              work that feels natural and credible across commercials, digital ads, corporate films,
              podcasts, e-learning, and branded content. I also host radio shows and create on-camera
              content that connects quickly and stays clear. hii there
              
            </p>
          </section>

          {sections.filter((s) => s.metadata?.layout !== "fan").map((section) => (
            <SectionBlock
              key={section.sectionId}
              section={section}
              cards={cardsBySection[section.sectionId] || []}
              adminMode={adminMode}
              onAdd={openNewCard}
              onEdit={setDraft}
              onRemove={removeCard}
              onAudit={audit}
              onEditSection={(s) => setSectionDraft({ id: s.id, sectionId: s.sectionId, title: s.title, note: s.note, metadata: s.metadata })}
              onRemoveSection={removeSection}
            />
          ))}

          <section
            id="contact"
            className="mt-7 rounded-lg border border-ink/10 bg-white/70 px-[18px] py-7 shadow-[0_18px_50px_rgba(40,24,18,0.08)]"
          >
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2 className="font-serif text-5xl font-bold leading-none text-oxblood">Contact</h2>
                <p className="mt-4 leading-8 text-muted">
                  Email: <a href="mailto:goelpiyush314@gmail.com">goelpiyush314@gmail.com</a>
                  <br />
                  Phone: <a href="tel:+919690992005">9690992005</a>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  className="rounded-full bg-oxblood px-5 py-3 font-bold text-white"
                  href="mailto:goelpiyush314@gmail.com"
                >
                  Email
                </a>
                <a
                  className="rounded-full border border-ink/10 px-5 py-3 font-bold"
                  href="tel:+919690992005"
                >
                  Call
                </a>
              </div>
            </div>
          </section>
        </main>

        {draft?.type === "fan" ? (
          <FanCardDialog
            open={Boolean(draft)}
            draft={draft}
            onChange={setDraft}
            onClose={() => setDraft(null)}
            onSave={saveCard}
          />
        ) : (
          <AdminCardDialog
            open={Boolean(draft)}
            draft={draft}
            onChange={setDraft}
            onClose={() => setDraft(null)}
            onSave={saveCard}
          />
        )}

        {sectionDraft ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 p-4">
            <div className="my-8 mx-auto w-full max-w-lg rounded-lg bg-paper p-5 shadow-2xl">
              <h2 className="font-serif text-4xl font-bold text-oxblood">
                {sectionDraft.id ? "Edit Section" : "Add Section"}
              </h2>
              <form
                className="mt-4 grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSection(sectionDraft);
                }}
              >
                <label className="grid gap-1 text-sm">
                  Section ID (URL-friendly)
                  <input className={fieldClass} value={sectionDraft.sectionId || ""} onChange={(e) => setSectionDraft({ ...sectionDraft, sectionId: e.target.value })} required disabled={Boolean(sectionDraft.id)} pattern="[a-z0-9-]+" />
                </label>
                <label className="grid gap-1 text-sm">
                  Title
                  <input className={fieldClass} value={sectionDraft.title || ""} onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })} required />
                </label>
                <label className="grid gap-1 text-sm">
                  Description / Note
                  <textarea className={`${fieldClass} min-h-20`} value={sectionDraft.note || ""} onChange={(e) => setSectionDraft({ ...sectionDraft, note: e.target.value })} />
                </label>

                <details className="rounded-lg border border-ink/10 bg-white/50">
                  <summary className="cursor-pointer px-3 py-2 text-sm font-bold text-muted hover:text-ink">
                    Section Settings
                  </summary>
                  <div className="grid gap-3 border-t border-ink/10 p-3">
                    <label className="grid gap-1 text-sm">
                      Layout Style
                      <select className={fieldClass} value={(sectionDraft.metadata?.layout as string) || "carousel"} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, layout: e.target.value } })}>
                        <option value="carousel">Carousel (auto-scroll)</option>
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        <option value="fan">Fan Deck</option>
                        <option value="testimonials">Testimonials</option>
                      </select>
                    </label>

                    <label className="grid gap-1 text-sm">
                      Columns <span className="text-xs text-muted">(grid layout)</span>
                      <input type="number" min={1} max={8} className={fieldClass} value={(sectionDraft.metadata?.columns as number) || 3} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, columns: Number(e.target.value) } })} />
                    </label>

                    <label className="grid gap-1 text-sm">
                      Card Width (px) <span className="text-xs text-muted">(carousel)</span>
                      <input type="number" min={200} max={800} step={10} className={fieldClass} value={(sectionDraft.metadata?.cardWidth as number) || 320} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, cardWidth: Number(e.target.value) } })} />
                    </label>

                    <label className="grid gap-1 text-sm">
                      Card Height (px) <span className="text-xs text-muted">(fixed, 0 = auto)</span>
                      <input type="number" min={0} max={800} step={10} className={fieldClass} value={(sectionDraft.metadata?.cardHeight as number) || 0} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, cardHeight: Number(e.target.value) || undefined } })} />
                    </label>

                    <label className="grid gap-1 text-sm">
                      Heading Color
                      <div className="flex gap-2">
                        <input type="color" className="h-9 w-9 cursor-pointer rounded border border-ink/10" value={(sectionDraft.metadata?.accentColor as string) || "#8B3A3A"} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, accentColor: e.target.value } })} />
                        <input className={fieldClass} placeholder="#8B3A3A" value={(sectionDraft.metadata?.accentColor as string) || ""} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, accentColor: e.target.value } })} />
                      </div>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={(sectionDraft.metadata?.hidden as boolean) !== true} onChange={(e) => setSectionDraft({ ...sectionDraft, metadata: { ...sectionDraft.metadata, hidden: !e.target.checked } })} />
                      Visible on page
                    </label>
                  </div>
                </details>

                <div className="flex justify-end gap-3">
                  <button type="button" className="rounded-full border border-ink/10 px-5 py-3 font-bold" onClick={() => setSectionDraft(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="rounded-full bg-oxblood px-5 py-3 font-bold text-white">
                    {sectionDraft.id ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
    </div>
  );
}
