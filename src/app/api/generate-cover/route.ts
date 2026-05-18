import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { testId } = body as { testId: string };

    if (!testId) {
      return NextResponse.json({ error: 'testId required' }, { status: 400 });
    }

    // Fetch test info
    const test = await db.test.findUnique({
      where: { id: testId },
      select: { id: true, title: true, topic: true, description: true, coverImage: true },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // If cover already exists, return it
    if (test.coverImage) {
      return NextResponse.json({ coverImage: test.coverImage });
    }

    // Generate cover image using z-ai-web-dev-sdk
    const topicLower = test.topic.toLowerCase();
    let visualPrompt: string;

    if (topicLower.includes('physics')) {
      visualPrompt = `A stunning educational illustration for a physics test. Show electromagnetic waves, atomic structures, Newton's laws visualized, planetary orbits, wave interference patterns, and electrical circuits. Use deep blues, electric purples, and bright teal. Modern geometric style with glowing energy lines. Professional and visually striking. No text or words.`;
    } else if (topicLower.includes('chemistry')) {
      visualPrompt = `A stunning educational illustration for a chemistry test. Show molecular structures, periodic table elements, chemical bonds, laboratory equipment (beakers, flasks, test tubes), reaction equations. Use vibrant emerald greens, deep teals, and warm amber. Modern geometric style with glowing molecules. Professional and visually striking. No text or words.`;
    } else if (topicLower.includes('math') || topicLower.includes('algebra')) {
      visualPrompt = `A stunning educational illustration for a mathematics test. Show geometric shapes, coordinate planes, equations, graphs, matrices, integrals, and number patterns. Use warm amber, orange, and coral red. Modern geometric style with flowing mathematical curves. Professional and visually striking. No text or words.`;
    } else {
      visualPrompt = `A beautiful, modern educational illustration for a test about ${test.topic}. Scientific symbols, formulas, and educational imagery. Vibrant purples, greens, and blues. Clean professional design for test card cover. No text.`;
    }

    const zai = await ZAI.create();
    const response = await zai.images.generations.create({
      prompt: visualPrompt,
      size: '1344x768',
    });

    const imageBase64 = response.data[0]?.base64;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    // Store as data URL
    const coverImage = `data:image/png;base64,${imageBase64}`;

    // Save to database
    await db.test.update({
      where: { id: testId },
      data: { coverImage },
    });

    return NextResponse.json({ coverImage });
  } catch (error: any) {
    console.error('Generate cover error:', error);
    // Check if it's a rate limit error
    if (error?.message?.includes('429') || error?.message?.includes('Too many requests')) {
      return NextResponse.json({ error: 'Rate limited - please try again later', retry: true }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to generate cover image' }, { status: 500 });
  }
}
