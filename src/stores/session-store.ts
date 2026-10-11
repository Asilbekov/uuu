import { create } from 'zustand';
import { makeSetters, type Upd, type Setters } from '@/stores/make-store';
import { NEXT_LANG, type Lang } from '@/lib/i18n';
import type { Attempt } from '@/lib/app-types';

// ---------------------------------------------------------------------------
// SESSION store — who is logged in, where the app landed and the interface
// language. Previously ~10 loose useState hooks inside app-root.tsx.
//
// The landing page is NOT seeded here: the server component knows the auth
// cookie, so AppRoot writes the SSR-correct page into the store during its
// first render (see the useState-seed in AppRoot) — every other field boots
// from these fixed defaults on both server and client.
// ---------------------------------------------------------------------------

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

// localStorage key for the interface language (EN -> RU -> UZ cycle button)
export const LANG_STORAGE_KEY = 'chemtest-lang';

interface SessionData {
  // The authenticated user (set on login / profile rename) and its
  // localStorage-restored twin (set once the boot hydration finishes)
  user: SessionUser | null;
  hydratedUser: SessionUser | null;
  // Global busy flag shared by the auth / editor / take-test screens
  loading: boolean;
  // "First data restore finished" — while false, empty lists render the feed
  // SKELETON (never a "no tests" card, never a splash)
  dataReady: boolean;
  // true while the post-boot background refresh is still fetching the first
  // real data (only when the localStorage cache had nothing to paint)
  bootRefreshing: boolean;
  // Attempt history (history page) + its localStorage boot cache
  attempts: Attempt[];
  // Interface language (en/ru/uz) — cycles with the header button, persisted
  lang: Lang;
  // Auth form state
  authMode: 'login' | 'signup';
  email: string;
  name: string;
  password: string;
}

interface SessionActions extends Setters<SessionData> {
  cycleLang: () => void;
}

const INITIAL: SessionData = {
  user: null,
  hydratedUser: null,
  loading: false,
  dataReady: false,
  bootRefreshing: false,
  attempts: [],
  lang: 'en',
  authMode: 'login',
  email: '',
  name: '',
  password: '',
};

export const useSessionStore = create<SessionData & SessionActions>(set => ({
  ...INITIAL,
  ...makeSetters<SessionData>(set, [
    'user',
    'hydratedUser',
    'loading',
    'dataReady',
    'bootRefreshing',
    'attempts',
    'lang',
    'authMode',
    'email',
    'name',
    'password',
  ]),
  cycleLang: () =>
    set((s: SessionData & SessionActions) => {
      const next = NEXT_LANG[s.lang];
      try { localStorage.setItem(LANG_STORAGE_KEY, next); } catch {}
      return { lang: next };
    }),
}));

// Non-hook read for code that runs outside React (handlers with stale
// closures, module helpers). Same contract as React's getState.
export const sessionNow = () => useSessionStore.getState();

// Functional-updater sugar for callers that previously used
// React.Dispatch<SetStateAction<T>> against these fields.
export type { Upd };
