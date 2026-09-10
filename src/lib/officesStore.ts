import { kv } from '@vercel/kv';
import { offices as seedOffices } from '@/config/offices';
import type { OfficeConfig } from '@/types';

// Versioned key: the schema and the real 3-office seed replaced the earlier
// placeholder set, so use a fresh key to avoid serving stale KV data. Bump this
// again if the OfficeConfig schema changes in a breaking way.
const KV_KEY = 'offices_v3';

// Office ids that have been retired or renamed in the seed. A stored office whose id is
// listed here is dropped on read and removed from KV on the next write-back, so a
// superseded record cannot linger in production alongside its replacement.
//
// Needed because the merge below deliberately lets STORED data win for any id present in
// both, which preserves Admin-tab edits but also means a correction made in the seed never
// reaches an office KV already knows about. Renaming the id plus retiring the old one is
// how a seed correction gets through.
//
// - 'fort-worth' → 'texas' (2026-08-27): the questionnaire covers the whole Texas region,
//   not just the Fort Worth site.
const RETIRED_OFFICE_IDS = new Set<string>(['fort-worth']);

// Contact details must never reach generated content: the office sign-off that carries
// them is applied downstream in HubSpot, where staff paste the output. The seed no longer
// holds any, but KV records written before that rule still do, and the Admin tab can paste
// one back in at any time. So scrub every signature block on read rather than trusting the
// stored data to be clean. A guarantee that depends on remembering to retire an id is not
// a guarantee.
const EMAIL_LINE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE_LINE = /\+?\d[\d().\-\s]{6,}\d/;

export function scrubSignature(block: string): string {
  return block
    .split('\n')
    .filter((line) => !EMAIL_LINE.test(line) && !PHONE_LINE.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function scrub(offices: OfficeConfig[]): OfficeConfig[] {
  return offices.map((office) => {
    const cleaned = scrubSignature(office.signatureBlock ?? '');
    // Records written to KV before the contact-details rule still carry `email` and
    // `phone` on the director object. Dropping the fields from the TypeScript type does
    // NOT remove them from stored JSON, and the spread would carry them straight into the
    // API response, so rebuild the director from the fields we actually keep.
    const director = { name: office.director.name, title: office.director.title };
    const legacy = office.director as unknown as Record<string, unknown>;
    const hadContact = 'email' in legacy || 'phone' in legacy;
    if (cleaned === office.signatureBlock && !hadContact) return office;
    if (cleaned !== office.signatureBlock) {
      console.warn(`[officesStore] stripped contact details from ${office.id} signature block`);
    }
    if (hadContact) {
      console.warn(`[officesStore] dropped legacy director email/phone from ${office.id}`);
    }
    return { ...office, director, signatureBlock: cleaned };
  });
}

function kvAvailable(): boolean {
  return !!process.env.KV_REST_API_URL;
}

export async function getAllOffices(): Promise<OfficeConfig[]> {
  if (!kvAvailable()) {
    console.warn('[officesStore] KV_REST_API_URL not set — using seed data');
    return scrub(seedOffices);
  }

  // KV is configured, but if the store is unreachable (deleted/paused DB, bad URL),
  // don't take the whole app down — fall back to the seed. The seed carries the real
  // office data, so generation still works; only Admin edits won't persist until KV
  // is restored.
  try {
    const stored = await kv.get<OfficeConfig[]>(KV_KEY);
    if (!stored || stored.length === 0) {
      await kv.set(KV_KEY, seedOffices);
      return scrub(seedOffices);
    }
    // Merge, don't replace. Admin edits live only in KV, but NEW offices only ever
    // arrive in the seed — so a stored office wins for any id present in both (which
    // preserves every edit made in the Admin tab), and seed offices KV has never seen
    // are appended. Without this, adding an office to the seed would never reach
    // production, because the stored array shadows the seed entirely.
    const live = stored.filter((office) => !RETIRED_OFFICE_IDS.has(office.id));
    const storedIds = new Set(live.map((office) => office.id));
    const unseen = seedOffices.filter((office) => !storedIds.has(office.id));
    if (unseen.length > 0 || live.length !== stored.length) {
      const merged = [...live, ...unseen];
      try {
        await kv.set(KV_KEY, merged);
      } catch (error) {
        // Best effort. Serving the merged list is what matters; if the write fails
        // the merge just runs again on the next read.
        console.warn('[officesStore] could not persist seed merge:', error);
      }
      return scrub(merged);
    }

    // Return stored configs as-is. Never fabricate missing fields — especially
    // givingUrl, where a wrong donation link misroutes gifts. A blank field is a
    // valid "not configured" state that the app flags rather than invents.
    return scrub(live);
  } catch (error) {
    console.warn('[officesStore] KV unreachable — falling back to seed data:', error);
    return scrub(seedOffices);
  }
}

export async function getOfficeById(id: string): Promise<OfficeConfig | undefined> {
  const all = await getAllOffices();
  return all.find((office) => office.id === id);
}

export async function updateOffice(id: string, patch: Partial<OfficeConfig>): Promise<OfficeConfig> {
  const all = await getAllOffices();
  const index = all.findIndex((office) => office.id === id);

  if (index === -1) {
    throw new Error(`Office not found: ${id}`);
  }

  const updated: OfficeConfig = { ...all[index], ...patch, id };
  const next = [...all];
  next[index] = updated;

  // Never report a save that didn't happen. Without KV there is nowhere to write,
  // and returning `updated` anyway made the Admin tab show "saved" for an edit that
  // vanished on the next load.
  if (!kvAvailable()) {
    throw new Error(
      'Office changes could not be saved: no data store (KV) is configured. Connect Upstash Redis in Vercel Storage and redeploy.'
    );
  }
  try {
    await kv.set(KV_KEY, next);
  } catch {
    throw new Error(
      'Office changes could not be saved — the data store (KV) is currently unavailable. Reconnect Upstash Redis in Vercel Storage and try again.'
    );
  }

  return updated;
}
