import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ id: string }> };

// Load attachment + verify the requester is authenticated (editing is open to
// every user — same open policy as test editing)
async function requireOwnedAttachment(request: NextRequest, ctx: RouteContext) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  }
  const { id } = await ctx.params;
  const attachment = await db.attachment.findUnique({
    where: { id },
  });
  if (!attachment) {
    return { error: NextResponse.json({ error: 'Attachment not found' }, { status: 404 }) };
  }
  return { attachment };
}

// PUT /api/attachments/[id] — edit title/type/url (any authenticated user)
export async function PUT(request: NextRequest, ctx: RouteContext) {
  try {
    const { error, attachment } = await requireOwnedAttachment(request, ctx);
    if (error) return error;

    const body = await request.json();
    const { title, type, url, size, orderNum } = body;

    const updated = await db.attachment.update({
      where: { id: attachment!.id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(url !== undefined && { url }),
        ...(size !== undefined && { size }),
        ...(orderNum !== undefined && { orderNum }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update attachment error:', error);
    return NextResponse.json({ error: 'Failed to update attachment' }, { status: 500 });
  }
}

// DELETE /api/attachments/[id] — remove an attachment (any authenticated user)
export async function DELETE(request: NextRequest, ctx: RouteContext) {
  try {
    const { error, attachment } = await requireOwnedAttachment(request, ctx);
    if (error) return error;

    await db.attachment.delete({ where: { id: attachment!.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete attachment error:', error);
    return NextResponse.json({ error: 'Failed to delete attachment' }, { status: 500 });
  }
}
