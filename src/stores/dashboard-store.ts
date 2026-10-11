import { makeStore } from '@/stores/make-store';
import type { Test } from '@/lib/app-types';

// ---------------------------------------------------------------------------
// DASHBOARD store — the swipe feed's position, the header search overlay and
// per-card UI caches. Previously ~10 loose useState hooks inside app-root.tsx.
// (The feed DATA itself lives in TanStack Query — see src/lib/feed-queries.ts;
// this store only owns presentation state.)
// ---------------------------------------------------------------------------

interface DashboardData {
  // Index of the committed (settled) card in the TikTok feed. The gesture
  // layer writes it after the swipe animation ends — never mid-gesture —
  // so counters/highlights cannot flip while the card is still moving.
  dashTestIdx: number;
  // Full-test payloads (attachments etc.) fetched lazily per card, deduped
  // by the prediction engine
  dashFullTests: Record<string, Test>;
  // Header search overlay: query + results + tag-dictionary feedback
  dashSearch: string;
  dashSearchOpen: boolean;
  dashSearchResults: Test[] | null;
  dashSearching: boolean;
  dashTagInfo: { query: string; exists: boolean; created: boolean; similar: string[] } | null;
  // Library grid: 2 cards per row on phones, 3 per row from sm up
  libNarrow: boolean;
  // Per-card share scope selection: exactly one of the two share buttons on a
  // card can be highlighted at a time (radio behaviour, like the mode cards).
  shareScopeByTest: Record<string, 'link' | 'community'>;
  shareBusy: boolean;
}

const INITIAL: DashboardData = {
  dashTestIdx: 0,
  dashFullTests: {},
  dashSearch: '',
  dashSearchOpen: false,
  dashSearchResults: null,
  dashSearching: false,
  dashTagInfo: null,
  libNarrow: false,
  shareScopeByTest: {},
  shareBusy: false,
};

export const useDashboardStore = makeStore(INITIAL);

// Fresh, hook-free read for handlers that must not depend on render closures
export const dashboardNow = () => useDashboardStore.getState();
