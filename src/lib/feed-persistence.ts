'use client';

// ---------------------------------------------------------------------------
// Canonical TanStack Query cache persistence.
//
// Replaces the hand-rolled chemtest_cache_feed_v1 localStorage snapshot with
// the official persist-client plugin: ALL feed-scope queries (both feed
// scopes, every visited user library, bookmarks) are restored in one shot on
// boot and written back (throttled) on every cache change. The storage key is
// PER-USER, so one account can never see another account's cached feed.
// ---------------------------------------------------------------------------

import type { QueryClient } from '@tanstack/react-query';
import {
  persistQueryClient,
  persistQueryClientSubscribe,
} from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

let unsubscribe: (() => void) | null = null;

export const storageKeyFor = (userId: string) => `chemtest_rq_v1_${userId}`;

const isFeedScopeQuery = (key: readonly unknown[]) =>
  key[0] === 'feed' || key[0] === 'user-library' || key[0] === 'bookmarks';

export async function initFeedPersistence(userId: string, qc: QueryClient): Promise<void> {
  if (unsubscribe) {
    try { unsubscribe(); } catch {}
    unsubscribe = null;
  }
  if (typeof window === 'undefined' || !userId) return;
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: storageKeyFor(userId),
    throttleTime: 1_000,
  });
  const dehydrateOptions = {
    shouldDehydrateQuery: (query: { queryKey: readonly unknown[] }) => isFeedScopeQuery(query.queryKey),
  };
  // Subscribe BEFORE the restore so nothing written meanwhile is lost
  unsubscribe = persistQueryClientSubscribe({ queryClient: qc, persister, dehydrateOptions } as never);
  try {
    await persistQueryClient({ queryClient: qc, persister, maxAge: 24 * 60 * 60 * 1000, dehydrateOptions } as never);
  } catch {
    // A broken snapshot must never break the boot — the feed just refetches.
  }
}

export function teardownFeedPersistence(removeStorage: boolean, userId?: string) {
  if (unsubscribe) {
    try { unsubscribe(); } catch {}
    unsubscribe = null;
  }
  if (removeStorage && userId) {
    try { localStorage.removeItem(storageKeyFor(userId)); } catch {}
  }
}
