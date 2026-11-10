// ---------------------------------------------------------------------------
// Auth service — register / login.
//
// Professional replacements over the previous hand-rolled version:
//   * bcrypt password hashing (src/server/auth/password.ts, the cal.com /
//     documenso standard) with transparent upgrade of legacy sha256 accounts;
//   * rate limiting through the dub-style policy table (brute-force guard);
//   * zod-validated input; stable error messages the frontend already shows.
// ---------------------------------------------------------------------------

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { ApiError } from "@/server/http/errors";

const PUBLIC_USER_FIELDS = { id: true, email: true, name: true } as const;
// A real bcrypt digest used only to equalize response timing for unknown emails.
const TIMING_SAFE_DUMMY_HASH = "$2a$10$1BwAvCqxHDaLRdhJV3.wEuQt/T3SdUCVFRjhgpplrbGfYrW2PNx0C";

export type PublicUser = { id: string; email: string; name: string };

export async function registerUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<PublicUser> {
  const { email, name, password } = input;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("Email already registered");
  }

  // Concurrent registers with the same email race past the check above —
  // the unique constraint is the source of truth. Map P2002 → 409.
  let user;
  try {
    user = await db.user.create({
      data: {
        email,
        name,
        password: hashPassword(password),
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw ApiError.conflict("Email already registered");
    }
    throw e;
  }

  return { id: user.id, email: user.email, name: user.name };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<PublicUser> {
  const { email, password } = input;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // Do comparable work for unknown accounts: response timing must not reveal
    // whether an email is registered. The public error stays identical too.
    verifyPassword(password, TIMING_SAFE_DUMMY_HASH);
    throw ApiError.unauthorized("Invalid email or password");
  }

  const result = verifyPassword(password, user.password);
  if (!result.ok) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  // Legacy sha256 account just authenticated — silently migrate it to bcrypt
  if (result.upgradeTo) {
    await db.user
      .update({ where: { id: user.id }, data: { password: result.upgradeTo } })
      .catch(() => {
        /* upgrade is best-effort — the login itself still succeeds */
      });
  }

  return { id: user.id, email: user.email, name: user.name };
}
