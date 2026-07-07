@AGENTS.md

# WR Content Versioner

World Relief U.S. Office Content Versioning App. Staff paste source content (or upload a PDF), pick a content type, and get Claude-powered customized versions for each selected U.S. office — on brand, on tone, and with per-office giving links swapped in automatically.

## Stack
- Next.js 16, React 19, Tailwind 4
- Anthropic SDK (`@anthropic-ai/sdk`) for content versioning AND PDF text extraction
- `@vercel/kv` (Upstash Redis) for persisted office configs
- Vercel deployment

## Architecture
- Single-page app with password gate
- `/api/auth` — Password verification (cookie-based, 24hr expiry)
- `/api/version` — Claude-powered content versioning endpoint
- `/api/extract-pdf` — multipart PDF upload → Claude PDF input → extracted markdown text
- `/api/offices` — list/edit office configs (backed by KV, falls back to seed)
- Office configs in `src/config/offices.ts` (4 offices seeded, expandable to 16)
- Brand rules in `src/config/brand.ts` (World Relief brand guide voice/tone/terminology + giving link swap rule + 5 content-type formatting blocks)

## Content Types Supported
- Email
- Invitation
- Social (Facebook, Instagram, LinkedIn — platform sub-selector)
- Website
- General doc (paste text OR upload PDF for auto-extraction)

## Giving Link Swap
Every office has a `givingUrl`. When source content includes any donation/giving link, Claude swaps it for the target office's `givingUrl` on every version. Adaptations explorer shows the swap with configSource = "Giving URL".

## Brand Colors
- Primary: #009DDC (World Relief Blue)
- Secondary: #E9C31E (yellow), #00AF9A (teal), #823D82 (purple)
- Grays: 50% (#808080) and 80% (#333333) black
- Font: Arial (digital), Gotham (design only)

## Environment Variables
- `ANTHROPIC_API_KEY` — Claude API key
- `APP_PASSWORD` — Shared password for access gate
- `KV_REST_API_URL` — Upstash Redis REST URL (required for persistence; falls back to seed if missing)
- `KV_REST_API_TOKEN` — Upstash Redis REST token
