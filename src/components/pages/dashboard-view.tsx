'use client';

import React from 'react';
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
import { countAnsweredProgress, readTestProgress } from '@/lib/test-progress';
import { ArrowLeft, BookOpen, BookmarkX, ChevronDown, ChevronRight, ClipboardList, Compass, Edit, ExternalLink, FlaskConical, Hash, Home, ImagePlus, LayoutGrid, Library, Link2, ListChecks, Loader2, Minus, Palette, Paperclip, Pencil, Play, Plus, RefreshCw, Rows3, Search, Shuffle, Sparkles, Trash2, Users, X } from 'lucide-react';
const AttachmentsEditor = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsEditor), { ssr: false });
const AttachmentsList = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsList), { ssr: false });
const PhotoshopColorPicker = dynamic(() => import('@/components/color-picker').then(m => m.PhotoshopColorPicker), { ssr: false });

import type { Page } from '@/lib/app-types';
import { CreatorStrip, TranslatingPill, topicBgClass, tagHash, coverBgFor, imgSrc, GLASS_TILE } from '@/components/shared-bits';
import { testBackgroundCss } from '@/lib/test-bg';
import { useExitMount } from '@/components/motion';
import { attachFeedWheel } from '@/lib/feed-wheel';
import type { Lang } from '@/lib/i18n';

/**
 * DASHBOARD screen — TikTok feed / library grid / shelf / files modes, the
 * user-library overlay, the dead-link screen and the CREATE / EDIT test form.
 * Extracted verbatim from src/app/page.tsx; all state stays in page.tsx and
 * is passed via props (list generated mechanically from block usage).
 */
export interface DashboardViewProps {
  dashFullTests: Record<string, Test>;
  bookmarkIds: Set<string>;
  shareScopeByTest: Record<string, 'link' | 'community'>;
  setShareScopeByTest: React.Dispatch<React.SetStateAction<Record<string, 'link' | 'community'>>>;
  effectivePage: Page;
  page: Page;
  deadLink: boolean;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setDeadLink: React.Dispatch<React.SetStateAction<boolean>>;
  tests: Test[];
  dashTestIdx: number;
  dashLiveIdx: number;
  dashSlideIdx: number;
  progressUserId: string;
  dashView: 'tiktok1' | 'tiktok2' | 'library' | 'shelf';
  libNarrow: boolean;
  gridFilesMode: boolean;
  gridFilesTestId: string | null;
  dashSearch: string;
  dashSearching: boolean;
  loading: boolean;
  dataReady: boolean;
  dashTagInfo: { query: string; exists: boolean; created: boolean; similar: string[] } | null;
  setDashSearch: React.Dispatch<React.SetStateAction<string>>;
  dashSearchResults: Test[] | null;
  jumpToTest: (...args: any[]) => any;
  questions: Question[];
  dashSearchOpen: boolean;
  setDashSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewingUser: { id: string; name: string; image: string | null } | null;
  closeUserLibrary: (...args: any[]) => any;
  closeGridFiles: (...args: any[]) => any;
  filesFeedMode: boolean;
  closeFilesCard: (...args: any[]) => any;
  backToLibrary: (...args: any[]) => any;
  user: { id: string; email: string; name: string } | null;
  name: string;
  startCreateTest: (...args: any[]) => any;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  cycleDashView: (...args: any[]) => any;
  lang: Lang;
  cycleLang: (...args: any[]) => any;
  effectiveUser: { id: string; email: string; name: string } | null;
  email: string;
  toggleDiscoverMode: (...args: any[]) => any;
  discoverMode: boolean;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
  myAvatar: string | null;
  userInitials: string;
  viewingLoading: boolean;
  dashFeedRef: { current: any };
  exitFilesMode: (...args: any[]) => any;
  startEditTest: (...args: any[]) => any;
  openFromLibrary: (...args: any[]) => any;
  toggleBookmark: (...args: any[]) => any;
  openUserLibrary: (...args: any[]) => any;
  setDashTestIdx: React.Dispatch<React.SetStateAction<number>>;
  startFromDashboard: (...args: any[]) => any;
  toggleGridFiles: (...args: any[]) => any;
  shareBusy: boolean;
  doShare: (...args: any[]) => any;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  feedSentinelRef: { current: any };
  onDashScroll: (...args: any[]) => any;
  onDashTouchStart: (...args: any[]) => any;
  onDashTouchEnd: (...args: any[]) => any;
  onDashWheel: (...args: any[]) => any;
  onDashProgrammatic: (...args: any[]) => any;
  fileSlides: any[];
  filesFeedTestId: string | null;
  setSelectedQuestionCount: React.Dispatch<React.SetStateAction<number>>;
  selectedQuestionCount: number;
  setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
  practiceMode: boolean;
  setStartRandomizeQ: React.Dispatch<React.SetStateAction<boolean>>;
  startRandomizeQ: boolean;
  setStartRandomizeO: React.Dispatch<React.SetStateAction<boolean>>;
  startRandomizeO: boolean;
  openFilesCard: (...args: any[]) => any;
  shuffledQuestions: Question[];
  deleteId: string | null;
  handleDeleteTest: (...args: any[]) => any;
  editorBody: React.ReactNode;
  setEditorInfoExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  editorInfoExpanded: boolean;
  testTitle: string;
  setTestTitle: React.Dispatch<React.SetStateAction<string>>;
  testTags: string[];
  removeTag: (...args: any[]) => any;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  setTagsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
  addTag: (...args: any[]) => any;
  setTestTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagsOpen: boolean;
  tagSuggestions: string[];
  testDescription: string;
  setTestDescription: React.Dispatch<React.SetStateAction<string>>;
  setTestIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  testIsPublic: boolean;
  setEditorFilesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  formAttachments: AttachmentItem[];
  editorFilesExpanded: boolean;
  setFormAttachments: React.Dispatch<React.SetStateAction<AttachmentItem[]>>;
  setEditorCoverExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  editorCoverExpanded: boolean;
  setTestCoverColor: React.Dispatch<React.SetStateAction<string>>;
  testCoverColor: string;
  setEditorQuestionsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  editorQuestionsExpanded: boolean;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  addQuestion: (...args: any[]) => any;
  removeQuestion: (...args: any[]) => any;
  updateQuestion: (...args: any[]) => any;
  photoBusy: string;
  pickQuestionPhoto: (...args: any[]) => any;
  clearQuestionPhoto: (...args: any[]) => any;
  pickOptionPhoto: (...args: any[]) => any;
  clearOptionPhoto: (...args: any[]) => any;
}

