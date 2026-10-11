// POST /api/auth/login — verify credentials and return the session user.
// Rate-limited per IP+email (dub's login policy); legacy unsalted-sha256
// accounts transparently upgrade to bcrypt on this path.
import { NextResponse } from "next/server";
import { withApi } from "@/server/http/handler";
import { assertRateLimit, RATELIMIT_POLICIES } from "@/server/http/rate-limit";
import { parseBody } from "@/server/http/validation";
import { loginSchema } from "@/server/schemas";
import { loginUser } from "@/server/services/auth.service";

export const POST = withApi(async ({ req, ip }) => {
  const body = await parseBody(req, loginSchema);
  await assertRateLimit({
    policy: RATELIMIT_POLICIES.login,
    identifier: [ip, body.email],
  });
  return NextResponse.json(await loginUser(body));
});
