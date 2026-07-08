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

  const stored = await kv.get<OfficeConfig[]>(KV_KEY);
  if (!stored || stored.length === 0) {
    await kv.set(KV_KEY, seedOffices);
    return seedOffices;
  }

  // Return stored configs as-is. Never fabricate missing fields — especially
  // givingUrl, where a wrong donation link misroutes gifts. A blank field is a
  // valid "not configured" state that the app flags rather than invents.
  return stored;
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
    await kv.set(KV_KEY, next);
  }

  return updated;
}
