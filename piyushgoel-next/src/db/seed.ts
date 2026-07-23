import { db } from "./index";
import { cards, sections } from "./schema";
import { eq, and } from "drizzle-orm";

// ── Section data ──

const sectionData = [
  {
    sectionId: "work",
    title: "Previous Work",
    note: "A showcase of my previous work and collaborations.",
    sortOrder: 0,
    metadata: { layout: "carousel", columns: 3, cardWidth: 320, accentColor: "#8B3A3A" },
    createdBy: "seed",
    updatedBy: "seed",
  },
  {
    sectionId: "companies",
    title: "Companies I've Worked With",
    note: "Brands, networks, and platforms I've collaborated with.",
    sortOrder: 1,
    metadata: { layout: "grid", columns: 4, accentColor: "#8B3A3A" },
    createdBy: "seed",
    updatedBy: "seed",
  },
  {
    sectionId: "social",
    title: "Social Work",
    note: "Personality-led clips and host moments.",
    sortOrder: 2,
    metadata: { layout: "carousel", columns: 3, cardWidth: 320, accentColor: "#8B3A3A" },
    createdBy: "seed",
    updatedBy: "seed",
  },
  {
    sectionId: "testimonials",
    title: "What People Say",
    note: "Client words presented as collectible cards rather than a flat carousel.",
    sortOrder: 3,
    metadata: { layout: "testimonials" },
    createdBy: "seed",
    updatedBy: "seed",
  },
  {
    sectionId: "fan",
    title: "Featured Projects",
    note: "Fan-layout showcase of standout work. Hover to focus any card.",
    sortOrder: 4,
    metadata: { layout: "fan" },
    createdBy: "seed",
    updatedBy: "seed",
  },
  {
    sectionId: "reels",
    title: "Photo Reel",
    note: "A quick sample of my work in a scrolling reel format.",
    sortOrder: 5,
    metadata: { layout: "reels" },
    createdBy: "seed",
    updatedBy: "seed",
  },
];

// ── Card data keyed by section ──

