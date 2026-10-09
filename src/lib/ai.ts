/**
 * Unified AI client for the app (chat tutor + explanation generator).
 *
 * Provider chain, tried in order until one answers:
 *   1. Gemini (Google AI Studio API)   — when GEMINI_API_KEY is configured.
 *      This is the same model family that powers "AI Mode" in Google Search.
 *   2. Google AI Mode (direct scrape)  — a no-key best-effort client that asks
 *      https://www.google.com/search?q=...&udm=50 (the AI Mode page) and parses
 *      the answer out of the returned HTML, mirroring
 *      github.com/Adwaith673/-Google-AI-Mode-Direct-Scraper.
 *      Google heavily CAPTCHAs datacenter IPs, so on serverless this usually
 *      fails fast — a circuit breaker skips it for a while after failures.
 *   3. Mistral                          — always-available fallback.
 *
 * All providers speak the same message array the Mistral client used, so the
 * routes stay unchanged apart from the import.
 */
import { mistralChat, type ChatCompletionOptions } from '@/lib/mistral';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/* ------------------------------------------------------------------ */
/* Provider 1 — Gemini (Google AI Studio)                              */
/* ------------------------------------------------------------------ */

async function geminiChat(options: ChatCompletionOptions): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_NOT_CONFIGURED');

  const system = options.messages
    .filter(m => m.role === 'system')
    .map(m => m.content)
    .join('\n\n');
  const contents = options.messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: {
          temperature: options.temperature ?? 0.5,
          maxOutputTokens: options.max_tokens ?? 1600,
        },
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  const body: any = await res.json().catch(() => null);
  const text: string | undefined = body?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p?.text || '')
    .join('');
  if (!res.ok || !text) {
    const desc = body?.error?.message || `HTTP ${res.status}`;
    throw new Error(`GEMINI_API_ERROR: ${desc}`);
  }
  return text;
}

/* ------------------------------------------------------------------ */
/* Provider 2 — Google AI Mode direct scrape (no API key)              */
/* ------------------------------------------------------------------ */

const AI_MODE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const AI_MODE_TIMEOUT_MS = 9000;

// Circuit breaker: after N consecutive failures skip the scrape for a while —
// datacenter IPs are usually CAPTCHA'd and retrying on every request only
// slows the chat down.
const BREAKER_THRESHOLD = 3;
const BREAKER_COOLDOWN_MS = 10 * 60 * 1000;
let aiModeFailures = 0;
let aiModeBlockedUntil = 0;

function aiModeUrl(query: string): string {
  const qsubts = Date.now();
  return (
    'https://www.google.com/search?q=' + encodeURIComponent(query) +
    '&sourceid=chrome&ie=UTF-8&udm=50&aep=48&cud=0&qsubts=' + qsubts
  );
}

/** Strip HTML to plain text lines (same spirit as the scraper's BeautifulSoup pass). */
function htmlToLines(html: string): string[] {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

const AI_BLOCK_SELECTORS = [
  /<div[^>]+class="[^"]*(?:ai-response|generated-content|ai-overview|WaaZC|LMRCfc|hgKElc|Cx9mnf|SPZz6b)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
];

/**
 * Pull the AI answer out of an AI Mode page. The initial HTML embeds the
 * answer both as rendered blocks and inside JS data blobs; we try the blocks
 * first, then fall back to scanning decoded JS strings for the answer text.
 */
