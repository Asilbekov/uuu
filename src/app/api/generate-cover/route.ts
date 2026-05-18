import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Mistral AI doesn't support image generation.
// We generate beautiful SVG-based cover images instead of API calls.
// This eliminates rate limiting issues entirely.

const TOPIC_CONFIGS: Record<string, { gradient: string; icons: string; label: string }> = {
  physics: {
    gradient: 'from-blue-500 via-indigo-600 to-purple-700',
    icons: '⚛️ 🔬 🧲',
    label: 'Physics',
  },
  chemistry: {
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    icons: '🧪 ⚗️ 🔬',
    label: 'Chemistry',
  },
  mathematics: {
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    icons: '📐 📊 ∑',
    label: 'Mathematics',
  },
  algebra: {
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    icons: '📐 📊 ∑',
    label: 'Mathematics',
  },
  biology: {
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    icons: '🧬 🌱 🔬',
    label: 'Biology',
  },
  history: {
    gradient: 'from-amber-600 via-yellow-700 to-orange-800',
    icons: '📜 🏛️ 📖',
    label: 'History',
  },
  default: {
    gradient: 'from-violet-500 via-purple-600 to-pink-600',
    icons: '📚 ✨ 🎓',
    label: 'Education',
  },
};

function generateSVG(testTitle: string, topic: string, description: string): string {
  const config = TOPIC_CONFIGS[topic.toLowerCase()] || TOPIC_CONFIGS.default;

  // Create SVG with gradients and text
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1344" height="768" viewBox="0 0 1344 768">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      ${topic.toLowerCase().includes('physics') ? '<stop offset="0%" style="stop-color:#3b82f6"/><stop offset="50%" style="stop-color:#4f46e5"/><stop offset="100%" style="stop-color:#7c3aed"/>' : ''}
      ${topic.toLowerCase().includes('chemistry') ? '<stop offset="0%" style="stop-color:#10b981"/><stop offset="50%" style="stop-color:#0d9488"/><stop offset="100%" style="stop-color:#0e7490"/>' : ''}
      ${topic.toLowerCase().includes('math') || topic.toLowerCase().includes('algebra') ? '<stop offset="0%" style="stop-color:#f59e0b"/><stop offset="50%" style="stop-color:#ea580c"/><stop offset="100%" style="stop-color:#dc2626"/>' : ''}
      ${!topic.toLowerCase().includes('physics') && !topic.toLowerCase().includes('chemistry') && !topic.toLowerCase().includes('math') && !topic.toLowerCase().includes('algebra') ? '<stop offset="0%" style="stop-color:#8b5cf6"/><stop offset="50%" style="stop-color:#9333ea"/><stop offset="100%" style="stop-color:#ec4899"/>' : ''}
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1344" height="768" fill="url(#bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.05)"/>
  <circle cx="1100" cy="600" r="120" fill="rgba(255,255,255,0.05)"/>
  <circle cx="700" cy="100" r="50" fill="rgba(255,255,255,0.03)"/>
  <circle cx="150" cy="600" r="100" fill="rgba(255,255,255,0.04)"/>
  <circle cx="1200" cy="200" r="60" fill="rgba(255,255,255,0.03)"/>
  
  <!-- Grid lines -->
  <line x1="0" y1="384" x2="1344" y2="384" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <line x1="672" y1="0" x2="672" y2="768" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  
  <!-- Icons area -->
  <text x="672" y="280" text-anchor="middle" font-size="80" fill="rgba(255,255,255,0.2)" filter="url(#glow)">
    ${config.icons}
  </text>
  
  <!-- Topic badge -->
  <rect x="560" y="320" width="224" height="40" rx="20" fill="rgba(255,255,255,0.15)"/>
  <text x="672" y="346" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="rgba(255,255,255,0.9)">
    ${config.label}
  </text>
  
  <!-- Title -->
  <text x="672" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white">
    ${testTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </text>
  
  <!-- Description (truncated) -->
  <text x="672" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)">
    ${description.substring(0, 80).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}${description.length > 80 ? '...' : ''}
  </text>
</svg>`;

  return svg;
}

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

    // Generate SVG cover image (no API call needed - no rate limits!)
    const svg = generateSVG(test.title, test.topic, test.description);
    const coverImage = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    // Save to database
    await db.test.update({
      where: { id: testId },
      data: { coverImage },
    });

    return NextResponse.json({ coverImage });
  } catch (error: any) {
    console.error('Generate cover error:', error);
    return NextResponse.json({ error: 'Failed to generate cover image' }, { status: 500 });
  }
}
