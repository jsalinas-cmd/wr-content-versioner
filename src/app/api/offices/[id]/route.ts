import type { NextRequest } from 'next/server';
import { updateOffice } from '@/lib/officesStore';
import type { OfficeConfig, OfficeDirector } from '@/types';

const ALLOWED_KEYS: Set<keyof OfficeConfig> = new Set([
  'name',
  'director',
  'localFocus',
  'preferredBibleVerses',
  'toneNotes',
  'signatureBlock',
  'localContext',
  'audienceNotes',
  'active',
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

  if ('name' in candidate && typeof candidate.name !== 'string') {
    return { valid: false, error: 'name must be a string' };
  }

  if ('toneNotes' in candidate && typeof candidate.toneNotes !== 'string') {
    return { valid: false, error: 'toneNotes must be a string' };
  }

  if ('signatureBlock' in candidate && typeof candidate.signatureBlock !== 'string') {
    return { valid: false, error: 'signatureBlock must be a string' };
  }

  if ('localContext' in candidate && typeof candidate.localContext !== 'string') {
    return { valid: false, error: 'localContext must be a string' };
  }

  if ('audienceNotes' in candidate && typeof candidate.audienceNotes !== 'string') {
    return { valid: false, error: 'audienceNotes must be a string' };
  }

  if ('active' in candidate && typeof candidate.active !== 'boolean') {
    return { valid: false, error: 'active must be a boolean' };
  }

  if ('localFocus' in candidate) {
    if (!Array.isArray(candidate.localFocus) || !(candidate.localFocus as unknown[]).every((v) => typeof v === 'string')) {
      return { valid: false, error: 'localFocus must be an array of strings' };
    }
  }

  if ('preferredBibleVerses' in candidate) {
    if (!Array.isArray(candidate.preferredBibleVerses) || !(candidate.preferredBibleVerses as unknown[]).every((v) => typeof v === 'string')) {
      return { valid: false, error: 'preferredBibleVerses must be an array of strings' };
    }
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
