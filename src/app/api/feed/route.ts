import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { affinityMap, bumpAffinity } from '@/lib/affinity';

// ---------------------------------------------------------------------------
// GET /api/feed — the scalable, personalized test feed.
//
// ?tab=foryou|trending|new   feed ranking mode (default foryou)
// &cursor=...                opaque pagination cursor ("o:<offset>" for foryou /
//                            trending, "createdAt|id" keyset for new)
// &limit=10                  page size (max 20)
// &tag=...                   filter by one tag
// &q=...                     search by TAGS (partial, case-insensitive;
//                            tests that carry at least one matching tag)
// &creatorId=...             only tests of one author ("my tests")
//
// Design goals (TikTok-scale readiness):
//   * keyset pagination on (createdAt, id) — constant cost at any depth;
//   * slim projection: no coverImage blob, no questions, no attachments;
//   * bounded candidate pools + indexed queries for every ranking mode;
//   * recommendations = tag affinity (decayed) + recent popularity + freshness.
// ---------------------------------------------------------------------------

export const dynamic = 'force-dynamic';

const PAGE_LIMIT = 10;
const MAX_LIMIT = 20;
// Candidate pools for the personalized ranking (bounded, index-backed scans)
const FORYOU_RECENT_POOL = 800;
const FORYOU_HOT_POOL = 200;
// In-memory cache of the ranked "For You" id list per user+filter combo
const foryouCache = new Map<string, { ids: string[]; rankedAt: number; base: { createdAt: Date; id: string } | null }>();
const FORYOU_TTL_MS = 90_000;

type CursorInfo = { mode: 'offset'; offset: number } | { mode: 'keyset'; createdAt: Date; id: string } | null;

