import { kv } from '@vercel/kv';
import { offices as seedOffices } from '@/config/offices';
import type { OfficeConfig } from '@/types';

// Versioned key: the schema and the real 3-office seed replaced the earlier
// placeholder set, so use a fresh key to avoid serving stale KV data. Bump this
// again if the OfficeConfig schema changes in a breaking way.
const KV_KEY = 'offices_v3';

function kvAvailable(): boolean {
  return !!process.env.KV_REST_API_URL;
}

export async function getAllOffices(): Promise<OfficeConfig[]> {
  if (!kvAvailable()) {
    console.warn('[officesStore] KV_REST_API_URL not set — using seed data');
    return seedOffices;
  }

  // KV is configured, but if the store is unreachable (deleted/paused DB, bad URL),
  // don't take the whole app down — fall back to the seed. The seed carries the real
  // office data, so generation still works; only Admin edits won't persist until KV
  // is restored.
  try {
    const stored = await kv.get<OfficeConfig[]>(KV_KEY);
    if (!stored || stored.length === 0) {
      await kv.set(KV_KEY, seedOffices);
      return seedOffices;
    }
    // Merge, don't replace. Admin edits live only in KV, but NEW offices only ever
    // arrive in the seed — so a stored office wins for any id present in both (which
    // preserves every edit made in the Admin tab), and seed offices KV has never seen
    // are appended. Without this, adding an office to the seed would never reach
    // production, because the stored array shadows the seed entirely.
    const storedIds = new Set(stored.map((office) => office.id));
    const unseen = seedOffices.filter((office) => !storedIds.has(office.id));
    if (unseen.length > 0) {
      const merged = [...stored, ...unseen];
      try {
        await kv.set(KV_KEY, merged);
      } catch (error) {
        // Best effort. Serving the merged list is what matters; if the write fails
        // the merge just runs again on the next read.
        console.warn('[officesStore] could not persist seed merge:', error);
      }
      return merged;
    }

    // Return stored configs as-is. Never fabricate missing fields — especially
    // givingUrl, where a wrong donation link misroutes gifts. A blank field is a
    // valid "not configured" state that the app flags rather than invents.
    return stored;
  } catch (error) {
    console.warn('[officesStore] KV unreachable — falling back to seed data:', error);
    return seedOffices;
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

  if (kvAvailable()) {
    try {
      await kv.set(KV_KEY, next);
    } catch {
      throw new Error(
        'Office changes could not be saved — the data store (KV) is currently unavailable. Reconnect Upstash Redis in Vercel Storage and try again.'
      );
    }
  }

  return updated;
}
