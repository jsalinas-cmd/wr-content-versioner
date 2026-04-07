import type { NextRequest } from 'next/server';
import { getAllOffices } from '@/lib/officesStore';

export async function GET(request: NextRequest): Promise<Response> {
  const authCookie = request.cookies.get('wr_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const offices = await getAllOffices();
    return Response.json({ offices });
  } catch (error) {
    console.error('Error fetching offices:', error);
    return Response.json({ error: 'Failed to fetch offices' }, { status: 500 });
  }
}
