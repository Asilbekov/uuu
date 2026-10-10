/**
 * Saved test progress ("Continue Test") — localStorage persistence of the
 * full in-test state per user+test: the exact shuffled question order,
 * answers, practice reveals and position, plus the open attempt. A reload
 * (or leaving and coming back) then offers "Continue Test" instead of
 * starting over. Cleared on submit.
 *
 * Extracted verbatim from src/app/page.tsx so the page views
 * (src/components/pages/*) can use the helpers without circular imports.
 */
import type { Attempt, Question } from '@/lib/app-types';

export interface SavedTestProgress {
  v: 1;
  testId: string;
  savedAt: number;
  attempt: Attempt | null;
  currentQuestionIdx: number;
  answers: Record<string, string>;
  practiceMode: boolean;
  revealedAnswers: Record<string, boolean>;
  shuffledQuestions: Question[];
}

const PROGRESS_PREFIX = 'chemtest_progress_v1';
const PROGRESS_MAX_CHARS = 2_500_000; // stay far below the ~5MB localStorage quota
const progressCache = new Map<string, SavedTestProgress | null>();

const progressKey = (userId: string, testId: string) => `${PROGRESS_PREFIX}:${userId || 'anon'}:${testId}`;

export function readTestProgress(userId: string, testId: string): SavedTestProgress | null {
  const key = progressKey(userId, testId);
  if (progressCache.has(key)) return progressCache.get(key)!;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) { progressCache.set(key, null); return null; }
    const p = JSON.parse(raw) as SavedTestProgress;
    if (!p || p.v !== 1 || p.testId !== testId || !Array.isArray(p.shuffledQuestions) || p.shuffledQuestions.length === 0) {
      progressCache.set(key, null);
      return null;
    }
    if (!p.answers || typeof p.answers !== 'object') p.answers = {};
    progressCache.set(key, p);
    return p;
  } catch {
    progressCache.set(key, null);
    return null;
  }
}

export function writeTestProgress(userId: string, p: SavedTestProgress) {
  const key = progressKey(userId, p.testId);
  try {
    const raw = JSON.stringify(p);
    if (raw.length > PROGRESS_MAX_CHARS) return; // huge test — skip silently
    localStorage.setItem(key, raw);
    progressCache.set(key, p);
  } catch {
    // quota / private mode — progress simply won't persist
  }
}

export function clearTestProgress(userId: string, testId: string) {
  const key = progressKey(userId, testId);
  try { localStorage.removeItem(key); } catch {}
  progressCache.set(key, null);
}

export const countAnsweredProgress = (p: SavedTestProgress | null) =>
  p ? Object.keys(p.answers || {}).filter(k => k && p.answers[k]).length : 0;
