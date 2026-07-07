import type { NextRequest } from 'next/server';
import { anthropic } from '@/lib/anthropic';

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<Response> {
  const authCookie = request.cookies.get('wr_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Expected multipart/form-data body' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'file field is required' }, { status: 400 });
  }

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return Response.json({ error: 'file must be a PDF' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: `PDF must be under ${Math.round(MAX_BYTES / 1024 / 1024)}MB` },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Extract ALL text content from this PDF, preserving the original structure.

Rules:
- Use markdown-style headings (#, ##, ###) to reflect the document's visual hierarchy
- Preserve lists as markdown bullet/numbered lists
- Preserve tables as markdown tables when feasible
- Preserve any URLs, dates, proper nouns, and program names exactly as written
- Do not summarize or paraphrase — reproduce the content faithfully
- Do not add commentary before or after the extracted text

Respond with ONLY the extracted markdown content. No preamble, no closing remarks.`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const extracted = textBlock ? textBlock.text.trim() : '';

    if (!extracted) {
      return Response.json(
        { error: 'No text could be extracted from this PDF' },
        { status: 422 }
      );
    }

    return Response.json({ text: extracted }, { status: 200 });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return Response.json({ error: 'Failed to extract PDF' }, { status: 500 });
  }
}
