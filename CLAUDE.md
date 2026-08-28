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
- Office configs in `src/config/offices.ts` (7 offices seeded, expandable to 16)
- ⚠ **The seed file is not the source of truth in production — KV is.** `getAllOffices`
  merges them: a KV-stored office wins for any id present in both (preserving Admin-tab
  edits), and seed offices KV has never seen get appended and written back. Before this
  merge existed (added 2026-08-27), adding an office to the seed never reached production
  because the stored array shadowed the seed entirely. Adding an office = edit the seed.
- Brand rules in `src/config/brand.ts` (World Relief brand guide voice/tone/terminology + giving link swap rule + 5 content-type formatting blocks)

## Offices (7)
Western Washington, Chicagoland, California, Quad Cities, Texas, Wisconsin, Spokane.
Voice/audience fields are VERBATIM from each director's Microsoft Forms questionnaire.
Blank field = not supplied; the prompt renders `(not provided)` rather than inventing.

**Open questions with World Relief (as of 2026-08-27):**
- **Texas (`id: texas`, was `fort-worth`).** Bethany Fort filled the questionnaire out FOR
  director Jonathan Parsons; Joel confirmed 2026-08-27 that the answers are his and cover
  the whole Texas region, so `personalAnecdotes` was restored and the office was renamed.
  **`director.email` is STILL blank** — the form only captured the submitter's address, and
  no address for Jonathan Parsons has ever been supplied. Every other WR director follows
  first-initial + surname, but a guessed address in a donor-facing signature is not worth it.
- ⚠ **Renaming an office id requires adding the old id to `RETIRED_OFFICE_IDS` in
  `officesStore.ts`.** The merge lets stored data win for ids KV already knows, so an edit to
  the seed never reaches an existing office. Rename plus retire is how a correction gets
  through, and without the retire step you get a duplicate.
- Spokane supplied two giving links; the default is the one-time link, with monthly
  selectable per generation. Confirm the intended default.
- Spokane's `preferredBibleVerses` says "anything stated in Q9", a reference to the
  source form that means nothing at generation time.
- Wisconsin's signature block contains the literal words "Instagram | Facebook" (pasted
  from an email signature) and will be appended verbatim.

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