const cardData: Record<string, any[]> = {
  work: [
    {
      section: "work", type: "youtube",
      title: "Bihar Vote Adhikar Yatra",
      description: "Coverage of the Bihar Vote Adhikar Yatra campaign — ground reporting and host-led narration.",
      url: "https://youtu.be/LND5_8PPcF8",
      imageUrl: "", useCustomThumbnail: false, embed: true, size: "standard", sortOrder: 1,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "work", type: "youtube",
      title: "Delhi Yamuna Cleaning 2025",
      description: "Latest news coverage on the Delhi Yamuna cleaning drive — voice-over and scripting.",
      url: "https://youtu.be/flTBGkXaRrg",
      imageUrl: "", useCustomThumbnail: false, embed: true, size: "standard", sortOrder: 2,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "work", type: "youtube",
      title: "Prashant Kishor: The Untold Story",
      description: "In-depth feature on Prashant Kishor's political journey — narration and production.",
      url: "https://www.youtube.com/watch?v=Blpr8w-40_k",
      imageUrl: "", useCustomThumbnail: false, embed: true, size: "standard", sortOrder: 3,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "work", type: "youtube",
      title: "YouTube Channel",
      description: "Main YouTube channel featuring voice work, hosting, and creator-led content.",
      url: "https://www.youtube.com/channel/UC43qCBEfmy-wouPmYlLSpIg",
      imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 4,
      createdBy: "seed", updatedBy: "seed",
    },
  ],

  social: [
    {
      section: "social", type: "instagram",
      title: "Kailash Kher — Host Moment",
      description: "Personality-led reel featuring Kailash Kher — host segment with engaging storytelling.",
      url: "https://www.instagram.com/reel/CkngjKmgWNa/",
      imageUrl: "", useCustomThumbnail: false, embed: false, size: "wide", sortOrder: 5,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "social", type: "instagram",
      title: "Lohri Special",
      description: "Festival special with guest appearance — radio-style hosting on social.",
      url: "https://www.instagram.com/reel/CnWVegXpUHA/",
      imageUrl: "", useCustomThumbnail: false, embed: false, size: "wide", sortOrder: 6,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "social", type: "instagram",
      title: "Special Guest Feature",
      description: "On-camera host moment with a special guest — quick, engaging social content.",
      url: "https://www.instagram.com/reel/Cft-bi1AcYz/",
      imageUrl: "", useCustomThumbnail: false, embed: false, size: "wide", sortOrder: 7,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "social", type: "instagram",
      title: "IG TV — Segment 1",
      description: "Long-form IG TV content — host-led storytelling and audience engagement.",
      url: "https://www.instagram.com/p/CdzvTsxoZKL/",
      imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 8,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "social", type: "instagram",
      title: "IG TV — Segment 2",
      description: "Another IG TV feature with on-camera hosting and creator-led narrative.",
      url: "https://www.instagram.com/p/CXlWdTBpXmb/",
      imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 9,
      createdBy: "seed", updatedBy: "seed",
    },
  ],

  companies: [
    {
      section: "companies", type: "company",
      title: "Piyush Goel YouTube",
      description: "Voice-over demos, showreels, and hosted content on YouTube.",
      url: "https://www.youtube.com/channel/UC43qCBEfmy-wouPmYlLSpIg",
      imageUrl: "https://yt3.googleusercontent.com/egSUZ1o-8pH44KTPs8ye08m_DFzl5tbShIyzkRaUrfo2Dlst3y99GesU1QJZ-yZNTesxu50fKg=s900-c-k-c0x00ffffff-no-rj",
      useCustomThumbnail: false, embed: false, size: "large", sortOrder: 13,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "companies", type: "company",
      title: "Kuku FM",
      description: "Voice artist for audiobooks and original audio series.",
      url: "https://kukufm.com",
      imageUrl: "https://kukufm.com/blog/wp-content/uploads/sites/4/2020/07/logo-1-scaled.jpg",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 14,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "companies", type: "company",
      title: "Pocket FM",
      description: "Narrated and performed in multiple audio series.",
      url: "https://pocketfm.com",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUemtnWy2p300D62wm67SQPPe6rnon5FeTBqsOnoyiw&s=10",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 15,
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "companies", type: "company",
      title: "Story TV",
      description: "Voice acting for animated and hosted content.",
      url: "https://storytv.in",
      imageUrl: "https://play-lh.googleusercontent.com/A5ISR8CT9j9gTFpqTSJBXwvxWKk1WmJlJ8-WRl7dYUzI0U3srRPCF0t6_sX6Jvfl1Su1_-p0R5k9wd4fur79VQ",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 16,
      createdBy: "seed", updatedBy: "seed",
    },
  ],

  testimonials: [
    {
      section: "testimonials", type: "testimonial",
      title: "Aarav Mehta",
      description: "Piyush has an incredible voice — warm, clear, and professional. He brought our script to life and delivered well ahead of schedule. Working with him felt seamless from start to finish, and the final output exceeded our expectations.",
      url: "", imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 14,
      metadata: { role: "Creative Lead", company: "YouTube Partner", rating: 5, accent: "linear-gradient(135deg, #0c1445 0%, #2563eb 60%, #60a5fa 100%)" },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "testimonials", type: "testimonial",
      title: "Sara Khan",
      description: "Working with Piyush was effortless. He understood the tone we needed instantly and delivered a voice that perfectly matched our brand story. The communication was smooth throughout and the turnaround time was impressive.",
      url: "", imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 15,
      metadata: { role: "Manager", company: "Pocket FM", rating: 5, accent: "linear-gradient(135deg, #3b0764 0%, #7c3aed 60%, #a78bfa 100%)" },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "testimonials", type: "testimonial",
      title: "Rohan Das",
      description: "Piyush's narration brought a natural depth to our audio series. The pacing was perfect and the final cut needed zero revisions. His ability to connect with the listener through voice alone is something we haven't found in anyone else.",
      url: "", imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 16,
      metadata: { role: "Content Head", company: "Kuku FM", rating: 5, accent: "linear-gradient(135deg, #022c22 0%, #059669 60%, #34d399 100%)" },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "testimonials", type: "testimonial",
      title: "Nisha Verma",
      description: "We needed a voice that felt both authoritative and relatable. Piyush delivered exactly that — our campaign engagement went up significantly. He's someone we now work with on a regular basis.",
      url: "", imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 17,
      metadata: { role: "Producer", company: "Story TV", rating: 5, accent: "linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fbbf24 100%)" },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "testimonials", type: "testimonial",
      title: "Vikram Mehta",
      description: "Piyush has a rare ability to adapt his voice to any format. Whether it's a news segment or a casual reel, he nails the tone every time. His professionalism and attention to detail make him our go-to voice artist.",
      url: "", imageUrl: "", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 18,
      metadata: { role: "Director", company: "Radio City", rating: 5, accent: "linear-gradient(135deg, #831843 0%, #db2777 60%, #f472b6 100%)" },
      createdBy: "seed", updatedBy: "seed",
    },
  ],

  fan: [
    {
      section: "fan", type: "fan",
      title: "Portal",
      description: "", url: "",
      imageUrl: "https://picsum.photos/seed/portal/400/520",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 17,
      metadata: { tag: "Web App", score: 4.9 },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "fan", type: "fan",
      title: "Meridian",
      description: "", url: "",
      imageUrl: "https://picsum.photos/seed/meridian/400/520",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 18,
      metadata: { tag: "Brand Identity", score: 4.7 },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "fan", type: "fan",
      title: "Aether",
      description: "", url: "",
      imageUrl: "https://picsum.photos/seed/aether/400/520",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 19,
      metadata: { tag: "UI/UX Design", score: 4.8 },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "fan", type: "fan",
      title: "Cascade",
      description: "", url: "",
      imageUrl: "https://picsum.photos/seed/cascade/400/520",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 20,
      metadata: { tag: "Mobile App", score: 4.5 },
      createdBy: "seed", updatedBy: "seed",
    },
    {
      section: "fan", type: "fan",
      title: "Vertex",
      description: "", url: "",
      imageUrl: "https://picsum.photos/seed/vertex/400/520",
      useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 21,
      metadata: { tag: "Dashboard", score: 4.6 },
      createdBy: "seed", updatedBy: "seed",
    },
  ],

  reels: [
    { section: "reels", type: "reel", title: "", description: "", url: "", imageUrl: "https://picsum.photos/seed/reel01/400/520", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 22, createdBy: "seed", updatedBy: "seed" },
    { section: "reels", type: "reel", title: "", description: "", url: "", imageUrl: "https://picsum.photos/seed/reel02/400/520", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 23, createdBy: "seed", updatedBy: "seed" },
    { section: "reels", type: "reel", title: "", description: "", url: "", imageUrl: "https://picsum.photos/seed/reel03/400/520", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 24, createdBy: "seed", updatedBy: "seed" },
    { section: "reels", type: "reel", title: "", description: "", url: "", imageUrl: "https://picsum.photos/seed/reel04/400/520", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 25, createdBy: "seed", updatedBy: "seed" },
    { section: "reels", type: "reel", title: "", description: "", url: "", imageUrl: "https://picsum.photos/seed/reel05/400/520", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 26, createdBy: "seed", updatedBy: "seed" },
    { section: "reels", type: "reel", title: "", description: "", url: "", imageUrl: "https://picsum.photos/seed/reel06/400/520", useCustomThumbnail: false, embed: false, size: "standard", sortOrder: 27, createdBy: "seed", updatedBy: "seed" },
  ],
};

