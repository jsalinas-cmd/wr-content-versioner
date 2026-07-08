import type { NextRequest } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { BRAND_SYSTEM_PROMPT, getContentTypeInstructions } from '@/config/brand';
import { getOfficeById } from '@/lib/officesStore';
import type {
  VersionRequest,
  VersionResult,
  Adaptation,
  KeepInMind,
  ContentType,
  SocialPlatform,
} from '@/types';

const VALID_CONTENT_TYPES: ContentType[] = [
  'email',
  'social',
  'mailing-piece',
  'announcement',
];

const VALID_SOCIAL_PLATFORMS: SocialPlatform[] = [
  'facebook',
  'instagram',
  'linkedin',
];

function fieldOrNone(value: string): string {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : '(not provided)';
}

async function buildOfficeSystemPrompt(
  officeId: string,
  overrideGivingUrl?: string
): Promise<string | null> {
  const office = await getOfficeById(officeId);
  if (!office) return null;

  const director = office.director;
  const title = director.title.trim() || 'Office Director';
  const phone = director.phone.trim() || '(not provided)';
  const givingUrl = (overrideGivingUrl ?? office.givingUrl).trim() || '(not configured)';
  const signature = office.signatureBlock.trim();

  const officeBlock = `## OFFICE: ${office.name.toUpperCase()}

**Director:** ${director.name}, ${title}
**Email:** ${director.email}
**Phone:** ${phone}

**Giving URL (for the swap rule):** ${givingUrl}

### AUDIENCE
**Religious leanings:** ${fieldOrNone(office.audienceReligious)}
**Political leanings:** ${fieldOrNone(office.audiencePolitical)}
**Political phrases this office avoids:** ${fieldOrNone(office.politicalPhrasesToAvoid)}

### FAITH VOICE
**Biblical phrases the director likes:** ${fieldOrNone(office.preferredBiblicalPhrases)}
**Preferred Bible verses (weave 1-2 in only where they genuinely fit, never forced):**
${fieldOrNone(office.preferredBibleVerses)}
**Faith phrases the director AVOIDS (never use these):** ${fieldOrNone(office.faithPhrasesToAvoid)}

### PROGRAMMING & LOCAL CONTEXT
**Programs this office offers:** ${fieldOrNone(office.programming)}
**What makes this office distinctive:** ${fieldOrNone(office.distinctive)}
**Recent accomplishments (use only if relevant, never fabricate):** ${fieldOrNone(office.accomplishments)}

### DIRECTOR VOICE
**Sentence style:** ${fieldOrNone(office.sentenceStyle)}
**Tone when celebrating success:** ${fieldOrNone(office.celebrationTone)}
**Tone when addressing a crisis:** ${fieldOrNone(office.crisisTone)}
**How the director asks for financial support:** ${fieldOrNone(office.financialAskStyle)}
**Personal anecdotes the director shares (use only if the content calls for it):** ${fieldOrNone(office.personalAnecdotes)}
**Tone that would feel OUT OF CHARACTER (avoid entirely):** ${fieldOrNone(office.outOfCharacterTone)}

### SIGNATURE
${
  signature
    ? `Append this signature exactly as written at the end (for email and mailing pieces), with no modifications:\n\n${signature}`
    : `No signature block is configured for this office. For email and mailing pieces, close in the director's voice and sign with: ${director.name}, ${title}, ${office.name}. Do not invent a phone number or address.`
}`;

  return officeBlock;
}

function parseClaudeResponse(
  text: string
): { content: string; adaptations: Adaptation[]; keepInMind: KeepInMind[] } {
  // Strip markdown code fences if Claude wraps the JSON
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  try {
    const parsed = JSON.parse(cleaned);
    return {
      content: typeof parsed.content === 'string' ? parsed.content : text,
      adaptations: Array.isArray(parsed.adaptations) ? parsed.adaptations : [],
      keepInMind: Array.isArray(parsed.keepInMind) ? parsed.keepInMind : [],
    };
  } catch {
    // If JSON parsing fails, return the raw text with empty metadata
    return {
      content: text,
      adaptations: [],
      keepInMind: [
        {
          type: 'info' as const,
          message:
            'Structured analysis unavailable for this version. Review the content manually for brand consistency.',
        },
      ],
    };
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  // Auth check
  const authCookie = request.cookies.get('wr_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Type guard for VersionRequest shape
  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const candidate = body as Record<string, unknown>;

  if (typeof candidate.content !== 'string' || candidate.content.trim() === '') {
    return Response.json({ error: 'content must be a non-empty string' }, { status: 400 });
  }

  if (
    typeof candidate.contentType !== 'string' ||
    !VALID_CONTENT_TYPES.includes(candidate.contentType as ContentType)
  ) {
    return Response.json(
      {
        error: `contentType must be one of: ${VALID_CONTENT_TYPES.join(', ')}`,
      },
      { status: 400 }
    );
  }

  if (
    candidate.socialPlatform !== undefined &&
    (typeof candidate.socialPlatform !== 'string' ||
      !VALID_SOCIAL_PLATFORMS.includes(candidate.socialPlatform as SocialPlatform))
  ) {
    return Response.json(
      {
        error: `socialPlatform must be one of: ${VALID_SOCIAL_PLATFORMS.join(', ')}`,
      },
      { status: 400 }
    );
  }

  if (
    !Array.isArray(candidate.officeIds) ||
    (candidate.officeIds as unknown[]).length === 0
  ) {
    return Response.json(
      { error: 'officeIds must be a non-empty array' },
      { status: 400 }
    );
  }

  if (
    candidate.additionalInstructions !== undefined &&
    typeof candidate.additionalInstructions !== 'string'
  ) {
    return Response.json(
      { error: 'additionalInstructions must be a string if provided' },
      { status: 400 }
    );
  }

  const overridesValid =
    candidate.givingUrlOverrides === undefined ||
    (typeof candidate.givingUrlOverrides === 'object' &&
      candidate.givingUrlOverrides !== null &&
      !Array.isArray(candidate.givingUrlOverrides) &&
      Object.values(candidate.givingUrlOverrides as Record<string, unknown>).every(
        (v) => typeof v === 'string'
      ));

  if (!overridesValid) {
    return Response.json(
      { error: 'givingUrlOverrides must be an object mapping officeId to a URL string' },
      { status: 400 }
    );
  }

  const versionRequest: VersionRequest = {
    content: candidate.content.trim(),
    contentType: candidate.contentType as ContentType,
    officeIds: candidate.officeIds as string[],
    additionalInstructions:
      typeof candidate.additionalInstructions === 'string'
        ? candidate.additionalInstructions.trim() || undefined
        : undefined,
    socialPlatform:
      typeof candidate.socialPlatform === 'string'
        ? (candidate.socialPlatform as SocialPlatform)
        : undefined,
    givingUrlOverrides:
      candidate.givingUrlOverrides === undefined
        ? undefined
        : (candidate.givingUrlOverrides as Record<string, string>),
  };

  // Generate versions
  try {
    const versions: VersionResult[] = [];

    for (const officeId of versionRequest.officeIds) {
      const office = await getOfficeById(officeId);
      if (!office) {
        console.warn(`Office not found, skipping: ${officeId}`);
        continue;
      }

      const officePromptBlock = await buildOfficeSystemPrompt(
        officeId,
        versionRequest.givingUrlOverrides?.[officeId]
      );
      if (!officePromptBlock) continue;

      const systemPrompt = [
        BRAND_SYSTEM_PROMPT,
        getContentTypeInstructions(
          versionRequest.contentType,
          versionRequest.socialPlatform
        ),
        officePromptBlock,
      ].join('\n\n');

      const isAnnouncement = versionRequest.contentType === 'announcement';

      const userMessage = [
        isAnnouncement
          ? `Using the event / announcement details below, WRITE finished announcement copy in the voice of ${office.name}. This is a generation task, not a localization task — the details are a brief, not a piece to preserve. Output written content only: no image descriptions, no photo suggestions, no design or layout notes.`
          : `LOCALIZE the following content for ${office.name}. Preserve the piece as-is — same format, same structure, same length, same message. Only contextualize per this office (voice register, local references, director signature) and apply the giving-link and terminology rules. Do not rewrite, restructure, or re-order.`,
        '',
        versionRequest.content,
        ...(versionRequest.additionalInstructions
          ? ['', `Additional instructions: ${versionRequest.additionalInstructions}`]
          : []),
      ].join('\n');

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      const rawText = textBlock ? textBlock.text : '';

      const parsed = parseClaudeResponse(rawText);

      versions.push({
        officeId: office.id,
        officeName: office.name,
        directorName: office.director.name,
        directorEmail: office.director.email,
        content: parsed.content,
        adaptations: parsed.adaptations,
        keepInMind: parsed.keepInMind,
      });
    }

    return Response.json({ versions }, { status: 200 });
  } catch (error) {
    console.error('Error generating content versions:', error);
    return Response.json(
      { error: 'Failed to generate content versions. Please try again.' },
      { status: 500 }
    );
  }
}
