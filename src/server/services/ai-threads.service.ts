// ---------------------------------------------------------------------------
// AI-tutor threads — one conversation per (user, test), stored in the
// DATABASE. Previously `ai_threads_<uid>` in localStorage on the phone.
// ---------------------------------------------------------------------------

import { db } from "@/lib/db";
import { ApiError } from "@/server/http/errors";

// A thread is a tutor conversation, not an archive: 200 messages / 256 KB
// is far beyond any real tutoring session.
const MAX_MESSAGES = 200;
const MAX_JSON_CHARS = 262_144;

export async function listThreads(userId: string) {
  const rows = await db.aiThread.findMany({
    where: { userId },
    select: { testId: true, title: true, messages: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return {
    threads: rows.map(r => ({
      testId: r.testId,
      title: r.title,
      messages: r.messages,
      updatedAt: r.updatedAt.getTime(),
    })),
  };
}

export async function saveThread(
  userId: string,
  input: { testId: string; title: string; messages: unknown }
) {
  const { testId, title, messages } = input;
  if (!testId || typeof testId !== "string" || testId.length > 64) {
    throw ApiError.badRequest("Invalid testId");
  }
  if (!Array.isArray(messages)) {
    throw ApiError.badRequest("Invalid messages payload");
  }
  const trimmed = messages.slice(-MAX_MESSAGES);
  if (JSON.stringify(trimmed).length > MAX_JSON_CHARS) {
    throw ApiError.badRequest("Thread too large");
  }
  await db.aiThread.upsert({
    where: { userId_testId: { userId, testId } },
    create: { userId, testId, title: String(title || "").slice(0, 200), messages: trimmed },
    update: { title: String(title || "").slice(0, 200), messages: trimmed },
  });
  return { ok: true };
}