function extractAiModeAnswer(html: string, question: string): string | null {
  if (/(^|\/)sorry(\/|\?|")|unusual traffic|enablejs/i.test(html.slice(0, 4000))) return null;

  // 1. Rendered answer blocks
  for (const re of AI_BLOCK_SELECTORS) {
    re.lastIndex = 0;
    const blocks = html.match(re) || [];
    for (const b of blocks) {
      const text = htmlToLines(b).join('\n');
      if (text.length > 80 && text.length < 8000) return text;
    }
  }

  // 2. JS data blobs: AI Mode stores the answer text in escaped JSON strings.
  // Look for the longest readable string chunk on the page.
  const strings = html.match(/"[^"\\]{120,2000}"/g) || [];
  const candidates = strings
    .map(s => s.slice(1, -1))
    .filter(s => !/https?:|function\(|var |window\.|\.css|\.js|\{|\}/.test(s))
    .map(s => s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>'))
    .filter(s => s.split(/\s+/).length > 15 && /[a-zа-яё\u0400-\u04FF]/i.test(s));
  if (candidates.length) {
    candidates.sort((a, b) => b.length - a.length);
    const best = candidates[0];
    if (best.length > 120) return best;
  }

  // 3. Whole-page fallback: question echoed followed by answer lines.
  const lines = htmlToLines(html);
  const qWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const startIdx = lines.findIndex(l => qWords.some(w => l.toLowerCase().includes(w)));
  if (startIdx >= 0) {
    const tail = lines.slice(startIdx + 1).join('\n');
    if (tail.length > 120) return tail.slice(0, 4000);
  }
  return null;
}

/** Collapse a chat into the single question string AI Mode is asked. */
function conversationToQuery(options: ChatCompletionOptions): string {
  const parts: string[] = [];
  for (const m of options.messages) {
    if (m.role === 'system') continue;
    parts.push(m.content);
  }
  return parts.join('\n\n').slice(0, 1800);
}

async function googleAiModeChat(options: ChatCompletionOptions): Promise<string> {
  if (Date.now() < aiModeBlockedUntil) throw new Error('AI_MODE_BREAKER_OPEN');

  const query = conversationToQuery(options);
  const res = await fetch(aiModeUrl(query), {
    headers: {
      'User-Agent': AI_MODE_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
      'Cookie': 'SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg; CONSENT=YES+cb',
    },
    signal: AbortSignal.timeout(AI_MODE_TIMEOUT_MS),
  });
  const html = await res.text();
  const answer = res.ok ? extractAiModeAnswer(html, query) : null;
  if (!answer) {
    aiModeFailures += 1;
    if (aiModeFailures >= BREAKER_THRESHOLD) {
      aiModeBlockedUntil = Date.now() + BREAKER_COOLDOWN_MS;
      aiModeFailures = 0;
    }
    throw new Error(`AI_MODE_NO_ANSWER (HTTP ${res.status})`);
  }
  aiModeFailures = 0;
  return answer;
}

/* ------------------------------------------------------------------ */
/* Chain                                                               */
/* ------------------------------------------------------------------ */

export type AiEngine = 'gemini' | 'google-ai-mode' | 'mistral';

/**
 * Run the chat through the provider chain. Returns the answer text.
 * Throws only when every provider failed (the routes map that to 5xx).
 */
export async function aiChat(options: ChatCompletionOptions): Promise<{ text: string; engine: AiEngine }> {
  const errors: string[] = [];

  // 1. Gemini — the reliable "Google AI" path when a key is present.
  if (GEMINI_API_KEY) {
    try {
      const text = await geminiChat(options);
      if (text.trim()) return { text, engine: 'gemini' };
    } catch (e: any) {
      errors.push(`gemini: ${e?.message || e}`);
    }
  }

  // 2. Google AI Mode scrape — free, no key; skipped while the breaker is open.
  try {
    const text = await googleAiModeChat(options);
    if (text.trim()) return { text, engine: 'google-ai-mode' };
  } catch (e: any) {
    errors.push(`ai-mode: ${e?.message || e}`);
  }

  // 3. Mistral — proven fallback so the tutor never goes dark.
  const text = await mistralChat(options);
  return { text, engine: 'mistral' };
}

/** Small status probe used by /api/ai/status for deployment diagnostics. */
export function aiStatus() {
  return {
    gemini: !!GEMINI_API_KEY,
    geminiModel: GEMINI_API_KEY ? GEMINI_MODEL : null,
    aiModeBreakerOpen: Date.now() < aiModeBlockedUntil,
    mistral: true,
  };
}
