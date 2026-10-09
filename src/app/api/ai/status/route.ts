import { aiStatus } from '@/lib/ai';
import { NextResponse } from 'next/server';

/**
 * GET /api/ai/status — deployment diagnostics for the AI provider chain
 * (Gemini / Google AI Mode / Mistral). No secrets are returned, just
 * which providers are configured.
 */
export async function GET() {
  return NextResponse.json(aiStatus());
}
