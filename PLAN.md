# Piyush Goel Portfolio — Next.js + Neon DB

## Goal
A dynamic, data-driven portfolio site for Piyush Goel (Voice Artist, UGC Creator, Content Host) built with Next.js 16, Tailwind CSS v4, Framer Motion, and Neon PostgreSQL via Drizzle ORM.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (CSS-first config via `@theme inline`)
- **Animation:** Framer Motion
- **Fonts:** Inter (sans), Cormorant Garamond (serif) via Google Fonts
- **Database:** Neon PostgreSQL with Drizzle ORM
- **Driver:** @neondatabase/serverless (neon-http)

## Content
- Name: Piyush Goel
- Roles: Voice Artist, UGC Creator, Content Host
- Email: goelpiyush314@gmail.com
- Phone: 9690992005
- Platforms: Kuku FM, Pocket FM, Story TV
- Radio: Hint Radio 90.4, Radio Nageen 107.8, Live FM 107.2

## Database Schema (`src/db/schema.ts`)

### cards table
| Column              | Type      | Default        |
|---------------------|-----------|----------------|
| id                  | uuid      | auto-generated |
| section             | text      | "work"         |
| type                | text      | "youtube"      |
| title               | text      | required       |
| description         | text      | ""             |
| url                 | text      | ""             |
| image_url           | text      | ""             |
| use_custom_thumbnail| boolean   | false          |
| embed               | boolean   | true           |
| size                | text      | "standard"     |
| sort_order          | integer   | 0              |
| metadata            | jsonb     | {}             |
| created_by          | text      | "system"       |
| updated_by          | text      | "system"       |
| created_at          | timestamp | now()          |
| updated_at          | timestamp | now()          |

### audit_events table
| Column      | Type      | Default      |
|-------------|-----------|--------------|
| id          | uuid      | auto-generated |
| event       | text      | required     |
| target_type | text      | "card"       |
| target_id   | text      | ""           |
| location    | text      | "portfolio"  |
| user_id     | text      | "anonymous"  |
| metadata    | jsonb     | {}           |
| created_at  | timestamp | now()        |

## Sections
| Section  | Title          | Cards                      |
|----------|----------------|----------------------------|
| work     | Previous Work  | 4 YouTube embeds/links     |
| social   | Social Work    | 5 Instagram reels + IG TV  |
| career   | Career         | 3 career description cards |

### Seed Data (12 cards total)
- **work:** Bihar Vote Adhikar Yatra, Delhi Yamuna Cleaning 2025, Prashant Kishor: The Untold Story, YouTube Channel
- **social:** Kailash Kher reel, Lohri Special, Special Guest Feature, IG TV Segment 1, IG TV Segment 2
- **career:** Radio Career, Digital Career, Freelancing Career

## Project Structure
```
piyushgoel/
├── piyushgoel-next/              # ← active project
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main portfolio page (fetches cards from DB)
│   │   │   ├── layout.tsx        # Root layout with fonts
│   │   │   ├── globals.css       # Tailwind v4 + custom theme + bg gradients
│   │   │   ├── admin/page.tsx    # Admin page (same layout + CRUD buttons)
│   │   │   ├── api/audit/route.ts# API route for audit events
│   │   │   ├── actions/cards.ts  # Server actions for card CRUD
│   │   │   └── lib/
│   │   │       ├── cards.ts      # Fetches cards from DB (fallback to defaults)
│   │   │       └── default-data.ts # CardData interface + fallback defaults
│   │   ├── components/portfolio/
│   │   │   ├── PortfolioPage.tsx  # Main client component (use client)
│   │   │   ├── SectionBlock.tsx   # Section wrapper with Framer Motion
│   │   │   ├── MediaCard.tsx      # Card display (embed/link/thumbnail)
│   │   │   ├── AdminCardDialog.tsx# Add/edit dialog with live preview
│   │   │   ├── Header.tsx         # Navigation header
│   │   │   ├── Hero.tsx           # Hero section with visual + mini-cards
│   │   │   └── cardUtils.ts       # Card helpers (normalize, YouTube utils)
│   │   └── db/
│   │       ├── schema.ts          # Drizzle schema (cards, audit_events)
│   │       ├── index.ts           # Drizzle client (Neon) + env check
│   │       ├── dal.ts             # Data access layer (typed)
│   │       └── seed.ts            # Seed script (inserts 12 cards)
│   ├── drizzle.config.ts          # Drizzle Kit config
│   ├── .env                       # DATABASE_URL, ADMIN_USER_ID, SITE_URL
│   └── .env.example
├── nextjs-app/                    # ← deprecated (old messy project)
├── html/index.html                # Original static design reference
└── PLAN.md                        # This file
```

## Routes
| Route          | Type     | Description                            |
|----------------|----------|----------------------------------------|
| `/`            | Static   | Public portfolio page                   |
| `/admin`       | Static   | Admin page with add/edit/remove buttons |
| `/api/audit`   | POST     | Logs audit events (clicks, views)       |

## Admin Features
- Same layout as `/` but with "Add Card" button per section
- Edit / Remove buttons on every card
- Dialog with fields: section, type, title, description, url, imageUrl, size, sortOrder, embed, useCustomThumbnail
- Live preview panel on the right side of the dialog
- Saves to Neon DB via server actions
- Falls back to default/seed cards when DB is unavailable

## Commands
```bash
cd piyushgoel-next
npm run dev              # Start dev server
npm run build            # Production build
npm run db:push          # Push schema to Neon DB
npm run db:generate      # Generate Drizzle migrations
npm run db:seed          # Seed database with 12 portfolio cards
```

## Env Variables (`piyushgoel-next/.env`)
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
ADMIN_USER_ID="admin"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```
