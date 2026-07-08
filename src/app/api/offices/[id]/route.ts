import type { NextRequest } from 'next/server';
import { updateOffice } from '@/lib/officesStore';
import type { OfficeConfig, OfficeDirector } from '@/types';

// Every string field on OfficeConfig that the admin can edit.
const STRING_FIELDS: (keyof OfficeConfig)[] = [
  'name',
  'givingUrl',
  'signatureBlock',
  'audienceReligious',
  'audiencePolitical',
  'politicalPhrasesToAvoid',
  'preferredBiblicalPhrases',
  'preferredBibleVerses',
  'faithPhrasesToAvoid',
  'programming',
  'distinctive',
  'accomplishments',
  'sentenceStyle',
  'celebrationTone',
  'crisisTone',
  'financialAskStyle',
  'personalAnecdotes',
  'outOfCharacterTone',
];

// `id` is accepted but ignored (updateOffice forces the route id); `director` and
// `active` are validated separately below.
const ALLOWED_KEYS: Set<keyof OfficeConfig> = new Set([
  'id',
  'director',
  'active',
  'givingUrlOptions',
  ...STRING_FIELDS,
]);

function validatePatch(body: unknown): { valid: true; patch: Partial<OfficeConfig> } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const candidate = body as Record<string, unknown>;

  for (const key of Object.keys(candidate)) {
    if (!ALLOWED_KEYS.has(key as keyof OfficeConfig)) {
      return { valid: false, error: `Unknown field: ${key}` };
    }
  }

  for (const field of STRING_FIELDS) {
    if (field in candidate && typeof candidate[field] !== 'string') {
      return { valid: false, error: `${field} must be a string` };
    }
  }

  if ('active' in candidate && typeof candidate.active !== 'boolean') {
    return { valid: false, error: 'active must be a boolean' };
  }

  if ('director' in candidate) {
    const d = candidate.director;
    if (typeof d !== 'object' || d === null || Array.isArray(d)) {
      return { valid: false, error: 'director must be an object' };
    }
    const dir = d as Record<string, unknown>;
    for (const field of ['name', 'title', 'email', 'phone'] as (keyof OfficeDirector)[]) {
      if (field in dir && typeof dir[field] !== 'string') {
        return { valid: false, error: `director.${field} must be a string` };
      }
    }
  }

  if ('givingUrlOptions' in candidate) {
    const opts = candidate.givingUrlOptions;
    const ok =
      Array.isArray(opts) &&
      opts.every(
        (o) =>
          typeof o === 'object' &&
          o !== null &&
          typeof (o as Record<string, unknown>).label === 'string' &&
          typeof (o as Record<string, unknown>).url === 'string'
      );
    if (!ok) {
      return {
        valid: false,
        error: 'givingUrlOptions must be an array of { label, url } string pairs',
      };
    }
  }

  return { valid: true, patch: candidate as Partial<OfficeConfig> };
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<'/api/offices/[id]'>
): Promise<Response> {
  const authCookie = request.cookies.get('wr_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const validation = validatePatch(body);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await updateOffice(id, validation.patch);
    return Response.json({ office: updated });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Office not found')) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    console.error('Error updating office:', error);
    return Response.json({ error: 'Failed to update office' }, { status: 500 });
  }
}
