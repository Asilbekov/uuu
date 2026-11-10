// Small dependency-free sliding-window limiter. It protects a warm serverless
// instance; for a strict global limit configure Upstash in this one adapter.

import { ApiError } from "./errors";

type WindowState = Map<string, number[]>;

const globalForLimiter = globalThis as unknown as {
  __uuuRateWindow?: WindowState;
};
const hits: WindowState = globalForLimiter.__uuuRateWindow ?? new Map();
globalForLimiter.__uuuRateWindow = hits;

const MAX_KEYS = 10_000;

function parseWindowMs(window: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(window.trim());
  if (!match) return 60_000;
  const n = Number(match[1]);
  const multiplier = { ms: 1, s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
    match[2] as "ms" | "s" | "m" | "h" | "d"
  ];
  return n * multiplier;
}

function prune(now: number) {
  for (const [key, timestamps] of hits) {
    if (!timestamps.length || now - timestamps[timestamps.length - 1] > 86_400_000) {
      hits.delete(key);
    }
  }
  // Bound memory even under a distributed attack with unique identifiers.
  if (hits.size > MAX_KEYS) {
    const excess = hits.size - MAX_KEYS;
    let removed = 0;
    for (const key of hits.keys()) {
      hits.delete(key);
      if (++removed >= excess) break;
    }
  }
}

function limit(key: string, attempts: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 1_000 && Math.random() < 0.02) prune(now);
  const fresh = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  const success = fresh.length < attempts;
  if (success) fresh.push(now);
  hits.set(key, fresh);
  return {
    success,
    reset: fresh.length ? fresh[0] + windowMs : now + windowMs,
    remaining: Math.max(0, attempts - fresh.length),
  };
}

export type RatelimitWindow = string;
export type RatelimitMessageContext = {
  retryAfter: string;
  attempts: number;
  window: string;
};
export type RatelimitPolicy = {
  attempts: number;
  window: RatelimitWindow;
  keyPrefix: string;
  message?: string | ((ctx: RatelimitMessageContext) => string);
};

const seconds = (n: number) => `${n} second${n === 1 ? "" : "s"}`;
const minutes = (n: number) => `${n} minute${n === 1 ? "" : "s"}`;

export const formatRetryAfter = (resetAt: number) => {
  const value = Math.max(Math.ceil((resetAt - Date.now()) / 1000), 1);
  if (value < 60) return seconds(value);
  const mins = Math.ceil(value / 60);
  if (mins < 60) return minutes(mins);
  const hours = Math.ceil(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};

export const RATELIMIT_POLICIES = {
  login: { attempts: 10, window: "1 m", keyPrefix: "rl:auth:login" },
  register: { attempts: 5, window: "1 m", keyPrefix: "rl:auth:register" },
  ai: { attempts: 20, window: "1 m", keyPrefix: "rl:ai" },
  translate: { attempts: 30, window: "1 m", keyPrefix: "rl:translate" },
  feedSignal: { attempts: 240, window: "1 m", keyPrefix: "rl:feed:signal" },
  chatSend: { attempts: 60, window: "1 m", keyPrefix: "rl:chat:send" },
  testWrite: { attempts: 60, window: "1 m", keyPrefix: "rl:tests:write" },
  upload: { attempts: 30, window: "1 m", keyPrefix: "rl:upload" },
} as const satisfies Record<string, RatelimitPolicy>;

export type RatelimitPolicyKey = keyof typeof RATELIMIT_POLICIES;

export async function assertRateLimit({
  policy,
  identifier,
}: {
  policy: RatelimitPolicy;
  identifier: string | string[];
}) {
  const key = [
    policy.keyPrefix,
    ...(Array.isArray(identifier) ? identifier : [identifier]),
  ].join(":");
  const { success, reset } = limit(key, policy.attempts, parseWindowMs(policy.window));
  if (!success) {
    const retryAfter = formatRetryAfter(reset);
    const message =
      typeof policy.message === "function"
        ? policy.message({ retryAfter, attempts: policy.attempts, window: policy.window })
        : `Too many requests. Please try again in ${retryAfter}.`;
    throw ApiError.rateLimitExceeded(message);
  }
}