export default function DashboardView({
  effectivePage,
  dashFullTests,
  bookmarkIds,
  shareScopeByTest,
  setShareScopeByTest,
  page,
  deadLink,
  t,
  setDeadLink,
  tests,
  dashTestIdx,
  dashLiveIdx,
  dashSlideIdx,
  progressUserId,
  dashView,
  libNarrow,
  gridFilesMode,
  gridFilesTestId,
  dashSearch,
  dashSearching,
  loading,
  dataReady,
  dashTagInfo,
  setDashSearch,
  dashSearchResults,
  jumpToTest,
  questions,
  dashSearchOpen,
  setDashSearchOpen,
  viewingUser,
  closeUserLibrary,
  closeGridFiles,
  filesFeedMode,
  closeFilesCard,
  backToLibrary,
  user,
  name,
  startCreateTest,
  setEditMode,
  editMode,
  cycleDashView,
  lang,
  cycleLang,
  effectiveUser,
  email,
  toggleDiscoverMode,
  discoverMode,
  setPage,
  myAvatar,
  userInitials,
  viewingLoading,
  dashFeedRef,
  exitFilesMode,
  startEditTest,
  openFromLibrary,
  toggleBookmark,
  openUserLibrary,
  setDashTestIdx,
  startFromDashboard,
  toggleGridFiles,
  shareBusy,
  doShare,
  setDeleteId,
  feedSentinelRef,
  onDashScroll,
  onDashTouchStart,
  onDashTouchEnd,
  onDashWheel,
  onDashProgrammatic,
  fileSlides,
  filesFeedTestId,
  setSelectedQuestionCount,
  selectedQuestionCount,
  setPracticeMode,
  practiceMode,
  setStartRandomizeQ,
  startRandomizeQ,
  setStartRandomizeO,
  startRandomizeO,
  openFilesCard,
  shuffledQuestions,
  deleteId,
  handleDeleteTest,
  editorBody,
  setEditorInfoExpanded,
  editorInfoExpanded,
  testTitle,
  setTestTitle,
  testTags,
  removeTag,
  tagInput,
  setTagInput,
  setTagsOpen,
  setAllTags,
  addTag,
  setTestTags,
  tagsOpen,
  tagSuggestions,
  testDescription,
  setTestDescription,
  setTestIsPublic,
  testIsPublic,
  setEditorFilesExpanded,
  formAttachments,
  editorFilesExpanded,
  setFormAttachments,
  setEditorCoverExpanded,
  editorCoverExpanded,
  setTestCoverColor,
  testCoverColor,
  setEditorQuestionsExpanded,
  editorQuestionsExpanded,
  setQuestions,
  addQuestion,
  removeQuestion,
  updateQuestion,
  photoBusy,
  pickQuestionPhoto,
  clearQuestionPhoto,
  pickOptionPhoto,
  clearOptionPhoto,
}: DashboardViewProps) {
  // Search overlay: stays mounted ~150ms after close to play its fade-out
  const searchMounted = useExitMount(dashSearchOpen, 160);

  // ── TIKTOK-WEB GESTURE LAYER ────────────────────────────────────────────
  // Latest-handler refs: the wheel/keyboard effects attach ONCE per feed
  // element and always call the freshest handlers — re-attaching on every
  // parent re-render would reset the wheel accumulator mid-gesture.
  const gestureRef = React.useRef({ onDashProgrammatic });
  gestureRef.current = { onDashProgrammatic };
  const feedCountRef = React.useRef(0);
  feedCountRef.current = filesFeedMode ? fileSlides.length : tests.length;
  const feedIsSwipable = dashView === 'tiktok1' || dashView === 'tiktok2';

  // Track the REAL feed DOM node: the effects must re-attach whenever the
  // feed element instance changes (skeleton → feed, view switches, mode
  // flips) — a one-shot attach on mount ran while the feed was still a
  // skeleton and the ref was null, so the wheel engine never engaged.
  const [feedNode, setFeedNode] = React.useState<HTMLElement | null>(null);
  const composeFeedRef = React.useCallback((el: HTMLElement | null) => {
    (dashFeedRef as any).current = el;
    setFeedNode(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One wheel gesture = exactly one card (the signature TikTok desktop feel;
  // native half-card wheel + snap-back is gone). Touch scrolling stays native.
  React.useEffect(() => {
    if (!feedIsSwipable || !feedNode) return;
    return attachFeedWheel(feedNode, {
      getCardCount: () => feedCountRef.current,
      isInnerScrollTarget: tgt => tgt instanceof Element && !!tgt.closest('[data-inner-scroll]'),
      onStep: () => gestureRef.current.onDashProgrammatic(1), // guard only — commits re-arm from the animation's scroll events
    });
  }, [feedIsSwipable, filesFeedMode, feedNode]);

  // Keyboard parity with TikTok web: ↑/↓/PgUp/PgDn/Space step one card,
  // Home/End jump to the first/last one. Ignored while typing or in dialogs.
  React.useEffect(() => {
    if (!feedIsSwipable) return;
    const onKey = (e: KeyboardEvent) => {
      if (deleteId || dashSearchOpen || gridFilesMode || editMode) return;
      const tgt = e.target as HTMLElement | null;
      const tag = tgt?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tgt?.isContentEditable) return;
      if (tag === 'BUTTON' && e.key === ' ') return; // space activates the focused button
      let target: number | null = null;
      const el = dashFeedRef.current as HTMLElement | null;
      if (!el || el.clientHeight === 0) return;
      const count = feedCountRef.current;
      if (count <= 0) return;
      const cur = Math.round(el.scrollTop / el.clientHeight);
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') target = Math.min(count - 1, cur + 1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') target = Math.max(0, cur - 1);
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = count - 1;
      else return;
      if (target === cur) return;
      e.preventDefault();
      // Guard only (scaled by distance) — the animation's scroll events arm
      // the commit, which then lands 140ms after the scroll truly ends.
      gestureRef.current.onDashProgrammatic(Math.abs(target - cur));
      el.scrollTo({ top: target * el.clientHeight, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [feedIsSwipable, deleteId, dashSearchOpen, gridFilesMode, editMode, dashFeedRef]);

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
    const fileSlidesCount = fileSlides.length;
  // MONOTONIC RENDER SET — once a card has rendered its content it NEVER
  // reverts to a placeholder: scrolling back shows exactly what was there
  // before (no re-mount pop-in), and fast flicks can never flash an empty
  // card that was already on screen. Ref (not state): the windowed-render
  // anchors drive re-renders; the set only WIDENS what stays mounted.
  const everShownRef = React.useRef<Set<string>>(new Set());
  // LIVE anchor — read the REAL scroll position of the mounted feed during
  // render. Scroll handlers only TRIGGER a re-render; the render then reads
  // the fresh position, so the rendered window can never lag behind reality —
  // even after an instant (non-smooth) wheel jump that lands several cards
  // away in a single frame. Before the feed mounts, fall back to the
  // state-tracked index from app-root.
  const liveFeedEl = dashFeedRef.current as HTMLDivElement | null;
  const liveIdx = liveFeedEl && liveFeedEl.clientHeight > 0
    ? Math.round(liveFeedEl.scrollTop / liveFeedEl.clientHeight)
    : dashLiveIdx;
  // Mark everything currently inside the ±2 union window as shown (both feeds
  // share this logic, so it runs before the branches below).
  {
    const a1 = Math.min(Math.max(0, liveIdx), Math.max(0, tests.length - 1));
    const a2 = Math.min(Math.max(0, dashTestIdx), Math.max(0, tests.length - 1));
    for (const a of new Set([a1, a2])) {
      for (let d = -2; d <= 2; d++) {
        const i = a + d;
        if (i >= 0 && i < tests.length) everShownRef.current.add(tests[i].id);
      }
    }
    const s1 = Math.min(Math.max(0, liveIdx), Math.max(0, fileSlidesCount - 1));
    const s2 = Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlidesCount - 1));
    for (const a of new Set([s1, s2])) {
      for (let d = -2; d <= 2; d++) {
        const i = a + d;
        if (i >= 0 && i < fileSlidesCount) everShownRef.current.add(fileSlides[i].test.id);
      }
    }
  }
  const curDashTest = tests.length > 0 ? tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)] : null;
    // Saved progress for the test on screen (cached read) — drives the Continue button
    const dashSaved = curDashTest ? readTestProgress(progressUserId, curDashTest.id) : null;
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

    return (
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden screen-enter">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          {/* One row on EVERY viewport, no matter how many buttons: the row
              never wraps (flex-nowrap); buttons compress to icon-only pills on
              narrow screens. Search is a button too — when open, its input
              overlay covers the whole row instead of pushing buttons out. */}
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-nowrap items-center justify-between gap-1 sm:gap-2">
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
              {(dashView === 'tiktok2' || viewingUser) && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (viewingUser) { closeUserLibrary(); return; }
                    if (gridFilesMode) { closeGridFiles(); return; }
                    if (filesFeedMode) { closeFilesCard(); return; }
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
        ) : tests.length === 0 && (loading || !dataReady) ? (
          /* FIRST-DATA SKELETON — a stable placeholder shaped like a feed card.
             The server HTML already shows it, so a returning user never sees
             an empty screen, a splash or a "no tests" flash: cached (or fresh)
             data simply replaces the skeleton in place, same center position. */
          <main className="flex-1 min-h-0 flex items-center justify-center px-3" aria-hidden="true">
            <div className="w-full max-w-md h-[70%] max-h-[560px] rounded-2xl border border-black/10 bg-white p-4 flex flex-col gap-3">
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
                  {gridFilesMode ? (
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
                          style={{ minHeight: 'calc(100% / 3)' }}
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
                                  className="h-7 rounded-full text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <ExternalLink className="size-3 shrink-0" /> <span className="truncate">{t('openFile')}</span>
                                </Button>
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); closeGridFiles(); }}
                                  title={t('backToTests')} aria-label={t('backToTests')}
                                  className="h-7 rounded-full border-black text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
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
                                    className="h-7 rounded-full text-xs sm:text-sm px-2 justify-start"
                                  >
                                    <ExternalLink className="size-3 shrink-0" /> <span className="truncate">{t('openFile')}</span>
                                  </Button>
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); closeGridFiles(); }}
                                    title={t('backToTests')} aria-label={t('backToTests')}
                                    className="h-7 rounded-full border-black text-xs sm:text-sm px-2 justify-start"
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
                        style={{ minHeight: 'calc(100% / 3)' }}
                      >
                        {row.map((test, ci) => {
                          const idx = ri * gridPerRow + ci;
                          const totalQ = test._count?.questions || test.questions?.length || 0;
                          // "Own" = created by THIS user. Bookmarked tests (saved
                          // via the bookmark button) are NOT own: they show no
                          // share buttons — pressing Edit makes an editable copy.
                          const own = !!effectiveUser && test.creatorId === effectiveUser.id;
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
                              {(discoverMode || viewingUser) && (
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
                              <p className="text-[13px] sm:text-sm font-bold leading-snug line-clamp-2">{test.title}</p>
                              {/* Full-name action buttons, one per line. Start resumes
                              saved progress; Restart always begins over; the paperclip
                              flips this grid to the files cards of THIS test. */}
                              <div className="mt-auto pt-1.5 flex flex-col gap-1">
                                <Button size="sm" disabled={loading}
                                  onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(false, test); }}
                                  title={t('startTestBtn')} aria-label={t('startTestBtn')}
                                  className="h-7 rounded-full text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <Play className="size-3 shrink-0" /> <span className="truncate">{t('startTestBtn')}</span>
                                </Button>
                                <Button size="sm" variant="outline" disabled={loading}
                                  onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(true, test); }}
                                  title={t('restart')} aria-label={t('restart')}
                                  className="h-7 rounded-full border-black text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
                                >
                                  <RefreshCw className="size-3 shrink-0" /> <span className="truncate">{t('restart')}</span>
                                </Button>
                                {fcnt > 0 && (
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); toggleGridFiles(test); }}
                                    title={t('attachedFiles', { n: fcnt })} aria-label={t('attachedFiles', { n: fcnt })}
                                    className={`h-7 rounded-full text-[10px] sm:text-xs px-1 justify-start gap-0.5 has-[>svg]:px-1 ${gridFilesMode && gridFilesTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                  >
                                    <Paperclip className="size-3 shrink-0" /> <span className="truncate [@media(max-width:399px)]:text-[9px]">{t('attachedFiles', { n: fcnt })}</span>
                                  </Button>
                                )}
                                {/* Share buttons — OWN tests only. Bookmarked tests
                                are read-only references: Edit makes a copy first. */}
                                {!discoverMode && own && (
                                <Button size="sm" variant="outline" disabled={!!shareBusy}
                                  onClick={e => { e.stopPropagation(); setShareScopeByTest(prev => ({ ...prev, [test.id]: 'link' })); doShare(test, 'link'); }}
                                  title={t('shareOptLink')} aria-label={t('shareOptLink')}
                                  className={`h-7 rounded-full text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1 ${(shareScopeByTest[test.id] || (test.isPublic === false ? 'link' : 'community')) === 'link' ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                >
                                  <Link2 className="size-3 shrink-0" /> <span className="truncate">{t('shareOptLink')}</span>
                                </Button>
                                )}
                                {!discoverMode && own && (
                                <Button size="sm" variant="outline" disabled={!!shareBusy}
                                  onClick={e => { e.stopPropagation(); setShareScopeByTest(prev => ({ ...prev, [test.id]: 'community' })); doShare(test, 'community'); }}
                                  title={t('shareOptCommunity')} aria-label={t('shareOptCommunity')}
                                  className={`h-7 rounded-full text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1 ${(shareScopeByTest[test.id] || (test.isPublic === false ? 'link' : 'community')) === 'community' ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                >
                                  <Users className="size-3 shrink-0" /> <span className="truncate">{t('shareOptCommunity')}</span>
                                </Button>
                                )}
                                <Button size="sm" variant="outline"
                                  onClick={e => { e.stopPropagation(); startEditTest(test); }}
                                  title={t('editTest')} aria-label={t('editTest')}
                                  className="h-7 rounded-full border-black text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
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
                                  className="h-7 rounded-full border-black text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
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
                                  className="h-7 rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1"
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
                                {(discoverMode || viewingUser) && (
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
                                    className="h-7 rounded-full text-xs sm:text-sm px-2 justify-start"
                                  >
                                    <Play className="size-3 shrink-0" /> <span className="truncate">{t('startTestBtn')}</span>
                                  </Button>
                                  <Button size="sm" variant="outline" disabled={loading}
                                    onClick={e => { e.stopPropagation(); setDashTestIdx(idx); startFromDashboard(true, test); }}
                                    title={t('restart')} aria-label={t('restart')}
                                    className="h-7 rounded-full border-black text-xs sm:text-sm px-2 justify-start"
                                  >
                                    <RefreshCw className="size-3 shrink-0" /> <span className="truncate">{t('restart')}</span>
                                  </Button>
                                  {fcnt > 0 && (
                                    <Button size="sm" variant="outline"
                                      onClick={e => { e.stopPropagation(); toggleGridFiles(test); }}
                                      title={t('attachedFiles', { n: fcnt })} aria-label={t('attachedFiles', { n: fcnt })}
                                      className={`h-7 rounded-full text-xs sm:text-sm px-2 justify-start ${gridFilesMode && gridFilesTestId === test.id ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                    >
                                      <Paperclip className="size-3 shrink-0" /> <span className="truncate">{t('attachedFiles', { n: fcnt })}</span>
                                    </Button>
                                  )}
                                  {/* Share buttons — OWN tests only (bookmarked tests
                                  get an editable copy via Edit first) */}
                                  {!discoverMode && own && (
                                  <Button size="sm" variant="outline" disabled={!!shareBusy}
                                    onClick={e => { e.stopPropagation(); setShareScopeByTest(prev => ({ ...prev, [test.id]: 'link' })); doShare(test, 'link'); }}
                                    title={t('shareOptLink')} aria-label={t('shareOptLink')}
                                    className={`h-7 rounded-full text-xs sm:text-sm px-2 justify-start ${(shareScopeByTest[test.id] || (test.isPublic === false ? 'link' : 'community')) === 'link' ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                  >
                                    <Link2 className="size-3 shrink-0" /> <span className="truncate">{t('shareOptLink')}</span>
                                  </Button>
                                  )}
                                  {!discoverMode && own && (
                                  <Button size="sm" variant="outline" disabled={!!shareBusy}
                                    onClick={e => { e.stopPropagation(); setShareScopeByTest(prev => ({ ...prev, [test.id]: 'community' })); doShare(test, 'community'); }}
                                    title={t('shareOptCommunity')} aria-label={t('shareOptCommunity')}
                                    className={`h-7 rounded-full text-xs sm:text-sm px-2 justify-start ${(shareScopeByTest[test.id] || (test.isPublic === false ? 'link' : 'community')) === 'community' ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                  >
                                    <Users className="size-3 shrink-0" /> <span className="truncate">{t('shareOptCommunity')}</span>
                                  </Button>
                                  )}
                                  <Button size="sm" variant="outline"
                                    onClick={e => { e.stopPropagation(); startEditTest(test); }}
                                    title={t('editTest')} aria-label={t('editTest')}
                                    className="h-7 rounded-full border-black text-xs sm:text-sm px-2 justify-start"
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
                                    className="h-7 rounded-full border-black text-xs sm:text-sm px-2 justify-start"
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
                                    className="h-7 rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs sm:text-sm px-2 justify-start"
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
                  {!gridFilesMode && (
                    <div ref={feedSentinelRef} className="h-px w-full shrink-0" aria-hidden="true" />
                  )}
                </div>
              </div>
            ) : filesFeedMode ? (
              /* FILES feed — one attachment per slide; the flow runs through this
              test's files, then continues into the next recommended test's files.
              Header and bottom bar stay untouched; the on-card button returns. */
              <div
                key="feed-files"
                ref={composeFeedRef}
                onScroll={onDashScroll}
                onTouchStart={onDashTouchStart}
                onTouchMove={onDashTouchStart}
                onTouchEnd={onDashTouchEnd}
                onTouchCancel={onDashTouchEnd}
                className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory overscroll-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden screen-enter"
              >
                {fileSlides.length === 0 ? (
                  <section className="h-full snap-start snap-always flex items-center justify-center">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t('loading')}</p>
                  </section>
                ) : fileSlides.map((s, i) => {
                  const test = s.test;
                  const bgClass = test.coverColor ? '' : coverBgFor(test);
                  const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                  // WINDOWED RENDER: only slides within ±2 of the visible one
                  // mount their content; distant slides keep the exact same
                  // height and background, so scroll geometry never changes and
                  // nothing pops in mid-swipe (replaces content-visibility).
                  // Anchor = the LIVE visible slide (tracked from scroll events)
                  // UNION the committed dashSlideIdx — the slide under the
                  // viewport therefore ALWAYS renders its content, whatever the
                  // settle-commit timing does.
                  const near =
                    Math.abs(i - Math.min(Math.max(0, liveIdx), Math.max(0, fileSlides.length - 1))) <= 2 ||
                    Math.abs(i - Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlides.length - 1))) <= 2;
                  if (near) everShownRef.current.add(test.id);
                  const show = near || everShownRef.current.has(test.id);
                  return (
                    <section key={`${test.id}`} style={bgStyle} className={`relative h-full snap-start snap-always overflow-hidden ${bgClass}`}>
                      {show && (
                      <div className="h-full w-full flex flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                        <div className="w-full max-w-md flex flex-col gap-2.5 sm:gap-4 h-full min-h-0">
                          <div className="shrink-0 rounded-2xl bg-white/80 px-4 py-2.5 text-center">
                            <p className="text-xs font-semibold text-foreground/70 line-clamp-1">{test.title}</p>
                            <p className="text-base sm:text-lg font-bold leading-snug">{t('attachedFiles', { n: s.count })}</p>
                          </div>
                          {/* ALL of the test's files in ONE scrollable card.
                          data-inner-scroll: the wheel engine lets this area
                          keep its native scrolling. */}
                          <div data-inner-scroll className="flex-1 min-h-0 rounded-2xl border border-black bg-white p-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                      )}
                    </section>
                  );
                })}
                <div ref={feedSentinelRef} className="h-px w-full shrink-0" aria-hidden="true" />
              </div>
            ) : (
            /* TikTok-style vertical feed — swipe up/down between tests */
            <div
              key="feed-tiktok"
              ref={composeFeedRef}
              onScroll={onDashScroll}
              onTouchStart={onDashTouchStart}
              onTouchMove={onDashTouchStart}
              onTouchEnd={onDashTouchEnd}
              onTouchCancel={onDashTouchEnd}
              className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory overscroll-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden screen-enter"
            >
              {tests.map((test, idx) => {
                const isCur = idx === Math.min(dashTestIdx, tests.length - 1);
                // WINDOWED RENDER (same as the files feed): cards beyond ±2 of
                // the current slide render as same-height, same-background
                // placeholders — with hundreds of tests the DOM stays light.
                // Anchor = the LIVE visible card (tracked from scroll events)
                // UNION the committed dashTestIdx, so the card the user is
                // LOOKING at ALWAYS has its buttons and texts rendered — a
                // dropped/delayed settle commit can never blank the screen.
                const near =
                  Math.abs(idx - Math.min(Math.max(0, liveIdx), tests.length - 1)) <= 2 ||
                  Math.abs(idx - Math.min(Math.max(0, dashTestIdx), tests.length - 1)) <= 2;
                if (near) everShownRef.current.add(test.id);
                const show = near || everShownRef.current.has(test.id);
                const totalQ = test._count?.questions || test.questions?.length || 0;
                // Own test vs a bookmarked one (saved from Discover): bookmarked
                // tests show no share controls — Edit copies them first.
                const own = !!effectiveUser && test.creatorId === effectiveUser.id;
                const files = (dashFullTests[test.id]?.attachments ?? test.attachments ?? []) as AttachmentItem[];
                // The attached-files button must NOT pop in a moment later, when
                // the lazy full-test fetch lands: the feed payload already
                // carries the attachment COUNT — use it for the button until
                // the real list arrives. Same fallback the library cards use.
                const filesCount = files.length || test._count?.attachments || 0;
                // Publication variant SAVED with the test drives the share selector's
                // initial highlight; a share tap re-highlights the last used option
                const savedScope: 'link' | 'community' = test.isPublic === false ? 'link' : 'community';
                const activeScope = shareScopeByTest[test.id] || savedScope;
                // Explicitly picked color wins; otherwise derive from the first tag / topic
                const bgClass = test.coverColor ? '' : coverBgFor(test);
                const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                return (
                  // overflow-hidden: the card always fits the screen — no scrolling
                  // inside a card, swipes only move between cards
                  <section key={test.id} style={bgStyle} className={`relative h-full snap-start snap-always overflow-hidden ${bgClass}`}>
                    {show && (
                    <div className="h-full w-full flex flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                      <div className="w-full max-w-md flex flex-col gap-2.5 sm:gap-4 min-h-0">
                        {/* Discover mode AND other users' libraries: author header
                        with the bookmark toggle, right above the cover. Personal
                        library stays clean. */}
                        {(discoverMode || viewingUser) && (
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
                                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSelectedQuestionCount(Math.max(1, selectedQuestionCount - 1))} disabled={selectedQuestionCount <= 1}>
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min={1}
                                  max={totalQ}
                                  value={selectedQuestionCount}
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
                                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSelectedQuestionCount(Math.min(totalQ, selectedQuestionCount + 1))} disabled={selectedQuestionCount >= totalQ}>
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="px-4 sm:px-6">
                                <input
                                  type="range"
                                  min={1}
                                  max={totalQ}
                                  value={selectedQuestionCount}
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
                                  startRandomizeQ
                                    ? 'border-cta bg-[#FFF0D9] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Shuffle className="w-4 h-4 text-cta shrink-0" />
                                  <span className="font-semibold text-sm">{t('randomizeQuestions')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{startRandomizeQ ? t('qShuffled') : t('qOriginal')}</p>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStartRandomizeO(v => !v)}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                                  startRandomizeO
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Shuffle className="w-4 h-4 text-primary shrink-0" />
                                  <span className="font-semibold text-sm">{t('randomizeAnswers')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{startRandomizeO ? t('aShuffled') : t('aOriginal')}</p>
                              </button>
                            </div>

                            {/* Share — radio-style scope selector: the chosen option
                            lights up red (like the randomize cards) and the share
                            fires for this test; only one option can be lit.
                            Discover mode and BOOKMARKED tests hide it: others'
                            tests are browsed, not published — Edit copies first. */}
                            {!discoverMode && own && (
                            <div className="shrink-0 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => { setShareScopeByTest(prev => ({ ...prev, [test.id]: 'link' })); doShare(test, 'link'); }}
                                disabled={!!shareBusy}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left disabled:opacity-60 ${
                                  activeScope === 'link'
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Link2 className="w-4 h-4 text-cta shrink-0" />
                                  <span className="font-semibold text-sm">{t('shareOptLink')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{t('shareOptLinkSub')}</p>
                              </button>
                              <button
                                type="button"
                                onClick={() => { setShareScopeByTest(prev => ({ ...prev, [test.id]: 'community' })); doShare(test, 'community'); }}
                                disabled={!!shareBusy}
                                className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left disabled:opacity-60 ${
                                  activeScope === 'community'
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Users className="w-4 h-4 text-primary shrink-0" />
                                  <span className="font-semibold text-sm">{t('shareOptCommunity')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground [@media(max-height:620px)]:hidden">{t('shareOptCommunitySub')}</p>
                              </button>
                            </div>
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
                          </>
                        )}
                      </div>
                    </div>
                    )}
                  </section>
                );
              })}

              {/* Invisible pagination sentinel — silently appends more tests */}
              <div ref={feedSentinelRef} className="h-px w-full shrink-0" aria-hidden="true" />
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
                    className="w-full rounded-full bg-cta hover:bg-cta/90 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" /> {t('editThisTest')}
                  </Button>
                ) : dashSaved ? (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => startFromDashboard(true)} disabled={loading || !curDashTest} className="w-full rounded-full">
                      <RefreshCw className="w-4 h-4 mr-2" /> {t('restart')}
                    </Button>
                    <Button onClick={() => startFromDashboard()} disabled={loading || !curDashTest} className="w-full rounded-full bg-primary hover:bg-primary/90">
                      {loading ? t('loading') : <><Play className="w-4 h-4 mr-2" /> {t('continueTest', { n: countAnsweredProgress(dashSaved), m: dashSaved.shuffledQuestions.length })}</>}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => startFromDashboard()} disabled={loading || !curDashTest} className="w-full rounded-full bg-primary hover:bg-primary/90">
                    {loading ? t('loading') : <><Play className="w-4 h-4 mr-2" /> {practiceMode ? t('startPractice', { count: selectedQuestionCount }) : t('startTestN', { count: selectedQuestionCount })}</>}
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
