'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AttachmentItem, attachmentFileUrl, formatSize, typeIcon } from '@/components/attachment-utils';
import LangButton from '@/components/lang-button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Question, Test } from '@/lib/app-types';
import { countAnsweredProgress, readTestProgress, type SavedTestProgress } from '@/lib/test-progress';
import { ArrowLeft, BookOpen, BookmarkX, ChevronDown, ChevronRight, ClipboardList, Compass, Edit, ExternalLink, FlaskConical, Hash, Home, ImagePlus, LayoutGrid, Library, Link2, ListChecks, Loader2, Minus, Palette, Paperclip, Pencil, Play, Plus, RefreshCw, Rows3, Search, Shuffle, Sparkles, Trash2, TreeDeciduous, Users, X } from 'lucide-react';
const AttachmentsEditor = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsEditor), { ssr: false });
const AttachmentsList = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsList), { ssr: false });
// Version tree — its own on-demand chunk (fetches the family + renders SVG)
const VersionTreeView = dynamic(() => import('@/components/version-tree').then(m => m.default), { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div> });
const PhotoshopColorPicker = dynamic(() => import('@/components/color-picker').then(m => m.PhotoshopColorPicker), { ssr: false });

import type { Page } from '@/lib/app-types';
import { CreatorStrip, TranslatingPill, topicBgClass, tagHash, coverBgFor, imgSrc, GLASS_TILE } from '@/components/shared-bits';
import { testBackgroundCss } from '@/lib/test-bg';
import { useExitMount } from '@/components/motion';
// ---------------------------------------------------------------------------
// Professional feed engine: Swiper (swiper.com — the industry-standard
// carousel/gesture library behind countless TikTok/Reels clones) replaces the
// hand-rolled snap-scroll + attachFeedWheel wheel accumulator. One gesture =
// exactly one full-height card, native-feel touch physics, trackpad/wheel
// support and momentum handling — all maintained upstream instead of here.
// ---------------------------------------------------------------------------
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import type { Lang } from '@/lib/i18n';
import { useSessionStore } from '@/stores/session-store';
import { useProfileStore } from '@/stores/profile-store';
import { useNavStore } from '@/stores/nav-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useEditorStore } from '@/stores/editor-store';
import { useTakeStore } from '@/stores/take-store';
import { tUI } from '@/lib/i18n';

/** Imperative handle the dashboard exposes to app-root for programmatic jumps. */
export interface FeedApi {
  /** Slide the ACTIVE feed (files mode or test feed) to card `idx`. */
  slideTo: (idx: number, speed?: number) => void;
}

/**
 * DASHBOARD screen — TikTok feed / library grid / shelf / files modes, the
 * user-library overlay, the dead-link screen and the CREATE / EDIT test form.
 * Extracted verbatim from src/app/page.tsx; all state stays in page.tsx and
 * is passed via props (list generated mechanically from block usage).
 */
export interface DashboardViewProps {
  tests: Test[];
  bookmarkIds: Set<string>;
  loading: boolean;
  // First load / revalidation-with-empty-list of the ACTIVE feed scope —
  // while true an empty `tests` MUST paint the skeleton, never the
  // "No tests yet" card (the discover scope is uncached right after login,
  // so its first fetch used to flash the empty state for ~a second).
  feedLoading: boolean;
  viewingLoading: boolean;
  fileSlides: any[];
  dashFeedRef: { current: any };
  feedApiRef: { current: FeedApi | null };
  feedSentinelRef: { current: any };
  onDashCommit: (idx: number, mode: 'tests' | 'files' | 'tree') => void;
  jumpToTest: (...args: any[]) => any;
  closeUserLibrary: (...args: any[]) => any;
  closeGridFiles: (...args: any[]) => any;
  closeFilesCard: (...args: any[]) => any;
  backToLibrary: (...args: any[]) => any;
  startCreateTest: (...args: any[]) => any;
  startEditTest: (...args: any[]) => any;
  openFromLibrary: (...args: any[]) => any;
  toggleBookmark: (...args: any[]) => any;
  openUserLibrary: (...args: any[]) => any;
  startFromDashboard: (...args: any[]) => any;
  toggleGridFiles: (...args: any[]) => any;
  // version-tree modes (same contract as the files handlers)
  openTreeCard: (...args: any[]) => any;
  closeTreeCard: (...args: any[]) => any;
  toggleGridTree: (...args: any[]) => any;
  closeGridTree: (...args: any[]) => any;
  doShareLink: (...args: any[]) => any;
  doMakePublic: (...args: any[]) => any;
  handleDeleteTest: (...args: any[]) => any;
  exitFilesMode: (...args: any[]) => any;
  openFilesCard: (...args: any[]) => any;
  cycleDashView: (...args: any[]) => any;
  toggleDiscoverMode: (...args: any[]) => any;
}

