import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tests/[id]/attachments — list attachments of a test (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attachments = await db.attachment.findMany({
      where: { testId: id },
      orderBy: { orderNum: 'asc' },
      select: {
        id: true,
        testId: true,
        title: true,
        type: true,
        url: true,
        size: true,
        orderNum: true,
        createdAt: true,
      },
    });
    return NextResponse.json(attachments);
  } catch (error) {
    console.error('Get attachments error:', error);
    return NextResponse.json({ error: 'Failed to get attachments' }, { status: 500 });
  }
}

// POST /api/tests/[id]/attachments — add an attachment (any authenticated user,
// matching the open test-editing policy)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const test = await db.test.findUnique({ where: { id } });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    // Any authenticated user may attach files to any test (open editing policy)

    const body = await request.json();
    const { title, type, url, size } = body;
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Attachment URL is required' }, { status: 400 });
    }

    const count = await db.attachment.count({ where: { testId: id } });

    const attachment = await db.attachment.create({
      data: {
        testId: id,
        title: title || 'Attachment',
        type: type || 'link',
        url,
        size: typeof size === 'number' ? size : null,
        orderNum: count,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.error('Create attachment error:', error);
    return NextResponse.json({ error: 'Failed to create attachment' }, { status: 500 });
  }
}
