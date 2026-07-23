---
name: testimonial-cards
description: Testimonial cards with holographic petal fan layout — dark glassmorphic cards, gradient backgrounds, mouse-tracked shine, spring animations, and mobile horizontal snap scroll.
license: MIT
compatibility: opencode
metadata:
  framework: nextjs
  ui-library: framer-motion
  styling: tailwind-css
---

## What this is

A premium testimonial section that renders client reviews as collectible holographic cards arranged in a fanned petal layout on desktop (horizontal stack with CSS snap scroll on mobile). Built for portfolio/agency sites that want to showcase social proof with visual impact.

## Architecture overview

### Files involved

| File | Purpose |
|------|---------|
| `src/components/portfolio/TestimonialStrip.tsx` | Main component — container, layout computation, HolographicCard sub-component, mobile fallback |
| `src/app/lib/default-data.ts` | CardData / SectionData types + default testimonial cards with metadata |
| `src/db/seed.ts` | DB seed script — adds testimonials section + 5 testimonial cards |
| `src/components/portfolio/SectionBlock.tsx` | Routes `layout: "testimonials"` to TestimonialStrip |
| `src/components/portfolio/PortfolioPage.tsx` | Parent page that passes cards/sections |

### Data model (CardData metadata fields)

Testimonial cards use these metadata keys:

```
role: string          — "Creative Lead"
company: string       — "YouTube Partner"
rating: number        — 5
accent: string        — "linear-gradient(135deg, #2d6cdf 0%, #6d7cff 100%)"
```

### Section metadata

```
layout: "testimonials"
```

The SectionBlock checks `section.metadata?.layout === "testimonials"` and renders TestimonialStrip directly (no outer `<section>` wrapper).

## How the layout works

### Desktop — Petal fan layout

5 cards max. Each card gets a computed x/y/rotate/scale/zIndex based on its offset from center:

- **Rotate**: `offset * 12` (clamped to ±20deg)
- **X spread**: `offset * 150` pixels
- **Y petal curve**: `Math.abs(offset) * 20` — center card is visually highest (y=0), outer cards droop lower (y=40)
- **Scale**: outer cards shrink by 5% per offset step
- **Z-index**: center gets highest (30), edges lower

On hover:
- Hovered card straightens (rotate=0), drops down (y=maxOffset*20+10), scales up (1.06), z-index=50
- Non-hovered cards shift sideways (45px away), scale down (0.93), lift up (y-=10)

Spring animation: stiffness 150, damping 22, mass 0.8.

### Mobile — Horizontal snap scroll

Cards are full-width (290px base, 350px on sm+) in an `overflow-x-auto snap-x snap-mandatory` container. No fan effect, no hover interaction.

## HolographicCard component

Each card is a `motion.div` with:

1. **Gradient background** — 5 preset gradients or custom `accent` from metadata
2. **Mouse-tracked shine** — radial gradient overlay that follows the cursor via `onMouseMove` (mix-blend-overlay, 45% white center → transparent)
3. **Glass highlights** — static radial gradient at top-left + top-to-bottom white gradient at 12% opacity
4. **Border** — `border border-white/15` with dynamic box-shadow on hover
5. **Content layout** — `min-h-[480px]` tall card with name+role at top and full quote below (`mt-4`)
6. **Admin controls** — Edit/Delete buttons that appear on hover when `adminMode` is on

### Gradient presets

```
GRADIENTS = [
  "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)", // Sapphire Blue
  "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #c084fc 100%)", // Royal Purple
  "linear-gradient(135deg, #064e3b 0%, #10b981 50%, #6ee7b7 100%)", // Emerald Dream
  "linear-gradient(135deg, #7c2d12 0%, #f97316 50%, #fdba74 100%)", // Fire Orange
  "linear-gradient(135deg, #831843 0%, #ec4899 50%, #fbcfe8 100%)", // Rose Quartz
]
```

## Container design

The outer `<div>` has:
- `bg-[#0B0B0F]` — near-black background
- `border border-white/10` — subtle white border
- `rounded-[32px]` — large corner radius
- `overflow-hidden` — clips the background elements
- Shadow: `0 30px 100px rgba(0,0,0,0.6)`

### Background atmosphere

1. **Perspective grid** — 3D-angled grid at bottom (`rotateX(62deg) scale(2.2)`) with white 1px lines at 45px spacing, masked to fade upward
2. **Glowing blobs** — 3 blurred circles (cyan, fuchsia, amber) at 10% opacity with `blur-[90-120px]` for ambient lighting

### Header

- "⭐ Trusted by Clients Worldwide" badge — small uppercase pill with border
- `h2` heading — serif font, white, 3xl-5xl
- `p` subtitle — `text-white/55`, max-width constrained

## How to add to a new project

### 1. Define types

Add `CardData` and `SectionData` interfaces (see `src/app/lib/default-data.ts`).

### 2. Create the component

Copy `TestimonialStrip.tsx` with the `HolographicCard` sub-component and `useIsDesktop` hook.

### 3. Wire up SectionBlock

Add a check in your section renderer:

```ts
if (layout === "testimonials") {
  return <TestimonialStrip section={section} cards={cards} ... />;
}
```

### 4. Add seed data

In your DB seed script, add a `testimonials` section entry and 5 testimonial cards with the metadata fields above.

### 5. Add default cards

In your default-data.ts (or equivalent), create 5+ `CardData` objects in the `testimonials` section with `type: "testimonial"`.

## Dependencies

- `framer-motion` — spring animations, layout, AnimatePresence
- `tailwindcss` — all styling
- Next.js (for Image — can be adapted to any React framework)

The component is self-contained and does not depend on any external data fetching library.

## Key design decisions

- Cards merge by ID in `getPortfolioCards` so new defaults appear even when DB is seeded
- TestimonialStrip skips the outer section wrapper from SectionBlock (renders its own container)
- No click-to-open modal — hover is the only interaction on desktop, tap is disabled on mobile
- All decorative sparkles/stars/project details removed — minimal content-only cards
