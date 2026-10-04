import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Global tag dictionary for autocomplete in the test editor.
// Returns every tag name ever used on a test.
export async function GET() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { name: 'asc' },
      select: { name: true },
    });
    return NextResponse.json({ tags: tags.map(t => t.name) });
  } catch (error) {
    console.error('List tags error:', error);
    return NextResponse.json({ tags: [] });
  }
}
