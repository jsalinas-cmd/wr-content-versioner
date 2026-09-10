import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lets the page restore a session on reload instead of showing the password gate
// while a valid 24hr cookie is still sitting in the browser.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authCookie = request.cookies.get('wr_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).password !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing required field: password' }, { status: 400 });
  }

  const { password } = body as { password: string };
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    console.error('APP_PASSWORD environment variable is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (password !== appPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set('wr_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });

  return response;
}
