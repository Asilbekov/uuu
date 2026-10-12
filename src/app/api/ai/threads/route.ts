// /api/ai/threads — the signed-in user's AI-tutor conversations (one per
// test), stored in the DATABASE. Previously `ai_threads_<uid>` localStorage.
// GET → { threads: [{ testId, title, messages, updatedAt }] }
// PUT → upsert one thread { testId, title, messages }
import { NextResponse } from "next/server";
import { withApiAuth } from "@/server/http/handler";
import { parseBody } from "@/server/http/validation";
import { z } from "zod";
import { listThreads, saveThread } from "@/server/services/ai-threads.service";

export const runtime = "nodejs";

const threadSchema = z.object({
  testId: z.string().min(1).max(64),
  title: z.string().max(200).optional().default(""),
  messages: z.array(z.unknown()).max(200),
});

export const GET = withApiAuth(async ({ userId }) => {
  return NextResponse.json(await listThreads(userId));
});

export const PUT = withApiAuth(async ({ userId, req }) => {
  const body = await parseBody(req, threadSchema);
  return NextResponse.json(await saveThread(userId, body));
});