export default function DashboardView({
  tests,
  bookmarkIds,
  loading,
  feedLoading,
  viewingLoading,
  fileSlides,
  dashFeedRef,
  feedApiRef,
  feedSentinelRef,
  onDashCommit,
  jumpToTest,
  closeUserLibrary,
  closeGridFiles,
  closeFilesCard,
  backToLibrary,
  startCreateTest,
  startEditTest,
  openFromLibrary,
  toggleBookmark,
  openUserLibrary,
  startFromDashboard,
  toggleGridFiles,
  openTreeCard,
  closeTreeCard,
  toggleGridTree,
  closeGridTree,
  doShareLink,
  doMakePublic,
  handleDeleteTest,
  exitFilesMode,
  openFilesCard,
  cycleDashView,
  toggleDiscoverMode,
}: DashboardViewProps) {
  // ── State: read straight from the zustand domain stores ─────────────────
  // app-root keeps the ACTION handlers (they orchestrate the query cache);
  // the state itself is consumed here directly — no more ~90-prop drilling.
  const sessionUser = useSessionStore(s => s.user);
  const hydratedUser = useSessionStore(s => s.hydratedUser);
  const dataReady = useSessionStore(s => s.dataReady);
  const lang = useSessionStore(s => s.lang);
  const cycleLang = useSessionStore(s => s.cycleLang);
  // app-root only mounts this view when effectivePage === 'dashboard'
  const effectivePage: Page = 'dashboard';
  const effectiveUser = sessionUser || hydratedUser;
  const progressUserId = effectiveUser?.id || 'anon';
  const t = useCallback((key: string, vars?: Record<string, string | number>) => tUI(lang, key, vars), [lang]);
  // Round avatar initials for the dashboard header (same rule as app-root)
  const userInitials = (() => {
    const userName = effectiveUser?.name || effectiveUser?.email || '';
    const parts = userName.trim().split(/\s+/).filter(Boolean);
    const s = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : userName.slice(0, 2);
    return (s || '?').toUpperCase();
  })();
  // profile store
  const myAvatar = useProfileStore(s => s.myAvatar);
  // Saved progress ("Continue Test") for the test on screen — loaded from the
  // DATABASE (async) whenever the visible card changes.
  const [dashSaved, setDashSaved] = useState<SavedTestProgress | null>(null);
  const dashSavedIdRef = useRef<string | null>(null);
  const deadLink = useNavStore(s => s.deadLink);
  const setDeadLink = useNavStore(s => s.setDeadLink);
  const viewingUser = useNavStore(s => s.viewingUser);
  const dashView = useNavStore(s => s.dashView);
  const dashSlideIdx = useNavStore(s => s.dashSlideIdx);
  const gridFilesMode = useNavStore(s => s.gridFilesMode);
  const gridFilesTestId = useNavStore(s => s.gridFilesTestId);
  const filesFeedMode = useNavStore(s => s.filesFeedMode);
  const filesFeedTestId = useNavStore(s => s.filesFeedTestId);
  // version-tree modes
  const treeFeedMode = useNavStore(s => s.treeFeedMode);
  const treeFeedTestId = useNavStore(s => s.treeFeedTestId);
  const gridTreeMode = useNavStore(s => s.gridTreeMode);
  const gridTreeTestId = useNavStore(s => s.gridTreeTestId);
  const deleteId = useNavStore(s => s.deleteId);
  const setDeleteId = useNavStore(s => s.setDeleteId);
  const discoverMode = useNavStore(s => s.discoverMode);
  const setPage = useNavStore(s => s.setPage);
  // dashboard store
  const dashFullTests = useDashboardStore(s => s.dashFullTests);
  const dashTestIdx = useDashboardStore(s => s.dashTestIdx);
  // Saved progress ("Continue Test") for the card on screen — loaded from the
  // DATABASE (SavedProgress table) whenever the visible card changes. The
  // clear-on-switch keeps a stale "Continue N answers" button from ever
  // appearing under a different card while its snapshot is in flight.
  const curDashCardId = tests.length > 0
    ? (tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)]?.id ?? null)
    : null;
  useEffect(() => {
    let alive = true;
    dashSavedIdRef.current = curDashCardId;
    setDashSaved(null);
    if (!curDashCardId) return;
    readTestProgress(progressUserId, curDashCardId).then(p => {
      if (alive && dashSavedIdRef.current === curDashCardId) setDashSaved(p);
    });
    return () => { alive = false; };
  }, [curDashCardId, progressUserId]);
  const setDashTestIdx = useDashboardStore(s => s.setDashTestIdx);
  const libNarrow = useDashboardStore(s => s.libNarrow);
  const dashSearch = useDashboardStore(s => s.dashSearch);
  const setDashSearch = useDashboardStore(s => s.setDashSearch);
  const dashSearchOpen = useDashboardStore(s => s.dashSearchOpen);
  const setDashSearchOpen = useDashboardStore(s => s.setDashSearchOpen);
  const dashSearchResults = useDashboardStore(s => s.dashSearchResults);
  const dashSearching = useDashboardStore(s => s.dashSearching);
  const dashTagInfo = useDashboardStore(s => s.dashTagInfo);
  const shareBusy = useDashboardStore(s => s.shareBusy);
  // editor store
  const editMode = useEditorStore(s => s.editMode);
  const setEditMode = useEditorStore(s => s.setEditMode);
  const questions = useEditorStore(s => s.questions);
  // take store
  const selectedQuestionCount = useTakeStore(s => s.selectedQuestionCount);
  const setSelectedQuestionCount = useTakeStore(s => s.setSelectedQuestionCount);
  const practiceMode = useTakeStore(s => s.practiceMode);
  const setPracticeMode = useTakeStore(s => s.setPracticeMode);
  const startRandomizeQ = useTakeStore(s => s.startRandomizeQ);
  const setStartRandomizeQ = useTakeStore(s => s.setStartRandomizeQ);
  const startRandomizeO = useTakeStore(s => s.startRandomizeO);
  const setStartRandomizeO = useTakeStore(s => s.setStartRandomizeO);
  const shuffledQuestions = useTakeStore(s => s.shuffledQuestions);
  // Search overlay: stays mounted ~150ms after close to play its fade-out
  const searchMounted = useExitMount(dashSearchOpen, 160);

  // ── SWIPER FEED ENGINE (TikTok-web gesture layer) ────────────────────────
  // The one-gesture-one-card wheel accumulator, the snap-scroll container and
  // the settle timers all died with feed-wheel.ts — Swiper owns the gestures
  // now (touch physics, mousewheel, momentum — all upstream-maintained).
  // What lives here: index commits flow out through onDashCommit
  // (onSlideChange), keyboard parity keeps its app-specific guards, and an
  // imperative FeedApi handle lets app-root jump to a card programmatically.
  const onDashCommitRef = React.useRef(onDashCommit);
  onDashCommitRef.current = onDashCommit;
  // Files and tree feed modes are mutually exclusive — at most one of the
  // three swipers below is live at any moment (the others may hold STALE
  // instances of unmounted engines — always check .destroyed).
  const feedCountRef = React.useRef(0);
  feedCountRef.current = filesFeedMode ? fileSlides.length : tests.length;
  const feedIsSwipable = dashView === 'tiktok1' || dashView === 'tiktok2';

  const testsSwiperRef = React.useRef<SwiperClass | null>(null);
  const filesSwiperRef = React.useRef<SwiperClass | null>(null);
  const treeSwiperRef = React.useRef<SwiperClass | null>(null);
  const pendingSlideRef = React.useRef<number | null>(null);
  // The one LIVE swiper of the three (destroyed instances of unmounted feeds
  // must never be driven — slideTo on them would silently target dead DOM).
  const liveFeedSwiper = () => {
    for (const sw of [treeSwiperRef.current, filesSwiperRef.current, testsSwiperRef.current]) {
      if (sw && !sw.destroyed) return sw;
    }
    return null;
  };

  // Shared engine config: one wheel notch / flick = exactly one full-height
  // card, zero rubber-banding between cards, no release-to-edges drift.
  // NO virtual windowing here: every loaded card stays fully mounted (the
  // feed loads in small pages of 12 and appends the next page before the
  // end). Mount/unmount of a heavy card mid-swipe was visibly stuttering the
  // transition, and swiper-react's virtual renderer (renderVirtual)
  // cloneElement-injects its own {top: offset} style onto every SwiperSlide,
  // silently REPLACING the slide's own style prop — the inline coverColor was
  // dropped and cards rendered white. Both regressions came with the Virtual
  // module; the question feed (take-test) keeps virtual slides because a
  // 300-question test cannot mount 300 KaTeX cards.
  const swiperParams = {
    direction: 'vertical' as const,
    modules: [Mousewheel],
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 320,
    resistanceRatio: 0,
    touchReleaseOnEdges: true,
    longSwipesRatio: 0.35,
    mousewheel: { forceToAxis: true, sensitivity: 1, thresholdDelta: 12, thresholdTime: 250, releaseOnEdges: false },
  };

  // Imperative handle for app-root (jump-to-test / deep links / scope resets).
  // Exactly one of the two swipers is mounted at any time — slide the live one.
  React.useEffect(() => {
    feedApiRef.current = {
      slideTo: (idx, speed = 0) => {
        const sw = liveFeedSwiper();
        if (sw) sw.slideTo(Math.max(0, Math.min(idx, (sw.slides?.length || 1) - 1)), speed);
        else pendingSlideRef.current = idx; // feed not mounted yet — apply on init
      },
    };
    return () => { feedApiRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPendingSlide = (sw: SwiperClass) => {
    if (pendingSlideRef.current == null) return;
    const i = pendingSlideRef.current;
    pendingSlideRef.current = null;
    requestAnimationFrame(() => sw.slideTo(Math.max(0, Math.min(i, (sw.slides?.length || 1) - 1)), 0));
  };

  // Wheel gate: events originating inside an inner scrollable (the attached-
  // files list) keep their NATIVE scrolling — stopped here in the capture
  // phase so the Swiper mousewheel engine never sees them.
  const onWheelCapture = (e: React.WheelEvent) => {
    const t = e.target as Element | null;
    if (t?.closest?.('[data-inner-scroll]')) e.stopPropagation();
  };

  // External index changes (jump-to-test, deep link, scope reset) drive the
  // swiper; slide commits flow back through onSlideChange — the equality
  // check makes the loop settle immediately.
  React.useEffect(() => {
    const sw = testsSwiperRef.current;
    if (!sw || filesFeedMode || tests.length === 0) return;
    const target = Math.min(Math.max(0, dashTestIdx), tests.length - 1);
    if (sw.activeIndex !== target) sw.slideTo(target, 0);
  }, [dashTestIdx, tests.length, filesFeedMode]);
  React.useEffect(() => {
    const sw = filesSwiperRef.current;
    if (!sw || sw.destroyed || !filesFeedMode) return;
    const target = Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlides.length - 1));
    if (sw.activeIndex !== target) sw.slideTo(target, 0);
  }, [dashSlideIdx, fileSlides.length, filesFeedMode]);
  React.useEffect(() => {
    const sw = treeSwiperRef.current;
    if (!sw || sw.destroyed || !treeFeedMode) return;
    const target = Math.min(Math.max(0, dashSlideIdx), Math.max(0, tests.length - 1));
    if (sw.activeIndex !== target) sw.slideTo(target, 0);
  }, [dashSlideIdx, tests.length, treeFeedMode]);
  // Appended/removed slides (silent pagination, unpins, deletes) — keep the
  // engine's internal slide bookkeeping in sync.
  React.useEffect(() => { const sw = testsSwiperRef.current; if (sw && !sw.destroyed) sw.update(); }, [tests.length]);
  React.useEffect(() => { const sw = filesSwiperRef.current; if (sw && !sw.destroyed) sw.update(); }, [fileSlides.length]);
  React.useEffect(() => { const sw = treeSwiperRef.current; if (sw && !sw.destroyed) sw.update(); }, [tests.length, treeFeedMode]);

  // Keyboard parity with TikTok web: ↑/↓/PgUp/PgDn/Space step one card,
  // Home/End jump to the first/last one. Ignored while typing or in dialogs.
  React.useEffect(() => {
    if (!feedIsSwipable && !filesFeedMode && !treeFeedMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (deleteId || dashSearchOpen || gridFilesMode || gridTreeMode || editMode) return;
      const tgt = e.target as HTMLElement | null;
      const tag = tgt?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tgt?.isContentEditable) return;
      if (tag === 'BUTTON' && e.key === ' ') return; // space activates the focused button
      let target: number | null = null;
      const sw = filesFeedMode ? filesSwiperRef.current : treeFeedMode ? treeSwiperRef.current : testsSwiperRef.current;
      if (sw && sw.destroyed) return;
      const count = feedCountRef.current;
      if (!sw || count <= 0) return;
      const cur = sw.activeIndex;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') target = Math.min(count - 1, cur + 1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') target = Math.max(0, cur - 1);
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = count - 1;
      else return;
      if (target === cur) return;
      e.preventDefault();
      sw.slideTo(target);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [feedIsSwipable, filesFeedMode, treeFeedMode, deleteId, dashSearchOpen, gridFilesMode, editMode]);

  if (effectivePage === 'dashboard') {
    // Dead share link (?test=<id> of a deleted/removed test): the whole
    // dashboard is replaced by a bare screen — only a message and the way
    // back to the main page, exactly as the share-link promise demands.
    if (deadLink) {
      return (
        <div className="relative h-[100dvh] flex flex-col items-center justify-center bg-background px-6 text-center screen-enter">
          <span className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Link2 className="w-8 h-8 text-destructive" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('deadLinkTitle')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm mb-6">{t('deadLinkDesc')}</p>
          <Button
            onClick={() => {
              try { window.history.replaceState({}, '', window.location.pathname); } catch {}
              setDeadLink(false);
            }}
            className="rounded-full bg-primary hover:bg-primary/90 h-11 px-6"
          >
            <Home className="w-4 h-4 mr-2" /> {t('backHome')}
          </Button>
        </div>
      );
    }
  // CONSTANT CONTENT — every loaded card is fully mounted at all times (the
  // feed loads in small pages of 12 and appends the next page before the
  // end), so a visible card can never be an empty placeholder: nothing can
  // pop in, vanish or re-mount mid-swipe BY CONSTRUCTION. This is the TikTok
  // "already on screen before you get there" guarantee, without any window
  // arithmetic or race conditions.
  const curDashTest = tests.length > 0 ? tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)] : null;
    // Saved progress for the test on screen — dashSaved STATE (loaded from the
    // DB by the effect above) drives the Continue button
    // Library / shelf grids: slice the loaded tests into shelf rows
    // (library = 2 cards per shelf on phones / 3 from sm up, shelf = 1 card per
    // shelf); rows scroll endlessly
    const gridPerRow = dashView === 'shelf' ? 1 : (dashView === 'library' && libNarrow ? 2 : 3);
    const gridColsClass = dashView === 'shelf' ? 'grid-cols-1' : (dashView === 'library' && libNarrow ? 'grid-cols-2' : 'grid-cols-3');
    // Grid files mode: attachments of the ONE test whose paperclip was tapped.
    // If that test has left the loaded list (a mode switch while files mode
    // was on), the cached full payload still covers it.
    const gridFilesTest = gridFilesMode && gridFilesTestId
      ? (tests.find(x => x.id === gridFilesTestId) || (dashFullTests[gridFilesTestId] as Test | undefined) || null)
      : null;
    const gridRows: Test[][] = [];
    for (let i = 0; i < tests.length; i += gridPerRow) gridRows.push(tests.slice(i, i + gridPerRow));
    const gridFiles: AttachmentItem[] = gridFilesTest
      ? (((dashFullTests[gridFilesTest.id]?.attachments ?? gridFilesTest.attachments) || []) as AttachmentItem[]).filter(Boolean)
      : [];
    const gridFileRows: AttachmentItem[][] = [];
    for (let i = 0; i < gridFiles.length; i += gridPerRow) gridFileRows.push(gridFiles.slice(i, i + gridPerRow));
    const searchQ = dashSearch.trim();
    const dashSearchDropdown = searchQ.length < 2 ? null : (
      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-black/10 shadow-xl max-h-72 overflow-y-auto text-left">
        {dashSearching ? (
          <p className="px-3 py-3 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t('loading')}</p>
        ) : (
          <>
            {dashTagInfo && !dashTagInfo.exists && (
              <div className="px-3 py-2.5 border-b border-black/10 bg-muted/40">
                <p className="text-sm font-medium">
                  {t('tagNotFound', { q: dashTagInfo.query })}
                  {dashTagInfo.created ? <span className="text-muted-foreground font-normal"> · {t('tagCreated')}</span> : null}
                </p>
                {(dashTagInfo.similar || []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-xs text-muted-foreground">{t('similarTags')}:</span>
                    {dashTagInfo.similar.map(tg => (
                      <button key={tg} type="button" onClick={() => setDashSearch(tg)} className="text-xs px-2 py-0.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors">
                        {tg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {(dashSearchResults?.length || 0) === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">{t('noResults')}</p>
            ) : (
              (dashSearchResults || []).map(r => (
                <button key={r.id} type="button" onClick={() => jumpToTest(r.id)} className="w-full text-left px-3 py-2.5 hover:bg-muted/50 border-b border-black/5 last:border-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {(r.tags || []).length > 0 && <span className="text-primary font-medium">{(r.tags || []).slice(0, 3).join(' · ')} · </span>}
                    {t('qCount', { n: r._count?.questions || r.questions?.length || 0 })}
                  </p>
                </button>
              ))
            )}
          </>
        )}
      </div>
    );

    // Bottom bar count: the committed card's start count; before the first
    // sync effect adopts the card's total, fall back to that same total so the
    // very first painted frame is ALREADY correct (no 0-count flash).
    const barCount = selectedQuestionCount || (curDashTest ? (curDashTest._count?.questions || curDashTest.questions?.length || 0) : 0);
    return (
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden screen-enter">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          {/* One row on EVERY viewport, no matter how many buttons: the row
              never wraps (flex-nowrap); buttons compress to icon-only pills on
              narrow screens. Search is a button too — when open, its input
              overlay covers the whole row instead of pushing buttons out.
              FIXED h-14: every page's top panel is exactly 56px tall, on every
              viewport, in every state (uniform top-panel contract). */}
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 h-14 flex flex-nowrap items-center justify-between gap-1 sm:gap-2">
            {searchMounted && (
              <div className={`absolute inset-0 z-50 bg-white flex items-center gap-2 px-3 sm:px-4 ${dashSearchOpen ? 'animate-in fade-in duration-150' : 'animate-out fade-out pointer-events-none duration-150'}`}>
                <div className="flex-1 min-w-0 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    autoFocus
                    value={dashSearch}
                    onChange={e => setDashSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Escape') { setDashSearchOpen(false); setDashSearch(''); } }}
                    placeholder={t('searchByTags')}
                    className="h-9 rounded-full pl-9 bg-white border-black/15 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setDashSearchOpen(false); setDashSearch(''); }}
                  className="shrink-0 h-9 w-9 p-0"
                  aria-label={t('cancel')}
                >
                  <X className="w-4 h-4" />
                </Button>
                {dashSearchDropdown}
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
              {/* Universal top-panel back button — shown whenever the dashboard
              is deeper than its home state (files/tree overlays, another
              user's library, the tiktok2 feed). One tap = one level back:
              the deepest overlay closes first, then the context, then the
              view mode — i.e. always the PREVIOUS page. */}
              {(dashView === 'tiktok2' || viewingUser || gridFilesMode || filesFeedMode || gridTreeMode || treeFeedMode) && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // deepest overlay first — the true "previous page"
                    if (gridTreeMode) { closeGridTree(); return; }
                    if (treeFeedMode) { closeTreeCard(); return; }
                    if (gridFilesMode) { closeGridFiles(); return; }
                    if (filesFeedMode) { closeFilesCard(); return; }
                    if (viewingUser) { closeUserLibrary(); return; }
                    backToLibrary();
                  }}
                  className="rounded-full shrink-0 border-black"
                  title={viewingUser ? t('back') : t('backToLibrary')}
                  aria-label={viewingUser ? t('back') : t('backToLibrary')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              {/* Viewing another user's library: just their PHOTO next to the
              back arrow (no name text — the hover/long-press tooltip carries
              the full name). */}
              {viewingUser && (
                <span
                  className="w-8 h-8 rounded-full overflow-hidden bg-cta text-white flex items-center justify-center text-xs font-extrabold shrink-0 ring-2 ring-white shadow-md"
                  title={t('userLibraryTitle', { name: viewingUser.name })}
                >
                  {viewingUser.image
                    ? <img src={viewingUser.image.startsWith('tg:') ? `/api/users/${viewingUser.id}/avatar` : viewingUser.image} alt="" className="w-full h-full object-cover" />
                    : (viewingUser.name || '?').trim().slice(0, 1).toUpperCase() || '?'}
                </span>
              )}
              <Button onClick={startCreateTest} className="rounded-full bg-primary hover:bg-primary/90 shrink-0 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-4">
                <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('createTest')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditMode(v => !v)}
                className={`rounded-full shrink-0 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-4 ${editMode ? 'bg-cta hover:bg-cta/90 text-white border-cta' : 'border-black'}`}
              >
                <Edit className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('editTest')}</span>
              </Button>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
              <Button
                variant="outline"
                onClick={() => setDashSearchOpen(true)}
                className="rounded-full shrink-0 border-black h-8 w-8 p-0 sm:h-9 sm:w-9"
                title={t('searchByTags')}
                aria-label={t('searchByTags')}
              >
                <Search className="w-4 h-4" />
              </Button>
              {/* NO files-mode buttons here on purpose: entering the attached-
              files mode must NOT add anything to the top panel — every files
              surface carries its own «К тестам» / back-to-test control. */}
              {/* View button — cycles the three layouts with one tap (like the
              language button): TikTok feed → Library → Shelf → … The icon and
              the label always show the CURRENT view. */}
              <Button
                variant="outline"
                onClick={cycleDashView}
                className="rounded-full shrink-0 border-black h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-4"
                title={t('viewMode')}
                aria-label={t('viewMode')}
              >
                {dashView === 'library'
                  ? <LayoutGrid className="w-4 h-4 sm:mr-2" />
                  : dashView === 'shelf'
                    ? <Rows3 className="w-4 h-4 sm:mr-2" />
                    : <Play className="w-4 h-4 sm:mr-2" />}
                <span className="hidden sm:inline">
                  {dashView === 'library' ? t('viewLibrary') : dashView === 'shelf' ? t('viewShelf') : t('viewTikTok')}
                </span>
              </Button>
              <LangButton lang={lang} onChange={cycleLang} className="border-black px-2 sm:px-3" />
              <div className="hidden md:block text-right min-w-0">
                <p className="text-sm font-medium truncate max-w-[180px]">{effectiveUser?.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">{effectiveUser?.email}</p>
              </div>
              {/* Content-mode switcher — its own button now (used to live on the
              account avatar): personal library (Library) ↔ Discover (Compass).
              The active mode is highlighted like the Edit toggle. */}
              <Button
                variant="outline"
                onClick={toggleDiscoverMode}
                disabled={loading}
                className={`rounded-full shrink-0 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-4 ${discoverMode ? 'bg-cta hover:bg-cta/90 text-white border-cta' : 'border-black'}`}
                title={discoverMode ? `${t('modeDiscover')} · ${t('modeDiscoverHint')}` : `${t('modeMine')} · ${t('modeMineHint')}`}
                aria-label={discoverMode ? t('modeDiscover') : t('modeMine')}
              >
                {discoverMode
                  ? <Compass className="w-4 h-4 sm:mr-2" />
                  : <Library className="w-4 h-4 sm:mr-2" />}
                <span className="hidden sm:inline">{discoverMode ? t('modeDiscover') : t('modeMine')}</span>
              </Button>
              {/* Account button — opens the PROFILE page (photo, name, the
              test-taking background, logout, account deletion). The avatar
              shows the user's profile photo (Telegram-stored) with the
              initials as the fallback. */}
              <button
                onClick={() => setPage('profile')}
                title={t('profileTitle')}
                aria-label={t('profileTitle')}
                className="relative w-9 h-9 rounded-full bg-cta text-white flex items-center justify-center font-bold text-sm shadow-sm active:scale-95 transition-transform shrink-0 overflow-visible"
              >
                {myAvatar
                  ? <img src={myAvatar} alt="" className="absolute inset-0 w-full h-full rounded-full object-cover" />
                  : userInitials}
              </button>
            </div>
          </div>
        </header>

        {tests.length === 0 && viewingLoading ? (
          <main className="flex-1 min-h-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> {t('loading')}
            </p>
          </main>
        ) : tests.length === 0 && (loading || feedLoading || !dataReady) ? (
          /* FIRST-DATA SKELETON — a stable placeholder shaped like a feed card.
             The server HTML already shows it, so a returning user never sees
             an empty screen, a splash or a "no tests" flash: cached (or fresh)
             data simply replaces the skeleton in place, same center position.
             .skeleton-mirror adds the sweeping light glint (the card reads as
             a mirror plate while the first data loads). */
          <main className="flex-1 min-h-0 flex items-center justify-center px-3" aria-hidden="true">
            {/* Placeholder shaped like a REAL feed card: feed cards are
            CONTENT-height columns (centered TikTok style), so the skeleton
            approximates the typical card height (70%, capped 560px) — when
            data replaces it the card stays visually in place. */}
            <div className="skeleton-mirror w-full max-w-md h-[70%] max-h-[560px] rounded-2xl border border-black/10 bg-white p-4 flex flex-col gap-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="flex-1 w-full rounded-xl" />
              <Skeleton className="h-9 w-2/3 mx-auto rounded-full" />
              <Skeleton className="h-9 w-1/2 mx-auto rounded-full" />
            </div>
          </main>
        ) : tests.length === 0 ? (
          <main className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <Card className="rounded-4xl border-dashed border-black/30 bg-white">
                <CardContent className="py-12 text-center">
                  <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  {viewingUser ? (
                    <>
                      <h3 className="text-lg font-medium mb-2">{t('userLibraryTitle', { name: viewingUser.name })}</h3>
                      <p className="text-muted-foreground">{t('theirLibraryEmpty', { name: viewingUser.name })}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-2">{discoverMode ? t('discoverEmptyTitle') : t('noTestsYet')}</h3>
                      <p className="text-muted-foreground mb-4">{discoverMode ? t('discoverEmptyDesc') : t('createFirst')}</p>
                      {!discoverMode && (
                        <div className="flex gap-3 justify-center">
                          <Button onClick={startCreateTest}><Plus className="w-4 h-4 mr-2" /> {t('createTest')}</Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        ) : (
          <>
            {/* LIBRARY / SHELF views — endless shelves, 3 per screen, scrolling down.
                minHeight (not fixed height): rows never clip their content — with six
                full-name action buttons a row simply grows a bit on short screens. */}
            {dashView === 'library' || dashView === 'shelf' ? (
              <div key={`feed-grid-${dashView}`} ref={dashFeedRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain screen-enter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="max-w-5xl mx-auto h-full">
                  {gridTreeMode ? (
                    /* VERSION-TREE card in the SAME grid layout — the view does
                    not change, only the content does: an endless vertical
                    window of the family trees. Swipe up walks the ancestor
                    trees; past the trunk the window closes itself. */
                    <div className="px-2 sm:px-3 pb-2 sm:pb-3" style={{ height: 'calc(100% - 0px)' }}>
                      <VersionTreeView
                        testId={gridTreeTestId || ''}
                        variant="grid"
                        onClose={closeGridTree}
                      />
                    </div>
                  ) : gridFilesMode ? (
                    /* ATTACHED-FILES cards in the SAME grid layout — the view does not
                    change, only the cards do: one card per attachment of the test whose
                    paperclip was tapped. «К тестам» on a card (or under the empty
                    text) returns to the test cards — the header stays untouched. */
                    gridFiles.length === 0 ? (
                      <div className="px-4 py-6 flex flex-col items-start gap-2">
                        <p className="text-sm text-muted-foreground">{t('filesEmpty')}</p>
                        <Button size="sm" variant="outline"
                          onClick={exitFilesMode}
                          title={t('backToTests')} aria-label={t('backToTests')}
                          className="h-8 rounded-full border-black text-xs px-3"
                        >
                          <ArrowLeft className="size-3.5 shrink-0" /> <span>{t('backToTests')}</span>
                        </Button>
                      </div>
                    ) : (
                      gridFileRows.map((row, ri) => (
                        <div
                          key={ri}
                          className={`grid ${gridColsClass} gap-2 sm:gap-3 px-2 sm:px-3 pb-2 sm:pb-3`}
                          style={{ minHeight: 'max(calc(100% / 3), 20rem)' }}
                        >
                          {row.map((f, ci) => dashView === 'library' ? (
                            <div
                              key={`${f.id || f.url}-${ci}`}
                              role="button"
                              tabIndex={0}
                              onClick={() => window.open(attachmentFileUrl(f), '_blank')}
                              className="h-full min-h-0 flex flex-col rounded-2xl border border-black/15 bg-white p-2 sm:p-3 overflow-hidden cursor-pointer hover:border-black/40 active:scale-[0.99] transition-all text-left"
                            >
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="w-7 h-7 rounded-lg bg-[#FFF0D9] text-cta flex items-center justify-center shrink-0">
                                  {typeIcon(f.type, 'w-4 h-4')}
                                </span>
                                {f.size ? <span className="text-[10px] text-muted-foreground">{formatSize(f.size)}</span> : null}
                              </div>
                              <p className="text-[13px] sm:text-sm font-bold leading-snug line-clamp-2 mt-1">{f.title}</p>
                              <div className="mt-auto pt-1.5 flex flex-col gap-1">
                                <Button size="sm"
                                  onClick={e => { e.stopPropagation(); window.open(attachmentFileUrl(f), '_blank'); }}
                                  title={t('openFile')} aria-label={t('openFile')}
                                  className="h-8 rounded-full text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <ExternalLink className="size-3 shrink-0" /> <span className="truncate">{t('openFile')}</span>
                                </Button>
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); closeGridFiles(); }}
                                  title={t('backToTests')} aria-label={t('backToTests')}
                                  className="h-8 rounded-full border-black text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <ArrowLeft className="size-3 shrink-0" /> <span className="truncate">{t('backToTests')}</span>
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={`${f.id || f.url}-${ci}`}
                              role="button"
                              tabIndex={0}
                              onClick={() => window.open(attachmentFileUrl(f), '_blank')}
                              className="h-full min-h-0 flex rounded-2xl border border-black/15 bg-white overflow-hidden cursor-pointer hover:border-black/40 active:scale-[0.99] transition-all text-left"
                            >
                              <div className="w-20 sm:w-36 shrink-0 h-full flex flex-col items-center justify-center gap-1 p-2 text-center bg-[#FFF0D9]">
                                <span className="text-cta">{typeIcon(f.type, 'w-6 h-6 sm:w-8 sm:h-8')}</span>
                                <span className="text-[10px] sm:text-xs font-semibold uppercase text-cta">{f.type}</span>
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col p-2 sm:p-3">
                                <p className="text-sm sm:text-base font-bold line-clamp-2">{f.title}</p>
                                {f.size ? <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{formatSize(f.size)}</p> : null}
                                <div className="mt-auto pt-1.5 flex flex-col gap-1">
                                  <Button size="sm"
                                    onClick={e => { e.stopPropagation(); window.open(attachmentFileUrl(f), '_blank'); }}
                                    title={t('openFile')} aria-label={t('openFile')}
                                    className="h-8 rounded-full text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <ExternalLink className="size-3 shrink-0" /> <span className="truncate">{t('openFile')}</span>
                                  </Button>
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); closeGridFiles(); }}
                                    title={t('backToTests')} aria-label={t('backToTests')}
                                    className="h-8 rounded-full border-black text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <ArrowLeft className="size-3 shrink-0" /> <span className="truncate">{t('backToTests')}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )
                  ) : (
                    /* TEST cards — every card carries the FULL action set of the TikTok
                    card with its full name, one button per line (never two on one line):
                    Start / Restart / Attached files / Share by link / Share to community /
                    Edit. */
                    gridRows.map((row, ri) => (
                      <div
                        key={ri}
                        className={`grid ${gridColsClass} gap-2 sm:gap-3 px-2 sm:px-3 pb-2 sm:pb-3`}
                        style={{ minHeight: 'max(calc(100% / 3), 20rem)' }}
                      >
                        {row.map((test, ci) => {
                          const idx = ri * gridPerRow + ci;
                          const totalQ = test._count?.questions || test.questions?.length || 0;
                          // "Own" = created by THIS user. Bookmarked tests (saved
                          // via the bookmark button) are NOT own: they show no
                          // share buttons — pressing Edit makes an editable copy.
                          const own = !!effectiveUser && test.creatorId === effectiveUser.id;
                          // Version state on the card: a VERSION (parentId set)
                          // may share its link only after 2+ questions/answers
                          // changed vs its parent — otherwise the button is
                          // PASSIVE and explains the rule. The count comes
                          // from the server (saved at every version save).
                          const isVersion = !!test.parentId;
                          const canShareLink = !isVersion || (test.changedCount ?? 0) >= 2;
                          const fcnt = (dashFullTests[test.id]?.attachments as AttachmentItem[] | undefined)?.length || test._count?.attachments || 0;
                          const bgClass = test.coverColor ? '' : coverBgFor(test);
                          const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                          return dashView === 'library' ? (
                            <div
                              key={test.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => { if (editMode) { startEditTest(test); } else { openFromLibrary(idx); } }}
                              className="h-full min-h-0 flex flex-col rounded-2xl border border-black/15 bg-white p-2 sm:p-3 overflow-hidden cursor-pointer hover:border-black/40 active:scale-[0.99] transition-all text-left"
                            >
                              {/* Discover mode AND other users' libraries: author
                              header + bookmark. The personal library keeps the
                              card clean (you know it's yours). */}
                              {(discoverMode || viewingUser) && !(discoverMode && own) && (
                                <CreatorStrip
                                  compact
                                  name={(test as any).creator?.name || viewingUser?.name || ''}
                                  creatorId={(test as any).creator?.id || test.creatorId}
                                  image={(test as any).creator?.image || viewingUser?.image || null}
                                  bookmarked={bookmarkIds.has(test.id)}
                                  onToggleBookmark={() => toggleBookmark(test)}
                                  addLabel={t('bookmarkAdd')}
                                  removeLabel={t('bookmarkRemove')}
                                  addShort={t('bookmarkAddShort')}
                                  removeShort={t('bookmarkRemoveShort')}
                                  onOpenProfile={() => openUserLibrary({ id: (test as any).creator?.id || test.creatorId, name: (test as any).creator?.name, image: (test as any).creator?.image })}
                                  openLabel={t('openProfile')}
                                />
                              )}
                              <p className="text-[13px] sm:text-sm font-bold leading-snug line-clamp-2">{test.title}</p>
                              {/* Full-name action buttons, one per line. Start resumes
                              saved progress; Restart always begins over; the paperclip
                              flips this grid to the files cards of THIS test. */}
                              <div className="mt-auto pt-1.5 flex flex-col gap-1">
                                <Button size="sm" disabled={loading}
                                  onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(false, test); }}
                                  title={t('startTestBtn')} aria-label={t('startTestBtn')}
                                  className="h-8 rounded-full text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <Play className="size-3 shrink-0" /> <span className="truncate">{t('startTestBtn')}</span>
                                </Button>
                                <Button size="sm" variant="outline" disabled={loading}
                                  onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(true, test); }}
                                  title={t('restart')} aria-label={t('restart')}
                                  className="h-8 rounded-full border-black text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <RefreshCw className="size-3 shrink-0" /> <span className="truncate">{t('restart')}</span>
                                </Button>
                                {fcnt > 0 && (
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); toggleGridFiles(test); }}
                                    title={t('attachedFiles', { n: fcnt })} aria-label={t('attachedFiles', { n: fcnt })}
                                    className={`h-8 rounded-full text-[11px] sm:text-xs px-1.5 justify-start gap-0.5 has-[>svg]:px-1 ${gridFilesMode && gridFilesTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                  >
                                    <Paperclip className="size-3 shrink-0" /> <span className="truncate [@media(max-width:399px)]:text-[9px]">{t('attachedFiles', { n: fcnt })}</span>
                                  </Button>
                                )}
                                {/* Version tree — ALWAYS on every grid card, both
                                views: the grid swaps to the version tree of THIS
                                test (same contract as the paperclip → files) */}
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); toggleGridTree(test); }}
                                  title={t('versionTree')} aria-label={t('versionTree')}
                                  className={`h-8 rounded-full text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1 ${gridTreeMode && gridTreeTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                >
                                  <TreeDeciduous className="size-3 shrink-0" /> <span className="truncate">{t('versionTree')}</span>
                                </Button>
                                {/* Share link — EVERY card (own, bookmarked and
                                discover alike). For versions the button is
                                PASSIVE until 2+ questions/answers changed;
                                the passive state shows the rule text. */}
                                <Button size="sm" variant="outline" disabled={!!shareBusy || !canShareLink}
                                  onClick={e => { e.stopPropagation(); doShareLink(test); }}
                                  title={canShareLink ? t('shareCopySub') : t('shareNeed2Changes')} aria-label={t('shareLinkBtn')}
                                  className="h-8 rounded-full text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <Link2 className="size-3 shrink-0" /> <span className="truncate">{t('shareLinkBtn')}</span>
                                </Button>
                                {!canShareLink && (
                                  <p className="text-[9px] leading-tight text-muted-foreground -mt-0.5">{t('shareNeed2Changes')}</p>
                                )}
                                {/* Make public — OWN from-scratch tests ONLY.
                                A version can never be public, so its card
                                does not carry this button at all. */}
                                {own && !isVersion && (
                                <Button size="sm" variant="outline" disabled={!!shareBusy}
                                  onClick={e => { e.stopPropagation(); doMakePublic(test); }}
                                  title={t('makePublic')} aria-label={t('makePublic')}
                                  className="h-8 rounded-full border-black text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <Users className="size-3 shrink-0" /> <span className="truncate">{t('makePublic')}</span>
                                </Button>
                                )}
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); startEditTest(test); }}
                                  title={t('editTest')} aria-label={t('editTest')}
                                  className="h-8 rounded-full border-black text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <Pencil className="size-3 shrink-0" /> <span className="truncate">{t('editTest')}</span>
                                </Button>
                                {/* Unpin — BOOKMARKED tests in the personal library:
                                the test got here via the bookmark button, this row
                                takes it back out (Discover keeps its own toggle on
                                the author strip). */}
                                {!discoverMode && !viewingUser && !own && bookmarkIds.has(test.id) && (
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); toggleBookmark(test); }}
                                  title={t('unpinBtn')} aria-label={t('unpinBtn')}
                                  className="h-8 rounded-full border-black text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <BookmarkX className="size-3 shrink-0" /> <span className="truncate">{t('unpinBtn')}</span>
                                </Button>
                                )}
                                {/* Delete — own tests only (the server refuses
                                anyone else): the confirm dialog spells out what
                                disappears with the test — library and community
                                entries + the share link. */}
                                {own && (
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); setDeleteId(test.id); }}
                                  title={t('deleteTest')} aria-label={t('deleteTest')}
                                  className="h-8 rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive text-[11px] sm:text-xs px-1.5 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <Trash2 className="size-3 shrink-0" /> <span className="truncate">{t('deleteTest')}</span>
                                </Button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              key={test.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => { if (editMode) { startEditTest(test); } else { openFromLibrary(idx); } }}
                              className="h-full min-h-0 flex rounded-2xl border border-black/15 bg-white overflow-hidden cursor-pointer hover:border-black/40 active:scale-[0.99] transition-all text-left"
                            >
                              <div style={bgStyle} className={`${bgClass} w-20 sm:w-36 shrink-0 h-full flex items-center justify-center p-2 text-center`}>
                                <p className="text-xs sm:text-base font-bold text-cta leading-snug line-clamp-3">{test.title}</p>
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col p-2 sm:p-3">
                                {/* Discover mode AND other users' libraries: author
                                header + bookmark on the shelf card too */}
                                {(discoverMode || viewingUser) && !(discoverMode && own) && (
                                  <CreatorStrip
                                    compact
                                    name={(test as any).creator?.name || viewingUser?.name || ''}
                                    creatorId={(test as any).creator?.id || test.creatorId}
                                    image={(test as any).creator?.image || viewingUser?.image || null}
                                    bookmarked={bookmarkIds.has(test.id)}
                                    onToggleBookmark={() => toggleBookmark(test)}
                                    addLabel={t('bookmarkAdd')}
                                    removeLabel={t('bookmarkRemove')}
                                    addShort={t('bookmarkAddShort')}
                                    removeShort={t('bookmarkRemoveShort')}
                                    onOpenProfile={() => openUserLibrary({ id: (test as any).creator?.id || test.creatorId, name: (test as any).creator?.name, image: (test as any).creator?.image })}
                                    openLabel={t('openProfile')}
                                  />
                                )}
                                {/* Title lives on the spine only — no duplicate text in
                                the content area */}
                                <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">{(test.tags || []).slice(0, 3).join(' · ') || test.topic}</p>
                                <p className="text-[11px] sm:text-xs text-muted-foreground">{t('qCount', { n: totalQ })}</p>
                                {/* Full-name action buttons, one per line — the whole
                                TikTok-card action set on every shelf card */}
                                <div className="mt-auto pt-1.5 flex flex-col gap-1">
                                  <Button size="sm" disabled={loading}
                                    onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(false, test); }}
                                    title={t('startTestBtn')} aria-label={t('startTestBtn')}
                                    className="h-8 rounded-full text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <Play className="size-3 shrink-0" /> <span className="truncate">{t('startTestBtn')}</span>
                                  </Button>
                                  <Button size="sm" variant="outline" disabled={loading}
                                    onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(true, test); }}
                                    title={t('restart')} aria-label={t('restart')}
                                    className="h-8 rounded-full border-black text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <RefreshCw className="size-3 shrink-0" /> <span className="truncate">{t('restart')}</span>
                                  </Button>
                                  {fcnt > 0 && (
                                    <Button size="sm" variant="outline"
                                      onClick={e => { e.stopPropagation(); toggleGridFiles(test); }}
                                      title={t('attachedFiles', { n: fcnt })} aria-label={t('attachedFiles', { n: fcnt })}
                                      className={`h-8 rounded-full text-[11px] sm:text-xs px-2 justify-start ${gridFilesMode && gridFilesTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                    >
                                      <Paperclip className="size-3 shrink-0" /> <span className="truncate">{t('attachedFiles', { n: fcnt })}</span>
                                    </Button>
                                  )}
                                  {/* Version tree — ALWAYS on every shelf card:
                                  the grid swaps to the version tree of THIS test */}
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); toggleGridTree(test); }}
                                    title={t('versionTree')} aria-label={t('versionTree')}
                                    className={`h-8 rounded-full text-[11px] sm:text-xs px-2 justify-start ${gridTreeMode && gridTreeTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                  >
                                    <TreeDeciduous className="size-3 shrink-0" /> <span className="truncate">{t('versionTree')}</span>
                                  </Button>
                                  {/* Share link — EVERY card (own, bookmarked and
                                  discover alike); PASSIVE for versions with
                                  <2 changed questions, the rule text shows
                                  right under the button. */}
                                  <Button size="sm" variant="outline" disabled={!!shareBusy || !canShareLink}
                                    onClick={e => { e.stopPropagation(); doShareLink(test); }}
                                    title={canShareLink ? t('shareCopySub') : t('shareNeed2Changes')} aria-label={t('shareLinkBtn')}
                                    className="h-8 rounded-full text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <Link2 className="size-3 shrink-0" /> <span className="truncate">{t('shareLinkBtn')}</span>
                                  </Button>
                                  {!canShareLink && (
                                    <p className="text-[9px] leading-tight text-muted-foreground -mt-0.5">{t('shareNeed2Changes')}</p>
                                  )}
                                  {/* Make public — OWN from-scratch tests ONLY
                                  (a version can never be public). */}
                                  {own && !isVersion && (
                                  <Button size="sm" variant="outline" disabled={!!shareBusy}
                                    onClick={e => { e.stopPropagation(); doMakePublic(test); }}
                                    title={t('makePublic')} aria-label={t('makePublic')}
                                    className="h-8 rounded-full border-black text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <Users className="size-3 shrink-0" /> <span className="truncate">{t('makePublic')}</span>
                                  </Button>
                                  )}
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); startEditTest(test); }}
                                    title={t('editTest')} aria-label={t('editTest')}
                                    className="h-8 rounded-full border-black text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <Pencil className="size-3 shrink-0" /> <span className="truncate">{t('editTest')}</span>
                                  </Button>
                                  {/* Unpin — bookmarked tests in the personal
                                  library (shelf row): removes the test from the
                                  personal library, same toggle as Discover */}
                                  {!discoverMode && !viewingUser && !own && bookmarkIds.has(test.id) && (
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); toggleBookmark(test); }}
                                    title={t('unpinBtn')} aria-label={t('unpinBtn')}
                                    className="h-8 rounded-full border-black text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <BookmarkX className="size-3 shrink-0" /> <span className="truncate">{t('unpinBtn')}</span>
                                  </Button>
                                  )}
                                  {/* Delete — own tests only, same as the library
                                  card: dialog confirms, then the test leaves the
                                  library, the community and its link dies. */}
                                  {own && (
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); setDeleteId(test.id); }}
                                    title={t('deleteTest')} aria-label={t('deleteTest')}
                                    className="h-8 rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive text-[11px] sm:text-xs px-2 justify-start"
                                  >
                                    <Trash2 className="size-3 shrink-0" /> <span className="truncate">{t('deleteTest')}</span>
                                  </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  {!gridFilesMode && !gridTreeMode && (
                    <div ref={feedSentinelRef} className="h-px w-full shrink-0" aria-hidden="true" />
                  )}
                </div>
              </div>
            ) : treeFeedMode ? (
              /* VERSION-TREE feed — ONE TREE CARD PER TEST, in the feed's
              recommendation order (the SAME engine and slide flow as the
              files feed: every slide carries the test the recommendation
              system put there). Each card is a full version-tree window:
              its INNER swiper walks the ancestor versions and RELEASES the
              gesture at its edges (nested swiper) — swiping up past the
              family trunk lands on the NEXT recommended test's tree, down
              at the root on the previous one. Tapping an apple re-roots
              that card at the tapped version. */
              <div className="flex-1 min-h-0 min-w-0" onWheelCapture={onWheelCapture}>
                <Swiper
                  key="feed-tree-swiper"
                  {...swiperParams}
                  className="feed-swiper h-full screen-enter"
                  initialSlide={Math.min(Math.max(0, dashSlideIdx), Math.max(0, tests.length - 1))}
                  onSwiper={(sw) => { treeSwiperRef.current = sw; applyPendingSlide(sw); }}
                  onSlideChange={(sw) => onDashCommitRef.current(sw.activeIndex, 'tree')}
                >
                  {tests.map((test) => (
                    <SwiperSlide key={test.id} className="!h-full">
                      <div className="h-full w-full px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                        <VersionTreeView
                          testId={test.id}
                          variant="feed"
                          onClose={closeTreeCard}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : filesFeedMode ? (
              /* FILES feed — one attachment per slide; the flow runs through this
              test's files, then continues into the next recommended test's files.
              Header and bottom bar stay untouched; the on-card button returns.
              Engine: Swiper (vertical, one slide per view) — see swiperParams. */
              <div className="flex-1 min-h-0 min-w-0" onWheelCapture={onWheelCapture}>
                <Swiper
                  key="feed-files-swiper"
                  {...swiperParams}
                  className="feed-swiper h-full screen-enter"
                  initialSlide={Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlides.length - 1))}
                  onSwiper={(sw) => { filesSwiperRef.current = sw; applyPendingSlide(sw); }}
                  onSlideChange={(sw) => onDashCommitRef.current(sw.activeIndex, 'files')}
                >
                  {fileSlides.length === 0 ? (
                    <SwiperSlide className="!h-full flex items-center justify-center">
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t('loading')}</p>
                    </SwiperSlide>
                  ) : fileSlides.map((s) => {
                    const test = s.test;
                    const bgClass = test.coverColor ? '' : coverBgFor(test);
                    const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                    return (
                      <SwiperSlide key={`${test.id}`} style={bgStyle} className={`relative !h-full overflow-hidden ${bgClass}`}>
                      <div className="h-full w-full flex flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                        <div className="w-full max-w-md lg:max-w-3xl flex flex-col gap-2.5 sm:gap-4 h-full min-h-0">
                          <div className="shrink-0 rounded-2xl bg-white/80 px-4 py-2.5 text-center">
                            <p className="text-xs font-semibold text-foreground/70 line-clamp-1">{test.title}</p>
                            <p className="text-base sm:text-lg font-bold leading-snug">{t('attachedFiles', { n: s.count })}</p>
                          </div>
                          {/* ALL of the test's files in ONE scrollable card.
                          data-inner-scroll + swiper-no-swiping: the wheel gate
                          lets this area keep its native scrolling and Swiper
                          never starts a drag from inside it. */}
                          <div data-inner-scroll className="swiper-no-swiping flex-1 min-h-0 rounded-2xl border border-black bg-white p-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <AttachmentsList items={s.files} />
                          </div>
                          <button
                            type="button"
                            onClick={closeFilesCard}
                            className="shrink-0 w-full flex items-center gap-1.5 rounded-2xl border-2 border-black bg-white px-3 py-2 sm:py-2.5 text-left hover:bg-muted/50 transition-colors"
                          >
                            <Paperclip className="w-4 h-4 shrink-0 text-cta" />
                            <span className="font-semibold text-sm">{t('attachedFiles', { n: s.count })}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{t('backToTest')}</span>
                          </button>
                          <p className="shrink-0 text-center text-[11px] text-foreground/70">
                            {filesFeedTestId ? t('backToTest') : t('swipeNextTestFiles')}
                          </p>
                        </div>
                      </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            ) : (
            /* TikTok-style vertical feed — swipe up/down between tests.
            Engine: Swiper (vertical, one slide per view) — see swiperParams. */
            <div className="flex-1 min-h-0 min-w-0" onWheelCapture={onWheelCapture}>
              <Swiper
                key="feed-tiktok-swiper"
                {...swiperParams}
                className="feed-swiper h-full screen-enter"
                initialSlide={Math.min(Math.max(0, dashTestIdx), Math.max(0, tests.length - 1))}
                onSwiper={(sw) => { testsSwiperRef.current = sw; applyPendingSlide(sw); }}
                onSlideChange={(sw) => onDashCommitRef.current(sw.activeIndex, 'tests')}
              >
              {tests.map((test, idx) => {
                const isCur = idx === Math.min(dashTestIdx, tests.length - 1);
                const totalQ = test._count?.questions || test.questions?.length || 0;
                // Per-card stable start values: each card shows ITS OWN defaults;
                // the shared start-params bind only to the committed card (isCur).
                // Nothing can flip while the swipe is still moving — and at the
                // settle commit the adopted shared values EQUAL what was already
                // shown on this card, so the counter/highlights never visibly
                // change. Edits (±/slider/toggles) stay meaningful: they happen
                // on the settled card, which is always the committed one.
                const cardCount = Math.max(1, Math.min(isCur ? (selectedQuestionCount || totalQ) : totalQ, Math.max(1, totalQ)));
                const cardRandQ = isCur ? startRandomizeQ : test.randomizeQuestions !== false;
                const cardRandO = isCur ? startRandomizeO : test.randomizeOptions !== false;
                // Own test vs a bookmarked one (saved from Discover): bookmarked
                // tests show no share controls — Edit copies them first.
                const own = !!effectiveUser && test.creatorId === effectiveUser.id;
                // Version state on the card (see the library card): the share
                // link button is PASSIVE until 2+ questions/answers changed.
                const isVersion = !!test.parentId;
                const canShareLink = !isVersion || (test.changedCount ?? 0) >= 2;
                const files = (dashFullTests[test.id]?.attachments ?? test.attachments ?? []) as AttachmentItem[];
                // The attached-files button must NOT pop in a moment later, when
                // the lazy full-test fetch lands: the feed payload already
                // carries the attachment COUNT — use it for the button until
                // the real list arrives. Same fallback the library cards use.
                const filesCount = files.length || test._count?.attachments || 0;
                // Explicitly picked color wins; otherwise derive from the first tag / topic
                const bgClass = test.coverColor ? '' : coverBgFor(test);
                const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                return (
                  // overflow-hidden: the card always fits the screen — no scrolling
                  // inside a card, swipes only move between cards
                  <SwiperSlide key={test.id} style={bgStyle} className={`relative !h-full overflow-hidden ${bgClass}`}>
                    <div className="h-full w-full flex flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                      {/* Desktop: the card breathes — the phone-width column widens
                      on large screens instead of looking like a phone cast onto
                      the monitor. Every control row spans the wider column. */}
                      <div className="w-full max-w-md lg:max-w-3xl flex flex-col gap-2.5 sm:gap-4 min-h-0">
                        {/* Discover mode AND other users' libraries: author header
                        with the bookmark toggle, right above the cover. Personal
                        library stays clean. */}
                        {(discoverMode || viewingUser) && !(discoverMode && own) && (
                          <CreatorStrip
                            name={(test as any).creator?.name || viewingUser?.name || ''}
                            creatorId={(test as any).creator?.id || test.creatorId}
                            image={(test as any).creator?.image || viewingUser?.image || null}
                            bookmarked={bookmarkIds.has(test.id)}
                            onToggleBookmark={() => toggleBookmark(test)}
                            addLabel={t('bookmarkAdd')}
                            removeLabel={t('bookmarkRemove')}
                            addShort={t('bookmarkAddShort')}
                            removeShort={t('bookmarkRemoveShort')}
                            onOpenProfile={() => openUserLibrary({ id: (test as any).creator?.id || test.creatorId, name: (test as any).creator?.name, image: (test as any).creator?.image })}
                            openLabel={t('openProfile')}
                          />
                        )}
                        {/* Cover header — title on the colored band (logo picker removed) */}
                        <div className="relative h-24 min-h-14 shrink sm:h-32 md:h-36 overflow-hidden">
                          <div style={bgStyle} className={`w-full h-full flex flex-col items-center justify-center px-4 text-center ${bgClass}`}>
                            <p className="text-xl sm:text-2xl font-bold text-cta leading-snug line-clamp-2 px-2">{test.title}</p>
                          </div>
                        </div>

                        {isCur && editMode && (
                          <div className="shrink-0 space-y-2 text-center">
                            <p className="text-xs text-muted-foreground">{t('editModeOn')}</p>
                            {test.creatorId === effectiveUser?.id && (
                              <Button size="sm" variant="outline" className="rounded-full border-black text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(test.id)}>
                                <Trash2 className="w-3 h-3 mr-1" /> {t('deleteTest')}
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Controls on every slide — nothing pops in mid-swipe */}
                        {!editMode && (
                          <>
                            {/* Question count — editable counter + slider */}
                            <div className="shrink-0 space-y-2 sm:space-y-3">
                              <div className="flex items-center justify-center gap-4">
                                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSelectedQuestionCount(Math.max(1, cardCount - 1))} disabled={cardCount <= 1}>
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min={1}
                                  max={totalQ}
                                  value={cardCount}
                                  onChange={e => {
                                    if (e.target.value === '') return;
                                    const v = Math.round(Number(e.target.value));
                                    if (Number.isNaN(v)) return;
                                    setSelectedQuestionCount(Math.min(totalQ, Math.max(1, v)));
                                  }}
                                  onBlur={e => { if (e.target.value === '') setSelectedQuestionCount(1); }}
                                  aria-label="Number of questions"
                                  className="text-2xl sm:text-3xl font-bold w-20 text-center bg-white rounded-xl border-2 border-black/10 focus:border-cta outline-none py-0.5 sm:py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSelectedQuestionCount(Math.min(totalQ, cardCount + 1))} disabled={cardCount >= totalQ}>
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="px-4 sm:px-6">
                                <input
                                  type="range"
                                  min={1}
                                  max={totalQ}
                                  value={cardCount}
                                  onChange={e => setSelectedQuestionCount(Number(e.target.value))}
                                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#fe5933]"
                                />
                              </div>
                            </div>

                            {/* Test mode */}
                            <div className="shrink-0 grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setPracticeMode(false)}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                                  !practiceMode
                                    ? 'border-cta bg-[#FFF0D9] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <ListChecks className="w-4 h-4 text-cta" />
                                  <span className="font-semibold text-sm">{t('examMode')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{t('seeResultsEnd')}</p>
                              </button>
                              <button
                                onClick={() => setPracticeMode(true)}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                                  practiceMode
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                  <span className="font-semibold text-sm">{t('practiceMode')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{t('seeAnswerNow')}</p>
                              </button>
                            </div>

                            {/* Randomization — tap a card to toggle, styled like the mode cards */}
                            <div className="shrink-0 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setStartRandomizeQ(v => !v)}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                                  cardRandQ
                                    ? 'border-cta bg-[#FFF0D9] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Shuffle className="w-4 h-4 text-cta shrink-0" />
                                  <span className="font-semibold text-sm">{t('randomizeQuestions')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{cardRandQ ? t('qShuffled') : t('qOriginal')}</p>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStartRandomizeO(v => !v)}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                                  cardRandO
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Shuffle className="w-4 h-4 text-primary shrink-0" />
                                  <span className="font-semibold text-sm">{t('randomizeAnswers')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{cardRandO ? t('aShuffled') : t('aOriginal')}</p>
                              </button>
                            </div>

                            {/* Share link — EVERY feed card (own, bookmarked and
                            discover alike). Both states are visible:
                            active   → tap copies the test link to the clipboard;
                            passive  → (versions with <2 changed questions)
                            disabled, the rule text explains why. */}
                            <button
                              type="button"
                              onClick={() => doShareLink(test)}
                              disabled={!!shareBusy || !canShareLink}
                              className={`shrink-0 w-full flex items-center gap-2 rounded-2xl border-2 px-3 py-2 sm:py-2.5 text-left transition-colors disabled:opacity-60 ${
                                canShareLink ? 'border-black bg-white hover:bg-muted/50' : 'border-black/15 bg-white/60 cursor-not-allowed'
                              }`}
                            >
                              <Link2 className="w-4 h-4 shrink-0 text-cta" />
                              <span className="min-w-0">
                                <span className="block font-semibold text-sm leading-tight">{t('shareLinkBtn')}</span>
                                <span className={`block text-xs leading-snug truncate [@media(max-height:620px)]:hidden ${canShareLink ? 'text-muted-foreground' : 'text-destructive/80'}`}>
                                  {canShareLink ? t('shareCopySub') : t('shareNeed2Changes')}
                                </span>
                              </span>
                            </button>

                            {/* Make public — OWN from-scratch tests ONLY: the
                            flip makes the test visible to the whole community
                            AND copies the link. A version can never be public
                            (server-enforced), so its card never renders this. */}
                            {own && !isVersion && (
                            <button
                              type="button"
                              onClick={() => doMakePublic(test)}
                              disabled={!!shareBusy}
                              className="shrink-0 w-full flex items-center gap-2 rounded-2xl border-2 border-black bg-white px-3 py-2 sm:py-2.5 text-left hover:bg-muted/50 transition-colors disabled:opacity-60"
                            >
                              <Users className="w-4 h-4 shrink-0 text-primary" />
                              <span className="min-w-0">
                                <span className="block font-semibold text-sm leading-tight">{t('makePublic')}</span>
                                <span className="block text-xs leading-snug truncate text-muted-foreground [@media(max-height:620px)]:hidden">{t('shareOptCommunitySub')}</span>
                              </span>
                            </button>
                            )}

                            {/* Unpin — bookmarked tests viewed in the personal
                            feed: the test got here via the bookmark button, this
                            row takes it back out of the personal library */}
                            {!discoverMode && !viewingUser && !own && bookmarkIds.has(test.id) && (
                              <button
                                type="button"
                                onClick={() => toggleBookmark(test)}
                                className="shrink-0 w-full flex items-center gap-1.5 rounded-2xl border-2 border-black bg-white px-3 py-2 sm:py-2.5 text-left hover:bg-muted/50 transition-colors"
                              >
                                <BookmarkX className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-sm">{t('unpinBtn')}</span>
                              </button>
                            )}

                            {/* Delete — own tests only, visible in every view
                            and content mode (an own public test can be deleted
                            straight from Discover too). The confirm dialog
                            explains everything that dies with the test. */}
                            {own && (
                              <button
                                type="button"
                                onClick={() => setDeleteId(test.id)}
                                className="shrink-0 w-full flex items-center gap-1.5 rounded-2xl border-2 border-destructive/50 bg-white px-3 py-2 sm:py-2.5 text-left text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-sm">{t('deleteTest')}</span>
                              </button>
                            )}

                            {/* Attached files — flips the feed to the FILES mode:
                            this test's files in one card; the button (and the
                            header files toggle) returns to this card */}
                            {filesCount > 0 && (
                              <button
                                type="button"
                                onClick={() => { if (filesFeedMode && filesFeedTestId === test.id) closeFilesCard(); else openFilesCard(test); }}
                                className={`shrink-0 w-full flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 sm:py-2.5 text-left transition-colors ${filesFeedMode && filesFeedTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black bg-white hover:bg-muted/50'}`}
                              >
                                <Paperclip className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-sm">{t('attachedFiles', { n: filesCount })}</span>
                                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                              </button>
                            )}

                            {/* Version tree — ALWAYS visible (every test has a
                            tree, even a lonely trunk): flips the feed to the
                            TREE mode for this test, exactly like the files
                            button flips it to the FILES mode. Tapping an apple
                            opens the version created by that user. */}
                            <button
                              type="button"
                              onClick={() => { if (treeFeedMode && treeFeedTestId === test.id) closeTreeCard(); else openTreeCard(test); }}
                              className={`shrink-0 w-full flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 sm:py-2.5 text-left transition-colors ${treeFeedMode && treeFeedTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black bg-white hover:bg-muted/50'}`}
                            >
                              <TreeDeciduous className="w-4 h-4 shrink-0" />
                              <span className="font-semibold text-sm">{t('versionTree')}</span>
                              <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              </Swiper>
            </div>
            )}

            {/* Bottom bar — Start Test for the test on screen. In files mode it
            stays EXACTLY the same (dashTestIdx follows the visible slide's test);
            hidden in the grid views where each card carries its own Start. */}
            {dashView !== 'library' && dashView !== 'shelf' && (
            <div className="shrink-0 z-40 bg-white/90 backdrop-blur-md border-t border-black/10">
              <div
                className="max-w-2xl mx-auto px-4 pt-3"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
              >
                {editMode ? (
                  <Button
                    onClick={() => curDashTest && startEditTest(curDashTest)}
                    className="w-full h-9 rounded-full bg-cta hover:bg-cta/90 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" /> {t('editThisTest')}
                  </Button>
                ) : dashSaved ? (
                  /* SIDE-BY-SIDE (never stacked): the bottom panel keeps its
                  fixed 60px height in EVERY state — Restart | Continue. */
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => startFromDashboard(true)} disabled={loading || !curDashTest} className="flex-1 min-w-0 h-9 rounded-full">
                      <RefreshCw className="w-4 h-4 mr-2 shrink-0" /> <span className="truncate">{t('restart')}</span>
                    </Button>
                    <Button onClick={() => startFromDashboard()} disabled={loading || !curDashTest} className="flex-1 min-w-0 h-9 rounded-full bg-primary hover:bg-primary/90">
                      {loading ? t('loading') : <><Play className="w-4 h-4 mr-2 shrink-0" /> <span className="truncate">{t('continueTest', { n: countAnsweredProgress(dashSaved), m: dashSaved.shuffledQuestions.length })}</span></>}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => startFromDashboard()} disabled={loading || !curDashTest} className="w-full h-9 rounded-full bg-primary hover:bg-primary/90">
                    {loading ? t('loading') : <><Play className="w-4 h-4 mr-2" /> {practiceMode ? t('startPractice', { count: barCount }) : t('startTestN', { count: barCount })}</>}
                  </Button>
                )}
              </div>
            </div>
            )}
          </>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('deleteTestQ')}</AlertDialogTitle>
              <AlertDialogDescription>{t('deleteWarning')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDeleteTest(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('delete')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

}
