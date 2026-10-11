// POST /api/auth/register — create an account (bcrypt-hashed password,
// rate-limited per IP+email against brute-force signup loops).
import { NextResponse } from "next/server";
import { withApi } from "@/server/http/handler";
import { assertRateLimit, RATELIMIT_POLICIES } from "@/server/http/rate-limit";
import { parseBody } from "@/server/http/validation";
import { registerSchema } from "@/server/schemas";
import { registerUser } from "@/server/services/auth.service";

export const POST = withApi(async ({ req, ip }) => {
  const body = await parseBody(req, registerSchema);
  await assertRateLimit({
    policy: RATELIMIT_POLICIES.register,
    identifier: [ip, body.email],
  });
  const user = await registerUser(body);
  return NextResponse.json(user, { status: 201 });
});
