import { NextResponse } from 'next/server';
import { popularTags } from '@/lib/popular';

// GET /api/tags/popular — top tags across public tests (for the feed filter chips)
export async function GET() {
  try {
    const rows = await popularTags(40);
    return NextResponse.json({ tags: rows });
  } catch (error) {
    console.error('Popular tags error:', error);
    return NextResponse.json({ tags: [] });
  }
}