// ── Helpers ──

async function seedSections() {
  console.log("Upserting sections...");
  for (const s of sectionData) {
    const [inserted] = await db.insert(sections).values(s).onConflictDoUpdate({
      target: sections.sectionId,
      set: { title: s.title, note: s.note, sortOrder: s.sortOrder, metadata: s.metadata },
    }).returning();
    console.log(`  ✓ ${inserted.title}`);
  }
}

async function seedCardsFor(section: string) {
  const list = cardData[section];
  if (!list || list.length === 0) {
    console.log(`  No seed cards for "${section}"`);
    return;
  }
  console.log(`Upserting ${section} cards...`);
  for (const card of list) {
    let existing;
    if (card.url) {
      existing = await db.select({ id: cards.id }).from(cards)
        .where(and(eq(cards.url, card.url), eq(cards.section, card.section))).limit(1);
    } else if (card.title) {
      existing = await db.select({ id: cards.id }).from(cards)
        .where(and(eq(cards.title, card.title), eq(cards.section, card.section))).limit(1);
    } else {
      existing = await db.select({ id: cards.id }).from(cards)
        .where(and(eq(cards.imageUrl, card.imageUrl), eq(cards.section, card.section))).limit(1);
    }
    if (existing.length > 0) {
      await db.update(cards).set(card).where(eq(cards.id, existing[0].id));
      console.log(`  ~ ${card.title || card.imageUrl?.slice(0, 40) || "card"}`);
    } else {
      const [inserted] = await db.insert(cards).values(card).returning();
      console.log(`  + ${inserted.title || inserted.imageUrl?.slice(0, 40) || "card"}`);
    }
  }
}

// ── CLI ──

async function main() {
  const arg = process.argv[2];
  const validSections = Object.keys(cardData);

  if (!arg || arg === "all") {
    await seedSections();
    for (const s of validSections) await seedCardsFor(s);
  } else if (arg === "sections") {
    await seedSections();
  } else if (validSections.includes(arg)) {
    await seedCardsFor(arg);
  } else {
    console.log(`Usage: npm run db:seed [all|sections|${validSections.join("|")}]`);
    process.exit(1);
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
