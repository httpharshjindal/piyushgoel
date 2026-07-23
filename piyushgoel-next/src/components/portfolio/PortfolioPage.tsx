"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auditAction, deleteCardAction, saveCardAction } from "@/app/actions/cards";
import { saveSectionAction, deleteSectionAction } from "@/app/actions/sections";
import { AdminCardDialog } from "./AdminCardDialog";
import { FanCardDialog } from "./FanCardDialog";
import { ReelCardDialog } from "./ReelCardDialog";
import { emptyCard, normalizeCard } from "./cardUtils";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { SectionBlock } from "./SectionBlock";
import type { CardData, SectionData } from "@/app/lib/default-data";
import type { SectionInput } from "@/db/dal";

const fieldClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

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
    <div className="px-[18px] pb-12 text-ink relative">

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/919690992005?text=Hi%20Piyush%2C%20I%27d%20like%20to%20connect%20with%20you%20regarding%20a%20project."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        <Header />

        {adminMode ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-lg border border-oxblood/20 bg-white/70 px-4 py-3 text-sm text-muted"
          >
            Admin mode active. Add, edit, remove cards and sections.
            {status ? <span className="ml-2 font-semibold text-oxblood">{status}</span> : null}
            {isPending ? <span className="ml-2">Working...</span> : null}
          </motion.div>
        ) : null}

        {adminMode ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 flex gap-2"
          >
            <button
              type="button"
              className="rounded-full bg-oxblood px-5 py-3 font-bold text-white text-sm"
              onClick={() =>
                setSectionDraft({ sectionId: "", title: "", note: "", sortOrder: sections.length })
              }
            >
              + Add Section
            </button>
          </motion.div>
        ) : null}

        <main>
          <Hero />

          {/* About Section with Scroll Animation */}
          <motion.section
            id="about"
            className="mt-7 rounded-lg border border-ink/10 bg-white/70 px-[18px] py-7 shadow-[0_18px_50px_rgba(40,24,18,0.08)]"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid gap-8 md:grid-cols-[1fr_280px] md:items-start">
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.h2 variants={staggerItem} className="font-serif text-5xl font-bold leading-none text-oxblood">About</motion.h2>
                <motion.p variants={staggerItem} className="mt-2 text-sm text-muted">Short, direct positioning built from the bio you shared.</motion.p>
                <motion.p variants={staggerItem} className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                  Hi, I&apos;m Piyush Goel — a Voice Artist, UGC Creator, and Content Host. I
                  create work that feels natural and credible across commercials,
                  digital ads, corporate films, podcasts, e-learning, and branded
                  content. I also host radio shows and create on-camera content that
                  connects quickly and stays clear.
                </motion.p>
                <motion.div variants={staggerItem} className="mt-5 flex flex-wrap gap-2">
                  {["Voice Artist", "UGC Creator", "Content Host", "Radio Host", "Narration", "Podcasting"].map((tag) => (
                    <motion.span
                      key={tag}
                      className="rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs font-medium text-muted"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 58, 58, 0.1)" }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-white/50 p-5 relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {[
                  { label: "Years Active", value: "5+" },
                  { label: "Projects Delivered", value: "200+" },
                  { label: "Brands Collaborated", value: "30+" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-baseline justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <span className="text-sm text-muted">{stat.label}</span>
                    <motion.span
                      className="font-serif text-2xl font-bold text-oxblood"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.5 + i * 0.1 }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
                <motion.a
                  href="https://wa.me/919690992005?text=Hi%20Piyush%2C%20I%27d%20like%20to%20connect%20with%20you%20regarding%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block rounded-full bg-oxblood px-5 py-3 text-center text-sm font-bold text-white"
                  whileHover={{ scale: 1.02, backgroundColor: "#7a3232" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get in Touch
                </motion.a>
              </motion.div>
            </div>
          </motion.section>

          {/* Reels Section */}
          {sections.filter((s) => s.sectionId === "reels").map((section) => (
            <motion.div
              key={section.sectionId}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <SectionBlock
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
            </motion.div>
          ))}

          {/* Other Sections */}
          {sections.filter((s) => s.metadata?.layout !== "fan" && s.sectionId !== "reels").map((section, index) => (
            <motion.div
              key={section.sectionId}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SectionBlock
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
            </motion.div>
          ))}

          {/* Contact Section with Scroll Animation */}
          <motion.section
            id="contact"
            className="mt-7 rounded-lg border border-ink/10 bg-white/70 px-[18px] py-7 shadow-[0_18px_50px_rgba(40,24,18,0.08)]"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div>
              <motion.h2
                className="font-serif text-5xl font-bold leading-none text-oxblood"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Contact
              </motion.h2>
              <motion.p
                className="mt-2 text-sm text-muted"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Let&apos;s work together. Reach out anytime.
              </motion.p>
              <motion.div
                className="mt-5 flex flex-col gap-3 text-sm text-muted"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.a
                  href="mailto:goelpiyush314@gmail.com"
                  className="hover:text-oxblood transition-colors"
                  variants={staggerItem}
                  whileHover={{ x: 5 }}
                >
                  goelpiyush314@gmail.com
                </motion.a>
                <motion.a
                  href="tel:+919690992005"
                  className="hover:text-oxblood transition-colors"
                  variants={staggerItem}
                  whileHover={{ x: 5 }}
                >
                  +91 9690992005
                </motion.a>
              </motion.div>
            </div>
          </motion.section>
        </main>

        <AnimatePresence>
          {draft?.type === "fan" ? (
            <FanCardDialog
              open={Boolean(draft)}
              draft={draft}
              onChange={setDraft}
              onClose={() => setDraft(null)}
              onSave={saveCard}
            />
          ) : draft?.section === "reels" || draft?.type === "reel" ? (
            <ReelCardDialog
              open={Boolean(draft)}
              draft={draft}
              onChange={setDraft}
              onClose={() => setDraft(null)}
              onSave={saveCard}
            />
          ) : draft ? (
            <AdminCardDialog
              open={Boolean(draft)}
              draft={draft}
              onChange={setDraft}
              onClose={() => setDraft(null)}
              onSave={saveCard}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {sectionDraft ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black/30 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="my-8 mx-auto w-full max-w-lg rounded-lg bg-paper p-5 shadow-2xl"
              >
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
                    <motion.button
                      type="button"
                      className="rounded-full border border-ink/10 px-5 py-3 font-bold"
                      onClick={() => setSectionDraft(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="rounded-full bg-oxblood px-5 py-3 font-bold text-white"
                      whileHover={{ scale: 1.02, backgroundColor: "#7a3232" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {sectionDraft.id ? "Update" : "Add"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
    </div>
  );
}
