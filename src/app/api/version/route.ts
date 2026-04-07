import type { NextRequest } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { BRAND_SYSTEM_PROMPT, getContentTypeInstructions } from '@/config/brand';
import { getOfficeById } from '@/lib/officesStore';
import type { VersionRequest, VersionResult, Adaptation, KeepInMind } from '@/types';

async function buildOfficeSystemPrompt(officeId: string): Promise<string | null> {
  const office = await getOfficeById(officeId);
  if (!office) return null;

  const officeBlock = `## OFFICE: ${office.name.toUpperCase()}

**Director:** ${office.director.name}, ${office.director.title}
**Email:** ${office.director.email}
**Phone:** ${office.director.phone}

**Local Focus Areas:**
${office.localFocus.map((f) => `- ${f}`).join('\n')}

**Preferred Bible Verses:**
Weave 1-2 of these in naturally where appropriate — only if they serve the content, never forced:
${office.preferredBibleVerses.map((v) => `- ${v}`).join('\n')}

**Tone Notes:**
${office.toneNotes}

**Local Context:**
${office.localContext}

**Audience Notes:**
${office.audienceNotes}

**Signature Block:**
Always append this signature exactly as written at the end of the content — no modifications:

${office.signatureBlock}`;

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
    candidate.contentType !== 'email' &&
    candidate.contentType !== 'invitation'
  ) {
    return Response.json(
      { error: 'contentType must be "email" or "invitation"' },
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

  const versionRequest: VersionRequest = {
    content: candidate.content.trim(),
    contentType: candidate.contentType,
    officeIds: candidate.officeIds as string[],
    additionalInstructions:
      typeof candidate.additionalInstructions === 'string'
        ? candidate.additionalInstructions.trim() || undefined
        : undefined,
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

      const officePromptBlock = await buildOfficeSystemPrompt(officeId);
      if (!officePromptBlock) continue;

      const systemPrompt = [
        BRAND_SYSTEM_PROMPT,
        getContentTypeInstructions(versionRequest.contentType),
        officePromptBlock,
      ].join('\n\n');

      const userMessage = [
        `Adapt the following content for ${office.name}:`,
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
      { error: 'Failed to generate content versions' },
      { status: 500 }
    );
  }
}
