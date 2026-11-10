// ---------------------------------------------------------------------------
// Request parsing helpers — ported from dubinc/dub
// (apps/web/lib/api/utils.ts parseRequestBody) and extended with a query
// parser. zod schemas live next to the services that own their domain.
// ---------------------------------------------------------------------------

import { NextRequest } from "next/server";
import type { z } from "zod";
import { ApiError } from "./errors";

const MAX_JSON_BYTES = 2_000_000;

/** Parse JSON with a hard payload ceiling and a stable 400/413 contract. */
export async function parseRequestBody(req: Request): Promise<unknown> {
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_JSON_BYTES) {
    throw ApiError.payloadTooLarge("JSON request body exceeds the 2 MB limit");
  }
  try {
    const text = await req.text();
    // TextEncoder measures bytes, not UTF-16 code units (Cyrillic matters).
    if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) {
      throw ApiError.payloadTooLarge("JSON request body exceeds the 2 MB limit");
    }
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.badRequest(
      "Invalid JSON format in request body. Please ensure the request body is a valid JSON object."
    );
  }
}

/** Parse the body AND validate it with a zod schema in one step. */
export async function parseBody<S extends z.ZodType>(
  req: Request,
  schema: S
): Promise<z.infer<S>> {
  const body = await parseRequestBody(req);
  return schema.parse(body);
}

/** Validate the query string of a request with a zod schema. */
export function parseQuery<S extends z.ZodType>(
  req: NextRequest,
  schema: S
): z.infer<S> {
  const sp = req.nextUrl.searchParams;
  const obj: Record<string, string> = {};
  sp.forEach((v, k) => {
    obj[k] = v;
  });
  return schema.parse(obj);
}
