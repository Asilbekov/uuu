// GET /api/auth/me — the session user for a valid x-user-id header.
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { withApiAuth } from "@/server/http/handler";
import { ApiError } from "@/server/http/errors";

export const GET = withApiAuth(async ({ userId }) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) throw ApiError.notFound("User not found");
  return NextResponse.json(user);
});