function parseCursor(raw: string | null): CursorInfo {
  if (!raw) return null;
  if (raw.startsWith('o:')) {
    const n = parseInt(raw.slice(2), 10);
    return Number.isFinite(n) && n >= 0 ? { mode: 'offset', offset: n } : null;
  }
  const sep = raw.indexOf('|');
  if (sep > 0) {
    const d = new Date(raw.slice(0, sep));
    const id = raw.slice(sep + 1);
    if (!Number.isNaN(d.getTime()) && id) return { mode: 'keyset', createdAt: d, id };
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);

    const tabRaw = searchParams.get('tab') || 'foryou';
    const tab = ['foryou', 'trending', 'new'].includes(tabRaw) ? tabRaw : 'foryou';
    // Content scope (dashboard modes):
    //   all      — public tests + the user's own (default, legacy behaviour)
    //   mine     — the user's OWN tests + the tests bookmarked into their library
    //   discover — public tests of OTHER authors (search for new knowledge)
    const scopeRaw = searchParams.get('scope') || 'all';
    const scope = ['mine', 'discover'].includes(scopeRaw) ? scopeRaw : 'all';
    // Bookmarks for the "mine" scope (empty list → only the user's own tests)
    const bookmarkIds = scope === 'mine' && userId
      ? (await db.bookmark.findMany({ where: { userId }, select: { testId: true } })).map(r => r.testId)
      : [];
    const limit = Math.min(MAX_LIMIT, Math.max(2, parseInt(searchParams.get('limit') || '', 10) || PAGE_LIMIT));
    const tag = (searchParams.get('tag') || '').trim().slice(0, 30) || null;
    const q = (searchParams.get('q') || '').trim().slice(0, 80) || null;
    const creatorId = (searchParams.get('creatorId') || '').trim() || null;
    const cursor = parseCursor(searchParams.get('cursor'));

    // ---- visibility: public tests + the user's own (legacy "all" scope) ----
    let visibility: any;
    if (scope === 'mine') {
      visibility = userId
        ? { OR: [{ creatorId: userId }, ...(bookmarkIds.length ? [{ id: { in: bookmarkIds } }] : [])] }
        : { id: { in: [] } };
    } else if (scope === 'discover') {
      visibility = userId
        ? { AND: [{ isPublic: true }, { creatorId: { not: userId } }] }
        : { isPublic: true };
    } else {
      visibility = userId
        ? { OR: [{ isPublic: true }, { creatorId: userId }] }
        : { isPublic: true };
    }

    // ---- shared filters (tag / search / author) ----
    const filters: any[] = [visibility];
    if (tag) filters.push({ tags: { has: tag } });
    // Search is TAG-based: resolve the query to matching tag names (partial,
    // case-insensitive) first, then keep tests carrying any of those tags.
    // Title/description are intentionally NOT searched (per product decision).
    // Fallback (product decision): when the exact tag does not exist yet, it is
    // CREATED in the global Tag dictionary on the fly, the user is told so via
    // tagInfo, and tests carrying CLOSE (partial-match) tags are still shown.
    let tagInfo: { query: string; exists: boolean; created: boolean; similar: string[] } | null = null;
    if (q) {
      // Close tags = substring matches (ILIKE) PLUS trigram-similar matches
      // (typo tolerance, pg_trgm), closest first.
      let matchedTags: string[] = [];
      try {
        const rows = await db.$queryRawUnsafe<{ tag: string }[]>(
          `SELECT tg.tag FROM "Test" t CROSS JOIN LATERAL unnest(t.tags) AS tg(tag)
           WHERE tg.tag ILIKE $1 OR similarity(tg.tag, $2) > 0.3
           GROUP BY tg.tag ORDER BY similarity(tg.tag, $2) DESC LIMIT 25`,
          `%${q}%`, q
        );
        matchedTags = rows.map(r => r.tag);
      } catch {
        const rows = await db.$queryRawUnsafe<{ tag: string }[]>(
          `SELECT DISTINCT tg.tag FROM "Test" t CROSS JOIN LATERAL unnest(t.tags) AS tg(tag) WHERE tg.tag ILIKE $1 LIMIT 25`,
          `%${q}%`
        );
        matchedTags = rows.map(r => r.tag);
      }
      // Exact (case-insensitive) existence: Tag dictionary OR any test's tags
      const exactRows = await db.$queryRawUnsafe<{ ok: boolean }[]>(
        `SELECT (EXISTS (SELECT 1 FROM "Tag" WHERE name ILIKE $1) OR EXISTS (
           SELECT 1 FROM "Test" t CROSS JOIN LATERAL unnest(t.tags) tg WHERE tg ILIKE $1)) AS ok`,
        q
      );
      const exists = !!exactRows[0]?.ok;
      let created = false;
      if (!exists && q.length >= 2) {
        try {
          await db.tag.upsert({ where: { name: q }, update: {}, create: { name: q } });
          created = true;
        } catch { /* dictionary write is best-effort — search still works */ }
      }
      tagInfo = {
        query: q,
        exists,          // existed BEFORE this search
        created,         // we just created it in the dictionary
        similar: matchedTags.filter(t => t.toLowerCase() !== q.toLowerCase()).slice(0, 8),
      };
      filters.push(matchedTags.length ? { tags: { hasSome: matchedTags } } : { id: { in: [] } });
    }
    if (creatorId) filters.push({ creatorId });

    const slimSelect = {
      id: true,
      title: true,
      description: true,
      topic: true,
      creatorId: true,
      creator: { select: { id: true, name: true, image: true } },
      isPublic: true,
      tags: true,
      coverIcon: true,
      coverColor: true,
      createdAt: true,
      randomizeQuestions: true,
      randomizeOptions: true,
      _count: { select: { questions: true, attempts: true, attachments: true } },
    } as const;

    const toCard = (r: any) => ({
      ...r,
      description: (r.description || '').slice(0, 280),
      hasCoverImage: false,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    });

    // Slim rows by ids, preserving the requested order
    const slimByIds = async (ids: string[]) => {
      if (!ids.length) return [];
      const rows = await db.test.findMany({
        where: { id: { in: ids } },
        select: slimSelect,
      });
      const byId = new Map(rows.map(r => [r.id, r]));
      return ids.map(id => byId.get(id)).filter(Boolean).map(toCard);
    };

    // ------------------------------ NEW (keyset) ------------------------------
    if (tab === 'new') {
      const where: any = { AND: [...filters] };
      if (cursor?.mode === 'keyset') {
        where.AND.push({
          OR: [
            { createdAt: { lt: cursor.createdAt } },
            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
          ],
        });
      }
      const rows = await db.test.findMany({
        where,
        select: slimSelect,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
      });
      const hasMore = rows.length > limit;
      const page = rows.slice(0, limit);
      const last = page[page.length - 1];
      return NextResponse.json({
        items: page.map(toCard),
        nextCursor: hasMore && last ? `${new Date(last.createdAt).toISOString()}|${last.id}` : null,
        tab,
        tagInfo,
      });
    }

    // ------------------------------ TRENDING ----------------------------------
    // Hot = attempts in the last 7 days (indexed subquery), tie-break by recency.
    if (tab === 'trending') {
      const offset = cursor?.mode === 'offset' ? cursor.offset : 0;
      if (offset > 2000) return NextResponse.json({ items: [], nextCursor: null, tab });

      const conds: string[] = [];
      const params: any[] = [];
      if (scope === 'mine') {
        // Own tests + bookmarked ones (regardless of isPublic — a bookmark
        // stays readable in the library even if the author later privatizes it)
        const bmIdx = params.push(bookmarkIds);
        const meIdx = params.push(userId || '');
        conds.push(`(t."creatorId" = $${meIdx} OR t."id" = ANY($${bmIdx}::text[]))`);
      } else {
        conds.push('t."isPublic" = TRUE');
        if (scope === 'discover' && userId) {
          const meIdx = params.push(userId);
          conds.push(`t."creatorId" <> $${meIdx}`);
        }
      }
      if (tag) { params.push(tag); conds.push(`$${params.length} = ANY(t.tags)`); }
      if (q) { params.push(`%${q}%`); conds.push(`EXISTS (SELECT 1 FROM unnest(t.tags) tg WHERE tg ILIKE $${params.length})`); }
      if (creatorId) { params.push(creatorId); conds.push(`t."creatorId" = $${params.length}`); }
      params.push(limit + 1, offset);
      const lim = `$${params.length - 1}`;
      const off = `$${params.length}`;
      const sql = `
        SELECT t.id
        FROM "Test" t
        LEFT JOIN (
          SELECT "testId", COUNT(*)::int AS c
          FROM "TestAttempt"
          WHERE "startedAt" > now() - interval '7 days'
          GROUP BY "testId"
        ) a ON a."testId" = t.id
        WHERE ${conds.join(' AND ')}
        ORDER BY COALESCE(a.c, 0) DESC, t."createdAt" DESC, t.id DESC
        LIMIT ${lim} OFFSET ${off}`;
      const ids = (await db.$queryRawUnsafe<{ id: string }[]>(sql, ...params)).map(r => r.id);
      const hasMore = ids.length > limit;
      const items = await slimByIds(ids.slice(0, limit));
      return NextResponse.json({
        items,
        nextCursor: hasMore ? `o:${offset + limit}` : null,
        tab,
        tagInfo,
      });
    }

    // ------------------------------ FOR YOU -----------------------------------
    // 1) Decaying tag-affinity profile (+ picked interests as a floor).
    // 2) Rank a BOUNDED candidate pool: newest FORYOU_RECENT_POOL tests plus
    //    the FORYOU_HOT_POOL hottest ones.
    //    score = 3*min(affinity,30) + 2*sqrt(hot rank) + 1.5*freshness + jitter
    // 3) Cache the ranked id list for 90 s; cursor = offset into the pool.
    //    NOT cached for scope='mine': bookmarks change the personal library
    //    instantly, a 90 s stale "empty" list right after bookmarking would
    //    look like the bookmark didn't work.
    // 4) Past the pool → keyset continuation on (createdAt, id), still infinite.
    let poolIds: string[] = [];
    let baseCursor: { createdAt: Date; id: string } | null = null;

    const cacheKey = `${userId || 'anon'}:${scope}:${tag || ''}:${q || ''}:${creatorId || ''}`;
    const cached = scope === 'mine' ? null : foryouCache.get(cacheKey);
    if (cached && Date.now() - cached.rankedAt < FORYOU_TTL_MS) {
      poolIds = cached.ids;
      baseCursor = cached.base;
    } else {
      const [aff, hotIdsRows, u] = await Promise.all([
        userId ? affinityMap(userId) : Promise.resolve(new Map<string, number>()),
        db.$queryRawUnsafe<{ id: string }[]>(`
          SELECT t.id
          FROM "Test" t
          LEFT JOIN (
            SELECT "testId", COUNT(*)::int AS c
            FROM "TestAttempt"
            WHERE "startedAt" > now() - interval '7 days'
            GROUP BY "testId"
          ) a ON a."testId" = t.id
          WHERE t."isPublic" = TRUE
          ORDER BY COALESCE(a.c, 0) DESC, t."createdAt" DESC
          LIMIT ${FORYOU_HOT_POOL}`),
        userId
          ? db.user.findUnique({ where: { id: userId }, select: { interests: true } }).catch(() => null)
          : Promise.resolve(null),
      ]);

      const seedScore = new Map<string, number>(aff);
      for (const it of u?.interests || []) {
        const cur = seedScore.get(it) || 0;
        seedScore.set(it, Math.max(cur, 6));
      }

      // Candidate pool = newest N (index scan on (isPublic, createdAt, id))
      const recentRows = await db.test.findMany({
        where: { AND: filters },
        select: { id: true, tags: true, createdAt: true },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: FORYOU_RECENT_POOL,
      });

      const now = Date.now();
      const hotRank = new Map<string, number>();
      hotIdsRows.forEach((r, i) => hotRank.set(r.id, hotIdsRows.length - i));
      const recentMap = new Map(recentRows.map(r => [r.id, r]));
      // Hot candidates outside the recent pool still need tags/age → slim fetch
      const missingHot = [...hotRank.keys()].filter(id => !recentMap.has(id));
      const extraRows = missingHot.length
        ? await db.test.findMany({
            where: { AND: [...filters, { id: { in: missingHot } }] },
            select: { id: true, tags: true, createdAt: true },
          })
        : [];

      const candidates = [...recentRows, ...extraRows];
      const scored = candidates.map(r => {
        const tags = r.tags || [];
        let affScore = 0;
        for (const t of tags) affScore += seedScore.get(t) || 0;
        const hot = hotRank.get(r.id) || 0;
        const ageDays = Math.max(0, (now - r.createdAt.getTime()) / 86_400_000);
        const freshness = 1 / (1 + ageDays);
        const jitter = Math.random() * 0.35; // exploration — keeps the feed alive
        const score = 3 * Math.min(affScore, 30) + 2 * Math.sqrt(hot) + 1.5 * freshness + jitter;
        return { id: r.id, createdAt: r.createdAt, score };
      });
      scored.sort((a, b) => b.score - a.score || (a.createdAt < b.createdAt ? 1 : -1));
      poolIds = scored.map(s => s.id);
      const lastCandidate = scored[scored.length - 1];
      baseCursor = lastCandidate ? { createdAt: lastCandidate.createdAt, id: lastCandidate.id } : null;
      if (foryouCache.size > 500) foryouCache.clear();
      if (scope !== 'mine') foryouCache.set(cacheKey, { ids: poolIds, rankedAt: Date.now(), base: baseCursor });
    }

    const offset = cursor?.mode === 'offset' ? cursor.offset : 0;
    let pageIds = poolIds.slice(offset, offset + limit);
    let nextCursor: string | null = null;

    if (pageIds.length < limit && baseCursor) {
      // Pool exhausted → keyset continuation below the pool
      const where: any = {
        AND: [
          ...filters,
          {
            OR: [
              { createdAt: { lt: baseCursor.createdAt } },
              { createdAt: baseCursor.createdAt, id: { lt: baseCursor.id } },
            ],
          },
        ],
      };
      const rows = await db.test.findMany({
        where,
        select: { id: true, createdAt: true },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit - pageIds.length,
      });
      pageIds = [...pageIds, ...rows.map(r => r.id)];
      const lastRow = rows[rows.length - 1];
      nextCursor = lastRow ? `${lastRow.createdAt.toISOString()}|${lastRow.id}` : null;
    } else if (pageIds.length === limit && offset + limit < poolIds.length) {
      nextCursor = `o:${offset + limit}`;
    }

    const items = await slimByIds(pageIds);
    return NextResponse.json({ items, nextCursor, tab, tagInfo, personalized: !!userId });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json({ error: 'Failed to load feed' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/feed — lightweight engagement signal for the recommendation engine.
// Body: { testId, kind: 'view' } — sent once per test per session after the
// card stays on screen. start/complete are recorded by the attempts API.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ ok: false });
    const { testId, kind } = await request.json();
    if (kind !== 'view' || !testId) return NextResponse.json({ ok: false });
    const test = await db.test.findUnique({
      where: { id: testId },
      select: { tags: true, isPublic: true, creatorId: true },
    });
    if (!test || (!test.isPublic && test.creatorId !== userId)) {
      return NextResponse.json({ ok: false });
    }
    await bumpAffinity(userId, test.tags || [], 1);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
