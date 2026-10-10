'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { api, setUser, getUser } from '@/lib/api';
import { autoTranslateQuestions, QTranslationsV } from '@/lib/qtrans';
import MathText from '@/components/math-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
// ---------------------------------------------------------------------------
// Perf: heavy, on-demand modules are loaded via next/dynamic so the initial
// bundle (First Load JS) stays small. Only the screens that actually open the
// attachments editor, a chat panel or the cover-color picker download them.
// Types + tiny helpers (AttachmentItem, typeIcon, attachmentFileUrl, formatSize)
// live in the lightweight attachment-utils module and stay static imports.
// ---------------------------------------------------------------------------
import { typeIcon, attachmentFileUrl, formatSize, type AttachmentItem } from '@/components/attachment-utils';
const AttachmentsEditor = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsEditor), { ssr: false });
const AttachmentsList = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsList), { ssr: false });
const AttachmentsBottomSheet = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsBottomSheet), { ssr: false });
const AttachmentsSidePanel = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsSidePanel), { ssr: false });
import { SheetHeaderSwitcher } from '@/components/sheet-switcher';
import type { AiThreadMeta } from '@/components/chat-panels';
const AiChatPanel = dynamic(() => import('@/components/chat-panels').then(m => m.AiChatPanel), { ssr: false, loading: () => <SheetLoadingPlaceholder /> });
const GroupChatPanel = dynamic(() => import('@/components/chat-panels').then(m => m.GroupChatPanel), { ssr: false, loading: () => <SheetLoadingPlaceholder /> });
import { ResizableSheetFrame } from '@/components/resize-sheet';
import { Collapse } from '@/components/motion';
import {
  LogIn,
  Plus,
  Trash2,
  Edit,
  Play,
  Shuffle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  BookOpen,
  FlaskConical,
  Home,
  RefreshCw,
  GraduationCap,
  Clock,
  Minus,
  ListChecks,
  MessageSquare,
  Sparkles,
  Paperclip,
  Pencil,
  Users,
  ChevronDown,
  ChevronRight,
  X,
  Hash,
  Palette,
  Languages,
  Search,
  ClipboardList,
  Loader2,
  Link2,
  LayoutGrid,
  Library,
  Rows3,
  ExternalLink,
  Compass,
  BookmarkPlus,
  BookmarkCheck,
  BookmarkX,
  ImagePlus,
  Camera,
  LogOut,
} from 'lucide-react';
const PhotoshopColorPicker = dynamic(() => import('@/components/color-picker').then(m => m.PhotoshopColorPicker), { ssr: false });
import type { Page, Question, Attachment, Test, GroupMessage, Attempt } from '@/lib/app-types';
import { testBackgroundCss } from '@/lib/test-bg';
import AuthView from '@/components/pages/auth-view';
import ProfileView from '@/components/pages/profile-view';
import HistoryView from '@/components/pages/history-view';
import StartTestView from '@/components/pages/start-test-view';
import TakeTestView from '@/components/pages/take-test-view';
import DashboardView from '@/components/pages/dashboard-view';
import CreateEditView from '@/components/pages/create-edit-view';
import LangButton from '@/components/lang-button';
import { CreatorStrip, TranslatingPill, topicBgClass, tagHash, coverBgFor, imgSrc, GLASS_TILE } from '@/components/shared-bits';
import { readTestProgress, writeTestProgress, clearTestProgress, countAnsweredProgress, type SavedTestProgress } from '@/lib/test-progress';
import { Lang, NEXT_LANG, LANG_LABEL, tUI, trText, trOption, trExpl } from '@/lib/i18n';

// Tiny neutral placeholder shown while a lazily-loaded bottom-sheet panel
// (chat / attachments) is downloading its chunk — keeps the sheet frame sized.
function SheetLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full min-h-[240px]">
      <div className="animate-pulse text-neutral-400 text-sm">…</div>
    </div>
  );
}

// localStorage key for the interface language (EN -> RU -> UZ cycle button)
const LANG_STORAGE_KEY = 'chemtest-lang';

// Stale-while-revalidate boot cache: the last feed page + bookmarks + attempts
// are persisted after every successful load, so a returning user's dashboard
// paints INSTANTLY from the cache while the network refresh swaps in fresh data.
const FEED_CACHE_KEY = 'chemtest_cache_feed_v1';
const ATTEMPTS_CACHE_KEY = 'chemtest_cache_attempts_v1';







// Per-test group chat message (see /api/tests/[id]/chat)
// Shuffle utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleOptions(question: Question): Question {
  const optionKeys: string[] = ['A', 'B', 'C', 'D'];
  const optionE = question.optionE;
  if (optionE) optionKeys.push('E');

  const options = optionKeys.map(key => ({
    key,
    value: key === 'E' ? optionE! : question[`option${key}` as keyof Question] as string,
    img: question.optionImages?.[key] || null, // photo travels WITH its answer text
  }));

  const shuffled = shuffleArray(options);
  const newQ: any = { ...question };
  const keyMap: Record<string, string> = {};

  shuffled.forEach((opt, idx) => {
    const newKey = optionKeys[idx];
    newQ[`option${newKey}`] = opt.value;
    keyMap[opt.key] = newKey;
  });

  newQ.correctAnswer = keyMap[question.correctAnswer] || question.correctAnswer;

  // Per-option photos follow their option text; absent photos leave null slots
  if (question.optionImages && Object.keys(question.optionImages).length) {
    const remapped: Record<string, { u: string; m?: number | null }> = {};
    shuffled.forEach((opt, idx) => {
      if (opt.img) remapped[optionKeys[idx]] = opt.img;
    });
    newQ.optionImages = remapped;
  }

  // Stored interface-language translations must follow the SAME shuffle,
  // otherwise ru/uz users see translated texts pinned to the old letters while
  // the correct-answer badge (and every option photo) moved on.
  if (question.translations && typeof question.translations === 'object') {
    const t: any = { ...question.translations };
    for (const lg of Object.keys(t)) {
      const opts = t[lg]?.options;
      if (opts && typeof opts === 'object') {
        const remappedOpts: Record<string, string> = {};
        shuffled.forEach((opt, idx) => {
          const v = opts[opt.key];
          if (v) remappedOpts[optionKeys[idx]] = v;
        });
        t[lg] = { ...t[lg], options: remappedOpts };
      }
    }
    newQ.translations = t;
  }

  return newQ as Question;
}

// Resolve a stored photo reference to a browser-visible src:
//   data:...  → used as-is (small fallback uploads)
//   tg:<id>   → streamed from the Telegram channel via /api/tgimg/<id>
//   otherwise → external URL, used as-is

// Downscale a picked photo in the browser (max 1600px, JPEG) so uploads stay
// small and pages stay fast even with big phone-camera pictures.
async function compressImage(file: File, maxSide = 1600, quality = 0.85): Promise<Blob> {
  try {
    if (typeof document === 'undefined') return file;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale >= 1 && file.size < 900 * 1024) return file; // already small enough
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
    const blob: Blob | null = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    return blob && blob.size > 0 && blob.size < file.size ? blob : file;
  } catch {
    return file; // any decode hiccup — upload the original bytes
  }
}

// Frosted-glass tile shared by the take-test bottom bar: the lens over the
// current question number AND the prev/next arrow buttons use the SAME material
// (same border, gradient and shadows), so the whole bar reads as one glass set.

// =================== SAVED TEST PROGRESS ("Continue Test") ===================
// Saved test progress helpers (readTestProgress / writeTestProgress /
// clearTestProgress / countAnsweredProgress) live in src/lib/test-progress.ts.

export default function ChemTestApp() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);

  // --- Personalized recommendation feed ("under the hood") ---
  // The dashboard looks exactly like before, but invisibly it is powered by
  // /api/feed: tag-affinity ranking (views / starts / completions / time spent
  // / difficult tests), keyset pagination and silent infinite append, so the
  // list stays fast at any test volume and surfaces what the user cares about.
  const [feedHasMore, setFeedHasMore] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  // Dashboard CONTENT MODE — toggled by the account button (like the language
  // button cycles): personal library (own tests + bookmarks) ↔ discover (public
  // tests of other authors). Session-only: reload returns to the library.
  const [discoverMode, setDiscoverMode] = useState(false);
  // Mirrors discoverMode for callbacks with stale closures (feed loaders)
  const discoverModeRef = useRef(false);
  // Test ids saved into my personal library via the bookmark button
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(new Set());
  // My profile photo (served by /api/users/[id]/avatar) + its tiny uploader
  const [myAvatar, setMyAvatar] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // --- Profile page state ---
  // Test-taking background preset key ('' = standard); loaded once per session
  // from GET /api/me together with the editable display name.
  const [myBgStyle, setMyBgStyle] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [accBusy, setAccBusy] = useState(false);
  const [deleteAccOpen, setDeleteAccOpen] = useState(false);
  // Per-card share scope selection: exactly one of the two share buttons on a
  // card can be highlighted at a time (radio behaviour, like the mode cards).
  const [shareScopeByTest, setShareScopeByTest] = useState<Record<string, 'link' | 'community'>>({});
  // Files feed mode: the TikTok feed flips from one-slide-per-test to the
  // files card(s). When filesFeedTestId is set the feed shows THAT test's
  // files (per-test files mode); null keeps the legacy flattened flow.
  // Header and bottom bar stay untouched; the paperclip button toggles back.
  const [filesFeedMode, setFilesFeedMode] = useState(false);
  const [filesFeedTestId, setFilesFeedTestId] = useState<string | null>(null);
  const filesFeedModeRef = useRef(false);
  useEffect(() => { filesFeedModeRef.current = filesFeedMode; }, [filesFeedMode]);
  // Grid files mode (Library/Shelf): the grid KEEPS its layout but swaps the
  // test cards for the attachment cards of ONE test (the one whose paperclip
  // was tapped). The header back arrow / files toggle returns to the test cards.
  const [gridFilesMode, setGridFilesMode] = useState(false);
  const [gridFilesTestId, setGridFilesTestId] = useState<string | null>(null);
  // Another user's library (opened from their profile photo or a chat avatar):
  // the dashboard shows THEIR public tests; every card carries their name and
  // photo; the header back arrow returns to the viewer's own feed.
  const [viewingUser, setViewingUser] = useState<{ id: string; name: string; image: string | null } | null>(null);
  const [viewingLoading, setViewingLoading] = useState(false);
  const viewingUserRef = useRef(false);
  useEffect(() => { viewingUserRef.current = !!viewingUser; }, [viewingUser]);
  const [dashSlideIdx, setDashSlideIdx] = useState(0);
  // Dashboard header search: searches tests server-side (/api/feed?q=) by
  // TAGS with a dropdown. Hidden behind a search BUTTON; tapping it opens an
  // input overlay that covers the whole header row until dismissed (X / Esc /
  // test chosen) — same pattern as the take-test search.
  const [dashSearch, setDashSearch] = useState('');
  const [dashSearchOpen, setDashSearchOpen] = useState(false);
  const [dashSearchResults, setDashSearchResults] = useState<Test[] | null>(null);
  // Tag dictionary feedback for the current search: whether the exact tag
  // exists, whether we just created it, and similar tags to offer instead.
  const [dashTagInfo, setDashTagInfo] = useState<{ query: string; exists: boolean; created: boolean; similar: string[] } | null>(null);
  const [dashSearching, setDashSearching] = useState(false);
  // Take-test header search: filters the questions of the running test.
  // Hidden behind a search BUTTON; tapping it opens an input overlay that
  // covers the whole header row until dismissed (X / Esc / question chosen).
  const [qSearch, setQSearch] = useState('');
  const [qSearchOpen, setQSearchOpen] = useState(false);
  // Results-page header search: filters the review questions after finishing a test.
  const [resSearch, setResSearch] = useState('');
  const [resHighlightIdx, setResHighlightIdx] = useState<number | null>(null);
  const feedCursorRef = useRef<string | null>(null);
  const feedHasMoreRef = useRef(false);
  const feedLoadingMoreRef = useRef(false);
  const feedReqIdRef = useRef(0);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const viewSignaledRef = useRef<Set<string>>(new Set());
  const feedSentinelRef = useRef<HTMLDivElement | null>(null);
  const sharedTestHandledRef = useRef(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  // Auth - always start with null/auth, hydrate on mount
  const [user, setUserState] = useState<{ id: string; email: string; name: string } | null>(null);
  const [page, setPage] = useState<Page>('auth');

  // Mount guard to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Boot splash: while the stored session and initial data restore on reload,
  // show a branded loading screen instead of the auth / empty dashboard flash
  const [booting, setBooting] = useState(true);
  // true while the post-boot background refresh is still fetching the first
  // real data (only when the localStorage cache had nothing to paint)
  const [bootRefreshing, setBootRefreshing] = useState(false);

  // Interface language (en/ru/uz) — cycles with the header button, persisted
  const [lang, setLang] = useState<Lang>('en');
  const cycleLang = useCallback(() => {
    setLang(prev => {
      const next = NEXT_LANG[prev];
      try { localStorage.setItem(LANG_STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);
  const t = useCallback((key: string, vars?: Record<string, string | number>) => tUI(lang, key, vars), [lang]);

  // On-the-fly question translation (see lib/qtrans): questions without a
  // stored translation for the selected language are machine-translated while
  // the test is being taken / reviewed, cached in localStorage and persisted
  // to the DB best-effort. `autoTranslating` drives the small progress pill.
  const [autoTranslating, setAutoTranslating] = useState(false);
  const trGenRef = useRef(0);
  const trTriedRef = useRef<Set<string>>(new Set());

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Test creation state
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  // Tags (replace the old topic field): chips + autocomplete from the global tag dictionary
  const [testTags, setTestTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  // Cover customization (create / edit test): '' = auto (derived from tags/topic)
  const [testCoverIcon, setTestCoverIcon] = useState('');
  const [testCoverColor, setTestCoverColor] = useState('');
  const [randomizeQ, setRandomizeQ] = useState(true);
  const [randomizeO, setRandomizeO] = useState(true);
  // Randomization chosen at test START (Start Test page), not in the editor
  const [startRandomizeQ, setStartRandomizeQ] = useState(true);
  const [startRandomizeO, setStartRandomizeO] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' },
  ]);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  // Dashboard "Edit Test" mode: when ON, clicking a test opens it in the editor
  const [editMode, setEditMode] = useState(false);

  // Attachments editor state (create / edit test)
  const [formAttachments, setFormAttachments] = useState<AttachmentItem[]>([]);
  // Publication variant of the test — saved WITH the test and applies to the
  // test AND its attached files: false = only people with the link can open,
  // true = the whole community sees it in their feed. Edited in the
  // "Test Information" section of the editor, same option-card style as the
  // share selector on the test card.
  const [testIsPublic, setTestIsPublic] = useState(true);
  // Attached Files collapse in the editor — same behavior as on the test card
  const [editorFilesExpanded, setEditorFilesExpanded] = useState(false);
  // All editor sections start collapsed — the page opens as a compact list of one-line cards
  const [editorInfoExpanded, setEditorInfoExpanded] = useState(false);
  const [editorCoverExpanded, setEditorCoverExpanded] = useState(false);
  const [editorQuestionsExpanded, setEditorQuestionsExpanded] = useState(false);

  // Test taking state
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  // Start Test: attached files section — collapsed to one line by default, expandable via arrow
  const [startFilesExpanded, setStartFilesExpanded] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState(false);

  // Take-test bottom drum: one-line question strip + tap-to-type jump
  const [drumInputMode, setDrumInputMode] = useState(false);
  // The number input is UNCONTROLLED (read via ref on submit): typing must not
  // re-render the take-test tree — a controlled value re-rendered EVERY question
  // slide (KaTeX-heavy) on each keystroke, which made typing feel slow/buggy.
  const numInputRef = React.useRef<HTMLInputElement>(null);
  const drumRef = React.useRef<HTMLDivElement>(null);
  const drumScaleRafRef = React.useRef(0);
  const drumProgrammaticRef = React.useRef(0);
  const drumSettleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Magnifier-style drum: pills shrink and fade with distance from the center ("under glass")
  const applyDrumScales = React.useCallback(() => {
    const c = drumRef.current;
    if (!c || c.clientWidth === 0) return;
    const mid = c.getBoundingClientRect().left + c.clientWidth / 2;
    const radius = Math.max(110, c.clientWidth * 0.3);
    for (const cell of Array.from(c.children) as HTMLElement[]) {
      const el = (cell.firstElementChild as HTMLElement) || cell;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - mid);
      const t = Math.max(0, 1 - (dist / radius) ** 2); // 1 at the center, 0 at the falloff radius
      el.style.transform = `scale(${(0.5 + 0.5 * t).toFixed(3)})`;
      el.style.opacity = (0.25 + 0.75 * t).toFixed(3);
    }
  }, []);

  // Stable ref: apply the magnification right after the drum mounts
  const drumRefCb = React.useCallback((el: HTMLDivElement | null) => {
    drumRef.current = el;
    if (el) requestAnimationFrame(() => applyDrumScales());
  }, [applyDrumScales]);

  // Keep the current question pill centered in the drum (under the glass)
  useEffect(() => {
    const c = drumRef.current;
    if (!c) return;
    const el = c.querySelector<HTMLElement>('[data-current="true"]');
    if (el) {
      const target = el.offsetLeft - (c.clientWidth - el.offsetWidth) / 2;
      if (Math.abs(c.scrollLeft - target) > 2) {
        drumProgrammaticRef.current = Date.now();
        c.scrollTo({ left: target, behavior: 'smooth' });
      }
    }
    applyDrumScales();
  }, [currentQuestionIdx, drumInputMode, applyDrumScales]);

  // Take-test vertical feed of question cards (TikTok-style) + its scroll position.
  // takeFeedTouchUntilRef: timestamp until which the feed counts as actively
  // manipulated (finger down / wheel spinning) — the sync effect must never
  // fight an in-progress gesture, and the swipe commit waits for a settle.
  const takeFeedRef = React.useRef<HTMLDivElement>(null);
  const takeFeedTouchUntilRef = React.useRef(0);
  const takeFeedSettleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync the feed when the current question changes from the drum / arrows.
  // Skipped while the user is actively touching/scrolling the feed — an instant
  // scroll during a swipe would yank the card out from under the finger.
  // Also re-runs when the drum number input opens/closes: the on-screen keyboard
  // changes the visible geometry, so the feed must re-snap after it closes.
  useEffect(() => {
    const el = takeFeedRef.current;
    if (!el || el.clientHeight === 0) return;
    if (Date.now() < takeFeedTouchUntilRef.current) return;
    if (Math.abs(el.scrollTop - currentQuestionIdx * el.clientHeight) > 2) {
      el.scrollTo({ top: currentQuestionIdx * el.clientHeight, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentQuestionIdx, shuffledQuestions.length, drumInputMode]);

  // When the drum number input closes, the keyboard that opened for it may leave
  // the window scrolled up (the page shifts and a white gap stays below it).
  // Restore the window position immediately and again after the keyboard-close
  // animation settles.
  const prevDrumInputModeRef = React.useRef(false);
  useEffect(() => {
    if (prevDrumInputModeRef.current && !drumInputMode) {
      const restore = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      restore();
      const t = setTimeout(restore, 350);
      prevDrumInputModeRef.current = drumInputMode;
      return () => clearTimeout(t);
    }
    prevDrumInputModeRef.current = drumInputMode;
  }, [drumInputMode]);

  // AI Chat state — ONE SEPARATE conversation per test. Threads persist in
  // localStorage (per user) and are listed in the ☰ history drawer of the
  // chat window; opening the chat on a test resumes THAT test's thread.
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatQuestionId, setChatQuestionId] = useState<string>('');
  const [chatUserAnswer, setChatUserAnswer] = useState<string>('');
  const [chatQuestionObj, setChatQuestionObj] = useState<Question | null>(null);
  const [chatThreadId, setChatThreadId] = useState<string>(''); // test id whose thread is in chatMessages
  const [chatThreads, setChatThreads] = useState<Record<string, { title: string; messages: { role: 'user' | 'assistant'; content: string }[]; updatedAt: number }>>({});
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const chatThreadsLoadedRef = useRef(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Attached files panel (take test)
  const [filesOpen, setFilesOpen] = useState(false);

  // Per-test group chat (everyone taking the same test)
  const [groupOpen, setGroupOpen] = useState(false);
  // Take-test "Edit Test" bottom sheet (opens the shared editor over the taking screen)
  const [editOpen, setEditOpen] = useState(false);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [groupInput, setGroupInput] = useState('');
  const [groupSending, setGroupSending] = useState(false);
  const groupEndRef = React.useRef<HTMLDivElement>(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // Dead share link: the ?test=<id> target was deleted (or unshared) — the
  // dashboard is replaced by a bare "test unavailable" screen with a single
  // way back to the main page.
  const [deadLink, setDeadLink] = useState(false);

  // Read user from localStorage only after mount (prevents hydration mismatch)
  const [hydratedUser, setHydratedUser] = useState<{ id: string; email: string; name: string } | null>(null);
  // "Initial data loaded" guard — shared by the boot restore and the dashboard effect
  const hasLoadedRef = React.useRef(false);
  useEffect(() => {
    // Restore the interface language (or detect it from the browser on first visit)
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'ru' || saved === 'uz' || saved === 'en') {
        setLang(saved);
      } else {
        const nav = (navigator.language || '').toLowerCase();
        if (nav.startsWith('ru')) setLang('ru');
        else if (nav.startsWith('uz')) setLang('uz');
      }
    } catch {}
    const stored = localStorage.getItem('chemtest_user');
    if (!stored) {
      // Fresh visitor — nothing to restore, show the login screen right away
      setBooting(false);
      return;
    }
    let parsed: { id: string; email: string; name: string } | null = null;
    try {
      parsed = JSON.parse(stored);
    } catch {
      setBooting(false);
      return;
    }
    void (async () => {
    setHydratedUser(parsed);
    // === Stale-while-revalidate boot (TikTok-speed first paint) ===
    // Paint the dashboard IMMEDIATELY from the localStorage cache (when the
    // cached scope matches the current content mode), reveal the UI, then
    // refresh silently in the background — fresh data swaps in without any
    // layout jump (same card shapes → no CLS).
    hasLoadedRef.current = true;
    let restored = false;
    try {
      const c = JSON.parse(localStorage.getItem(FEED_CACHE_KEY) || 'null');
      if (c && Array.isArray(c.items) && c.scope === (discoverModeRef.current ? 'discover' : 'mine')) {
        setTests(c.items);
        seenIdsRef.current = new Set<string>(c.items.map((i: any) => i.id));
        if (Array.isArray(c.bm)) setBookmarkIds(new Set<string>(c.bm));
        restored = c.items.length > 0;
      }
      const a = JSON.parse(localStorage.getItem(ATTEMPTS_CACHE_KEY) || 'null');
      if (Array.isArray(a)) setAttempts(a);
    } catch {}
    const refresh = Promise.all([
      loadFeedRef.current().catch(() => { hasLoadedRef.current = false; }),
      api.getAttempts()
        .then(data => {
          setAttempts(data);
          try { localStorage.setItem(ATTEMPTS_CACHE_KEY, JSON.stringify(data)); } catch {}
        })
        .catch(() => {}),
    ]);
    if (restored) {
      // Cache hit: the dashboard is already on screen — reveal NOW and let
      // `refresh` swap in fresh data in the background.
      setBooting(false);
    } else {
      // No cache (first visit on this device): cap the splash at ~2.2s, then
      // show the dashboard shell (loading skeletons) while the network
      // finishes — the splash never blocks for the full API round-trip.
      setBootRefreshing(true);
      await Promise.race([refresh, new Promise(r => setTimeout(r, 2200))]);
      setBootRefreshing(false);
      setBooting(false);
    }
    refresh.finally(() => setBootRefreshing(false));
    })();
  }, []);

  // Apply hydrated user - use hydratedUser if no explicit login has happened
  // Only use hydratedUser after mount to avoid hydration mismatch
  const effectiveUser = user || (mounted ? hydratedUser : null);
  const effectivePage = page === 'auth' && mounted && hydratedUser ? 'dashboard' : page;

  // My profile photo: probe the avatar route once per session/user — a 200
  // means a photo exists (shown on the account button), 404 → initials.
  useEffect(() => {
    const uid = effectiveUser?.id;
    if (!uid) { setMyAvatar(null); return; }
    let alive = true;
    fetch(`/api/users/${uid}/avatar`)
      .then(res => { if (alive) setMyAvatar(res.ok ? `/api/users/${uid}/avatar?t=${Date.now()}` : null); })
      .catch(() => { if (alive) setMyAvatar(null); });
    return () => { alive = false; };
  }, [effectiveUser?.id]);

  // Profile-photo upload: center-cropped 256×256 JPEG (a few dozen KB),
  // stored IN THE TELEGRAM CHANNEL by /api/me/avatar like every other file.
  const handleAvatarFile = async (file: File) => {
    if (!effectiveUser || avatarBusy) return;
    setAvatarBusy(true);
    try {
      let blob: Blob = file;
      try {
        const bitmap = await createImageBitmap(file);
        const side = Math.min(bitmap.width, bitmap.height);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
          blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b || file), 'image/jpeg', 0.85));
        }
      } catch { /* keep the original file when the browser cannot decode it */ }
      await api.uploadAvatar(blob);
      setMyAvatar(`/api/users/${effectiveUser.id}/avatar?t=${Date.now()}`);
      toast({ title: t('avatarSaved') });
    } catch (e: any) {
      toast({ title: t('error'), description: e.message, variant: 'destructive' });
    } finally {
      setAvatarBusy(false);
    }
  };

  // --- Profile page ---
  // Load the profile (name + background preset) once per session/user. The
  // name also seeds the editable input; bgStyle drives the test-taking
  // background applied to start-test / take-test / results.
  useEffect(() => {
    const uid = effectiveUser?.id;
    if (!uid) { setMyBgStyle(''); setProfileName(''); return; }
    let alive = true;
    api.getProfile()
      .then((p: any) => {
        if (!alive) return;
        setMyBgStyle(typeof p?.bgStyle === 'string' ? p.bgStyle : '');
        setProfileName(typeof p?.name === 'string' ? p.name : (effectiveUser?.name || ''));
      })
      .catch(() => { if (alive) setProfileName(effectiveUser?.name || ''); });
    return () => { alive = false; };
  }, [effectiveUser?.id]);

  // Rename: PUT /api/me, then mirror the new name into the client session
  // (state + localStorage) so the dashboard header picks it up instantly.
  const saveProfileName = async () => {
    if (!effectiveUser || profileSaving) return;
    const name = profileName.trim();
    if (!name || name === effectiveUser.name) return;
    setProfileSaving(true);
    try {
      const r: any = await api.updateProfile({ name });
      const next = { id: effectiveUser.id, email: effectiveUser.email, name: r?.name || name };
      setUserState(next);
      setUser(next); // persists to localStorage
      toast({ title: t('profileNameSaved') });
    } catch (e: any) {
      toast({ title: t('error'), description: e.message, variant: 'destructive' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Background preset: optimistic switch — the preview updates instantly and
  // the choice is persisted silently; the previous preset comes back on error.
  const saveBgStyle = async (id: string) => {
    if (!effectiveUser || id === myBgStyle) return;
    const prev = myBgStyle;
    setMyBgStyle(id);
    try {
      await api.updateProfile({ bgStyle: id });
    } catch (e: any) {
      setMyBgStyle(prev);
      toast({ title: t('error'), description: e.message, variant: 'destructive' });
    }
  };

  // Shared cleanup for logout / account deletion: drop the session, the local
  // caches and all user-scoped UI state, then land on the login screen.
  const resetSessionState = () => {
    setUser(null); // clears localStorage session
    setUserState(null);
    setHydratedUser(null);
    setMyAvatar(null);
    setMyBgStyle('');
    setProfileName('');
    setTests([]);
    setAttempts([]);
    setBookmarkIds(new Set());
    setDiscoverMode(false); discoverModeRef.current = false;
    setViewingUser(null);
  };

  const handleLogout = () => {
    resetSessionState();
    setPage('auth');
    toast({ title: t('logoutDone') });
  };

  const handleDeleteAccount = async () => {
    if (!effectiveUser || accBusy) return;
    setAccBusy(true);
    try {
      await api.deleteAccount();
      resetSessionState();
      setPage('auth');
      toast({ title: t('accountDeleted') });
    } catch (e: any) {
      toast({ title: t('error'), description: e.message, variant: 'destructive' });
    } finally {
      setAccBusy(false);
    }
  };


  // --- Saved test progress ("Continue Test") ---
  const progressUserId = effectiveUser?.id || 'anon';
  const [savedProgress, setSavedProgress] = useState<SavedTestProgress | null>(null);
  // Re-check saved progress whenever the screen or the current test changes —
  // the start-test page uses it to swap "Start Test" for "Continue Test".
  useEffect(() => {
    setSavedProgress(currentTest ? readTestProgress(progressUserId, currentTest.id) : null);
  }, [currentTest?.id, effectivePage, progressUserId]);

  const FEED_PAGE_LIMIT = 12;

  // First page of the personalized feed (replaces the old full /api/tests dump).
  // The scope follows the content mode: personal library (own + bookmarks) or
  // discover (public tests of other authors). Bookmarks are refreshed in the
  // same breath so the mode switch sees a fresh set.
  const loadFeed = useCallback(async (): Promise<void> => {
    const reqId = ++feedReqIdRef.current;
    try {
      const [res, bm] = await Promise.all([
        api.getFeed({ tab: 'foryou', cursor: null, limit: FEED_PAGE_LIMIT, scope: discoverModeRef.current ? 'discover' : 'mine' }),
        api.getBookmarks().catch(() => null),
      ]);
      if (reqId !== feedReqIdRef.current) return; // a newer request superseded this one
      if (bm?.ids) setBookmarkIds(new Set(bm.ids));
      const items: Test[] = res?.items || [];
      seenIdsRef.current = new Set(items.map(i => i.id));
      setTests(items);
      feedCursorRef.current = res?.nextCursor ?? null;
      feedHasMoreRef.current = !!res?.nextCursor;
      setFeedHasMore(!!res?.nextCursor);
      // Persist for the next boot's instant paint (stale-while-revalidate)
      try {
        localStorage.setItem(FEED_CACHE_KEY, JSON.stringify({
          items,
          bm: bm?.ids || [],
          scope: discoverModeRef.current ? 'discover' : 'mine',
          at: Date.now(),
        }));
      } catch {}
    } catch {
      // keep the previous list on transient errors
    }
  }, []);

  // Stable handle for code that runs before/without re-render (boot, login)
  const loadFeedRef = useRef(loadFeed);
  loadFeedRef.current = loadFeed;

  // Next pages, appended silently when the user approaches the end of the feed
  const loadMoreFeed = useCallback(async (): Promise<void> => {
    if (viewingUserRef.current) return; // another user's library: no pagination
    if (feedLoadingMoreRef.current || !feedHasMoreRef.current || !feedCursorRef.current) return;
    feedLoadingMoreRef.current = true;
    try {
      const res = await api.getFeed({ tab: 'foryou', cursor: feedCursorRef.current, limit: FEED_PAGE_LIMIT, scope: discoverModeRef.current ? 'discover' : 'mine' });
      const fresh: Test[] = (res?.items || []).filter(i => !seenIdsRef.current.has(i.id));
      fresh.forEach(i => seenIdsRef.current.add(i.id));
      if (fresh.length) setTests(prev => [...prev, ...fresh]);
      feedCursorRef.current = res?.nextCursor ?? null;
      feedHasMoreRef.current = !!res?.nextCursor;
      setFeedHasMore(!!res?.nextCursor);
    } catch {
      // transient error — stop silently, the user can scroll again
    } finally {
      feedLoadingMoreRef.current = false;
    }
  }, []);

  // Legacy alias — create/edit/delete flows call loadTests() to refresh the list
  const loadTests = loadFeed;

  // Silent infinite scroll: observe the sentinel below the last card
  useEffect(() => {
    if (effectivePage !== 'dashboard') return;
    const el = feedSentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => { if (entries.some(e => e.isIntersecting)) loadMoreFeed(); },
      { root: dashFeedRef.current, rootMargin: '700px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  });

  // Shared test link (?test=<id>): open that exact test on the dashboard.
  // Powers the "share by link" option — recipients land directly on the test.
  useEffect(() => {
    if (sharedTestHandledRef.current || booting || effectivePage !== 'dashboard') return;
    let raw: string | null = null;
    try { raw = new URLSearchParams(window.location.search).get('test'); } catch { raw = null; }
    if (!raw) return;
    sharedTestHandledRef.current = true;
    const id = raw.trim().slice(0, 40);
    const cleanUrl = () => { try { window.history.replaceState({}, '', window.location.pathname); } catch {} };
    const idx = tests.findIndex(x => x.id === id);
    const jump = (i: number) => {
      // Deep links always open the swipe feed, never the grid views
      if (dashView !== 'tiktok1' && dashView !== 'tiktok2') setDashView('tiktok1');
      setDashTestIdx(i);
      const el = dashFeedRef.current;
      if (el && el.clientHeight > 0) el.scrollTo({ top: i * el.clientHeight, behavior: 'instant' as ScrollBehavior });
    };
    if (idx >= 0) {
      jump(idx);
      cleanUrl();
      return;
    }
    // Not in the loaded pages — fetch the full test and pin it to the top
    api.getTest(id).then((full: Test) => {
      seenIdsRef.current.add(full.id);
      setTests(prev => (prev.some(x => x.id === full.id) ? prev : [full, ...prev]));
      jump(0);
      cleanUrl();
    }).catch((e: any) => {
      // The linked test is gone (deleted by its author): keep the URL and
      // swap the whole dashboard for the dead-link screen — just a message
      // and the return-home button. Transient failures stay silent.
      if (String(e?.message || '').toLowerCase().includes('not found')) setDeadLink(true);
      else cleanUrl();
    });
  });

  // Header search (tests context): debounce 350ms, server-side /api/feed?q=
  useEffect(() => {
    if (effectivePage !== 'dashboard') return;
    const q = dashSearch.trim();
    if (q.length < 2) { setDashSearchResults(null); setDashTagInfo(null); setDashSearching(false); return; }
    setDashSearching(true);
    let alive = true;
    const t = setTimeout(() => {
      api.getFeed({ tab: 'foryou', q, limit: 8 })
        .then((res: { items?: Test[]; tagInfo?: { query: string; exists: boolean; created: boolean; similar: string[] } | null }) => { if (alive) { setDashSearchResults(res?.items || []); setDashTagInfo(res?.tagInfo || null); setDashSearching(false); } })
        .catch(() => { if (alive) { setDashSearchResults([]); setDashTagInfo(null); setDashSearching(false); } });
    }, 350);
    return () => { alive = false; clearTimeout(t); };
  }, [dashSearch, effectivePage]);

  // Load tests when navigating to dashboard (skipped when boot already restored the data)
  useEffect(() => {
    if (effectivePage === 'dashboard' && effectiveUser && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      Promise.all([
        loadFeedRef.current().catch(() => {}),
        api.getAttempts().then(data => setAttempts(data)).catch(() => {}),
      ]);
    }
  }, [page, user, mounted, hydratedUser]);

  // Dashboard: TikTok-style vertical feed of tests
  const [dashTestIdx, setDashTestIdx] = useState(0);
  const [dashFullTests, setDashFullTests] = useState<Record<string, Test>>({});
  const dashFeedRef = React.useRef<HTMLDivElement>(null);
  const dashFetchedRef = React.useRef<Set<string>>(new Set());
  const dashFeedTouchUntilRef = React.useRef(0);
  const dashFeedSettleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // Dashboard VIEW modes: tiktok1 = card swipe feed, tiktok2 = the same feed
  // opened from the library (back button in the header), library = shelves of
  // 3 mini cards per shelf, shelf = one card per shelf. Library & shelf scroll
  // endlessly downwards while tests remain.
  const [dashView, setDashView] = useState<'tiktok1' | 'tiktok2' | 'library' | 'shelf'>('tiktok1');
  // Library grid: 2 cards per row on phones (full button names need the width),
  // 3 per row from sm up — matches the Tailwind sm breakpoint (640px)
  const [libNarrow, setLibNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setLibNarrow(mq.matches);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);
  // Dashboard CONTENT MODE lives with the other dashboard state above; the
  // bookmark ids are loaded together with the feed (see loadFeed).
  const gridScrollTopRef = useRef(0);
  const libReturnViewRef = useRef<'library' | 'shelf'>('library');

  // Flattened file slides for files feed mode: every loaded test contributes
  // ONE slide listing ALL of its attachments, in recommendation order (tests
  // without files are skipped — the swipe flows from this test's files card
  // to the next test's).
  // A test's slides join ONLY once every earlier loaded test is fetched too,
  // so resolving fetches APPEND slides and never shift the visible position.
  // ONE slide per test — the card lists ALL of the test's attached files
  // (scrollable), not one file per slide.
  const fileSlides = React.useMemo(() => {
    if (!filesFeedMode) return [] as { test: Test; files: AttachmentItem[]; count: number }[];
    const out: { test: Test; files: AttachmentItem[]; count: number }[] = [];
    // Per-test files mode: exactly ONE slide with that test's files (even if
    // the test has left the loaded list — the cached full payload covers it).
    if (filesFeedTestId) {
      const t = tests.find(x => x.id === filesFeedTestId) || (dashFullTests[filesFeedTestId] as Test | undefined);
      if (!t) return out;
      const full = dashFullTests[t.id];
      if (!full) return out; // attachments still loading
      const fl = ((full.attachments ?? []) as AttachmentItem[]).filter(Boolean);
      if (fl.length > 0) out.push({ test: t, files: fl, count: fl.length });
      return out;
    }
    for (const t of tests) {
      const full = dashFullTests[t.id];
      if (!full) break; // earlier test's attachments still loading — stop here
      const fl = ((full.attachments ?? []) as AttachmentItem[]).filter(Boolean);
      if (fl.length === 0) continue; // tests without files don't contribute a card
      out.push({ test: t, files: fl, count: fl.length });
    }
    return out;
  }, [filesFeedMode, filesFeedTestId, tests, dashFullTests]);
  const fileSlidesRef = useRef<{ test: Test; files: AttachmentItem[]; count: number }[]>([]);
  const fileSlidesCountRef = useRef(0);
  useEffect(() => { fileSlidesRef.current = fileSlides; fileSlidesCountRef.current = fileSlides.length; }, [fileSlides]);

  // Instantly align the dashboard feed with slide/test index i (post-commit)
  const scrollDashTo = useCallback((i: number) => {
    dashFeedTouchUntilRef.current = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = dashFeedRef.current;
      if (el && el.clientHeight > 0) el.scrollTo({ top: i * el.clientHeight, behavior: 'instant' as ScrollBehavior });
    }));
  }, []);

  // Entering files mode: remember which test's files to land on; once its
  // slides exist (attachments may still be loading), scroll to the first one.
  const pendingFilesJumpRef = useRef<string | null>(null);
  useEffect(() => {
    if (!filesFeedMode || !pendingFilesJumpRef.current) return;
    const idx = fileSlides.findIndex(s => s.test.id === pendingFilesJumpRef.current);
    if (idx < 0) return;
    pendingFilesJumpRef.current = null;
    setDashSlideIdx(idx);
    scrollDashTo(idx);
  }, [fileSlides, filesFeedMode, scrollDashTo]);

  // When the visible test/slide changes: apply its defaults, lazy-fetch the
  // full test for attachments, sync feed scroll (test mode only — in files
  // mode the settle handler is the single source of truth for the position).
  useEffect(() => {
    if (effectivePage !== 'dashboard') return;
    if (tests.length === 0) return;
    if (dashView !== 'tiktok1' && dashView !== 'tiktok2') return; // grid views have no "current test"
    if (filesFeedMode) {
      const s = fileSlides[Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlides.length - 1))];
      if (!s) return;
      const t = s.test;
      // Keep dashTestIdx on the test whose files are visible — the bottom bar
      // (Start Test etc.) then stays EXACTLY as it is in the normal feed
      const tIdx = tests.findIndex(x => x.id === t.id);
      if (tIdx >= 0 && tIdx !== dashTestIdx) setDashTestIdx(tIdx);
      const totalQ = t._count?.questions || t.questions?.length || 0;
      setSelectedQuestionCount(Math.max(1, totalQ));
      setStartRandomizeQ(t.randomizeQuestions !== false);
      setStartRandomizeO(t.randomizeOptions !== false);
      setStartFilesExpanded(false);
      if (!dashFetchedRef.current.has(t.id)) {
        dashFetchedRef.current.add(t.id);
        api.getTest(t.id)
          .then((full: Test) => setDashFullTests(prev => ({ ...prev, [t.id]: full })))
          .catch(() => { dashFetchedRef.current.delete(t.id); });
      }
      // Preload upcoming tests' attachments so swiping past the last file of
      // this test can continue into the next recommended test's files
      for (const t2 of tests) {
        if (dashFetchedRef.current.has(t2.id)) continue;
        dashFetchedRef.current.add(t2.id);
        api.getTest(t2.id)
          .then((full: Test) => setDashFullTests(prev => ({ ...prev, [t2.id]: full })))
          .catch(() => { dashFetchedRef.current.delete(t2.id); });
      }
      return;
    }
    const safeIdx = Math.min(Math.max(0, dashTestIdx), tests.length - 1);
    if (safeIdx !== dashTestIdx) { setDashTestIdx(safeIdx); return; }
    const t = tests[safeIdx];
    const totalQ = t._count?.questions || t.questions?.length || 0;
    setSelectedQuestionCount(Math.max(1, totalQ));
    setStartRandomizeQ(t.randomizeQuestions !== false);
    setStartRandomizeO(t.randomizeOptions !== false);
    setStartFilesExpanded(false);
    // Sync feed position (e.g. when returning to the dashboard).
    // Skipped right after user scrolling — otherwise this teleport-fights the
    // native snap mid-swipe and makes the swipe feel janky.
    const el = dashFeedRef.current;
    if (
      el && el.clientHeight > 0 &&
      Math.abs(el.scrollTop - safeIdx * el.clientHeight) > 2 &&
      Date.now() >= dashFeedTouchUntilRef.current
    ) {
      el.scrollTo({ top: safeIdx * el.clientHeight, behavior: 'instant' as ScrollBehavior });
    }
    // Lazy-fetch the full test (for the attached files list)
    if (!dashFetchedRef.current.has(t.id)) {
      dashFetchedRef.current.add(t.id);
      api.getTest(t.id)
        .then((full: Test) => setDashFullTests(prev => ({ ...prev, [t.id]: full })))
        .catch(() => { dashFetchedRef.current.delete(t.id); });
    }
  }, [dashTestIdx, dashSlideIdx, filesFeedMode, dashView, effectivePage, tests, fileSlides]);

  // Grid views (library / shelf): prefetch the full tests of every loaded card
  // so the per-card attached-files button knows the real file count
  useEffect(() => {
    if (effectivePage !== 'dashboard') return;
    if (dashView !== 'library' && dashView !== 'shelf') return;
    for (const t of tests) {
      if (dashFetchedRef.current.has(t.id)) continue;
      dashFetchedRef.current.add(t.id);
      api.getTest(t.id)
        .then((full: Test) => setDashFullTests(prev => ({ ...prev, [t.id]: full })))
        .catch(() => { dashFetchedRef.current.delete(t.id); });
    }
  }, [dashView, effectivePage, tests]);

  // Scroll the page down to the newly added question (questions scroll with the whole page)
  const prevQuestionCountRef = React.useRef(questions.length);
  useEffect(() => {
    if (questions.length > prevQuestionCountRef.current) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
    prevQuestionCountRef.current = questions.length;
  }, [questions.length]);

  const handleAuth = async () => {
    if (!email || !password || (authMode === 'signup' && !name)) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      let result;
      if (authMode === 'signup') {
        result = await api.register({ email, name, password });
      } else {
        result = await api.login({ email, password });
      }
      setUser(result);
      setUserState(result);
      // Load the user's data BEFORE switching to the dashboard — no empty flash
      hasLoadedRef.current = true;
      const [, userAttempts] = await Promise.all([
        loadFeedRef.current().catch(() => {}),
        api.getAttempts().catch(() => [] as Attempt[]),
      ]);
      setAttempts(userAttempts);
      setPage('dashboard');
      if (authMode === 'signup') {
        toast({ title: t('accountCreated'), description: t('welcomeBack') });
      } else {
        toast({ title: t('welcomeBack') });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };
  // NOTE: the header account button no longer hosts a logout dropdown — it
  // toggles the dashboard content modes now (see toggleDiscoverMode). Logout
  // happens through clearing the session (browser data).




  // --- TEST CREATION ---
  const addQuestion = () => {
    setQuestions([...questions, { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: string) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  // Multi-field question patch (photos set url + channel-post id in one go)
  const patchQuestion = (idx: number, patch: Partial<Question>) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], ...patch };
    setQuestions(updated);
  };

  // --- Question / option photos ---
  // Photos go to the OWNER'S TELEGRAM CHANNEL via /api/attachments/upload
  // (kind=image): the DB keeps only a `tg:<file_id>` reference. Small files
  // fall back to data: URLs when the bot is not connected. The picked image is
  // downscaled in the browser first (max 1600px JPEG) to keep uploads light.
  const [photoBusy, setPhotoBusy] = useState<string>('');

  const pickQuestionPhoto = async (idx: number, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: t('error'), description: t('notAnImage'), variant: 'destructive' });
      return;
    }
    setPhotoBusy(`q-${idx}`);
    try {
      const blob = await compressImage(file);
      const fd = new FormData();
      fd.append('file', new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: blob.type || 'image/jpeg' }));
      fd.append('kind', 'image');
      const user = getUser();
      const res = await fetch('/api/attachments/upload', {
        method: 'POST',
        body: fd,
        headers: user ? { 'x-user-id': user.id } : undefined,
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok && body?.url) {
        patchQuestion(idx, { imageUrl: body.url as string, imageMsgId: typeof body.tgMessageId === 'number' ? body.tgMessageId : null });
      } else {
        toast({ title: t('photoUploadFail'), description: body?.error || `HTTP ${res.status}`, variant: 'destructive' });
      }
    } catch {
      toast({ title: t('photoUploadFail'), variant: 'destructive' });
    } finally {
      setPhotoBusy('');
    }
  };

  const pickOptionPhoto = async (idx: number, letter: string, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: t('error'), description: t('notAnImage'), variant: 'destructive' });
      return;
    }
    setPhotoBusy(`o-${idx}-${letter}`);
    try {
      const blob = await compressImage(file);
      const fd = new FormData();
      fd.append('file', new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: blob.type || 'image/jpeg' }));
      fd.append('kind', 'image');
      const user = getUser();
      const res = await fetch('/api/attachments/upload', {
        method: 'POST',
        body: fd,
        headers: user ? { 'x-user-id': user.id } : undefined,
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok && body?.url) {
        const q = questions[idx];
        const next = { ...(q.optionImages || {}) };
        next[letter] = { u: body.url as string, m: typeof body.tgMessageId === 'number' ? body.tgMessageId : null };
        patchQuestion(idx, { optionImages: next });
      } else {
        toast({ title: t('photoUploadFail'), description: body?.error || `HTTP ${res.status}`, variant: 'destructive' });
      }
    } catch {
      toast({ title: t('photoUploadFail'), variant: 'destructive' });
    } finally {
      setPhotoBusy('');
    }
  };

  const clearQuestionPhoto = (idx: number) => patchQuestion(idx, { imageUrl: null, imageMsgId: null });
  const clearOptionPhoto = (idx: number, letter: string) => {
    const q = questions[idx];
    if (!q.optionImages?.[letter]) return;
    const next = { ...q.optionImages };
    delete next[letter];
    patchQuestion(idx, { optionImages: Object.keys(next).length ? next : null });
  };

  const resetTestForm = () => {
    setTestTitle('');
    setTestDescription('');
    setTestTags([]);
    setTagInput('');
    setTagsOpen(false);
    setTestCoverIcon('');
    setTestCoverColor('');
    setRandomizeQ(true);
    setRandomizeO(true);
    setQuestions([{ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
    setFormAttachments([]);
    setTestIsPublic(true);
    setEditorFilesExpanded(false);
    setEditorInfoExpanded(false);
    setEditorCoverExpanded(false);
    setEditorQuestionsExpanded(false);
    setEditingTestId(null);
  };

  const startCreateTest = () => {
    setViewingUser(null); // creating always happens in the user's own library
    resetTestForm();
    setPage('create-test');
  };

  // ----- Tags editor helpers -----
  const addTag = (raw: string) => {
    const t = raw.trim().replace(/\s+/g, ' ').slice(0, 30);
    if (!t) return;
    if (!testTags.some(x => x.toLowerCase() === t.toLowerCase()) && testTags.length < 10) {
      setTestTags([...testTags, t]);
    }
    setTagInput('');
  };

  const removeTag = (t: string) => setTestTags(testTags.filter(x => x !== t));

  // Autocomplete: dictionary tags matching the typed text, minus already-added ones
  const tagSuggestions = allTags
    .filter(t => !testTags.some(x => x.toLowerCase() === t.toLowerCase()))
    .filter(t => !tagInput.trim() || t.toLowerCase().includes(tagInput.trim().toLowerCase()))
    .slice(0, 8);

  const startEditTest = async (test: Test) => {
    // Somebody else's test is NEVER edited in place: "Edit" makes a private
    // copy with a unique name in the user's own library and opens THAT copy.
    setViewingUser(null); // after editing, the user lands back in their own library
    if (effectiveUser && test.creatorId && test.creatorId !== effectiveUser.id) {
      setLoading(true);
      try {
        toast({ title: t('copyCreating') });
        const copy = await api.copyTest(test.id);
        await loadFeedRef.current(); // the copy joins the personal library list
        toast({ title: t('copyCreated') });
        setLoading(false);
        return startEditTest(copy as Test); // now it's mine — normal edit path
      } catch (e: any) {
        setLoading(false);
        toast({ title: t('error'), description: e.message, variant: 'destructive' });
        return;
      }
    }
    setLoading(true);
    setEditorFilesExpanded(false);
    setEditorInfoExpanded(false);
    setEditorCoverExpanded(false);
    setEditorQuestionsExpanded(false);
    try {
      const fullTest = await api.getTest(test.id);
      setCurrentTest(fullTest);
      setTestTitle(fullTest.title);
      setTestDescription(fullTest.description);
      setTestTags(fullTest.tags || []);
      setTestCoverIcon(fullTest.coverIcon || '');
      setTestCoverColor(fullTest.coverColor || '');
      setRandomizeQ(fullTest.randomizeQuestions);
      setRandomizeO(fullTest.randomizeOptions);
      setTestIsPublic(fullTest.isPublic !== false);
      setQuestions(fullTest.questions.map(q => ({
        text: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation ?? null,
        translations: q.translations ?? null,
        imageUrl: q.imageUrl ?? null,
        imageMsgId: (q as any).imageMsgId ?? null,
        optionImages: (q as any).optionImages ?? null,
        id: q.id,
      })));
      setFormAttachments((fullTest.attachments || []).map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        url: a.url,
        size: a.size ?? null,
        orderNum: a.orderNum,
        tgMessageId: (a as any).tgMessageId ?? null,
      })));
      setEditingTestId(fullTest.id);
      setPage('edit-test');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  // Take-screen "Edit Test": fill the shared editor form from the CURRENT test
  // and open the edit bottom sheet without leaving the taking screen.
  const startEditTestInTake = () => {
    if (!currentTest) return;
    // A test owned by somebody else cannot be edited in place — make a copy
    // into my library and keep editing THAT copy (the sheet opens on it).
    if (effectiveUser && (currentTest as any).creatorId && (currentTest as any).creatorId !== effectiveUser.id) {
      setLoading(true);
      api.copyTest((currentTest as any).id)
        .then(async (copy: any) => {
          toast({ title: t('copyCreated') });
          loadFeedRef.current().catch(() => {});
          // Fill the editor form from the copy — the sheet opens on it
          setTestTitle(copy.title);
          setTestDescription(copy.description);
          setTestTags(copy.tags || []);
          setTestCoverIcon(copy.coverIcon || '');
          setTestCoverColor(copy.coverColor || '');
          setRandomizeQ(!!copy.randomizeQuestions);
          setRandomizeO(!!copy.randomizeOptions);
          setTestIsPublic(copy.isPublic !== false);
          setQuestions((copy.questions || []).map((q: any) => ({
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            optionE: q.optionE,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation ?? null,
            translations: q.translations ?? null,
            imageUrl: q.imageUrl ?? null,
            imageMsgId: q.imageMsgId ?? null,
            optionImages: q.optionImages ?? null,
            id: q.id,
          })));
          setFormAttachments((copy.attachments || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            url: a.url,
            size: a.size ?? null,
            orderNum: a.orderNum,
            tgMessageId: a.tgMessageId ?? null,
          })));
          setCurrentTest(copy);
          setEditingTestId(copy.id);
          setEditOpen(true);
        })
        .catch((e: any) => toast({ title: t('error'), description: e.message, variant: 'destructive' }))
        .finally(() => setLoading(false));
      return;
    }
    setEditorFilesExpanded(false);
    setEditorInfoExpanded(false);
    setEditorCoverExpanded(false);
    setEditorQuestionsExpanded(false);
    setTestTitle(currentTest.title);
    setTestDescription(currentTest.description);
    setTestTags(currentTest.tags || []);
    setTestCoverIcon(currentTest.coverIcon || '');
    setTestCoverColor(currentTest.coverColor || '');
    setRandomizeQ(!!currentTest.randomizeQuestions);
    setRandomizeO(!!currentTest.randomizeOptions);
    setTestIsPublic(currentTest.isPublic !== false);
    setQuestions(currentTest.questions.map(q => ({
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      optionE: q.optionE,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? null,
      translations: q.translations ?? null,
      imageUrl: q.imageUrl ?? null,
      imageMsgId: (q as any).imageMsgId ?? null,
      optionImages: (q as any).optionImages ?? null,
      id: q.id,
    })));
    setFormAttachments((currentTest.attachments || []).map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      url: a.url,
      size: a.size ?? null,
      orderNum: a.orderNum,
    })));
    setEditingTestId(currentTest.id);
    setEditOpen(true);
  };

  const handleSaveTest = async (fromTake = false) => {
    if (!testTitle) {
      toast({ title: t('error'), description: t('titleRequired'), variant: 'destructive' });
      return;
    }
    if (questions.some(q => !q.text || !q.optionA || !q.optionB || !q.optionC || !q.optionD)) {
      toast({ title: t('error'), description: t('allQuestionsNeed'), variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const data = {
        title: testTitle,
        description: testDescription,
        tags: testTags,
        coverIcon: testCoverIcon || null,
        coverColor: testCoverColor || null,
        // Publication variant chosen in the "Test Information" section:
        // false = share only with those who have the link,
        // true = public — the test AND its attached files are visible to everyone
        isPublic: testIsPublic,
        randomizeQuestions: randomizeQ,
        randomizeOptions: randomizeO,
        questions: questions.map((q, i) => ({
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          optionE: q.optionE || null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation ?? null,
          translations: q.translations ?? null,
          imageUrl: q.imageUrl ?? null,
          imageMsgId: q.imageMsgId ?? null,
          optionImages: q.optionImages ?? null,
          orderNum: i,
        })),
        attachments: formAttachments.map((a, i) => ({
          title: a.title,
          type: a.type,
          url: a.url,
          size: a.size ?? null,
          tgMessageId: a.tgMessageId ?? null,
          orderNum: i,
        })),
      };

      if (editingTestId) {
        await api.updateTest(editingTestId, data);
        toast({ title: t('testUpdated'), description: t('testUpdatedDesc') });
        if (fromTake) {
          // Saved from the take-test / results "Edit Test" sheet: reload the
          // test and rebuild the session in place. Editing recreates every
          // question with a NEW id (the old attempt cannot be submitted), so:
          //  - the OLD question order is restored by matching texts — the
          //    session continues on the very SAME question the user was on;
          //  - answers carry over by OPTION TEXT (not letter), so a re-shuffle
          //    of options can never move someone's answer to another option;
          //  - practice reveals carry over by question text.
          const full = await api.getTest(editingTestId);
          const oldByText = new Map<string, Question>();
          shuffledQuestions.forEach(q => { if (q.text && !oldByText.has(q.text)) oldByText.set(q.text, q); });
          const matched: Question[] = [];
          const usedNewIds = new Set<string>();
          shuffledQuestions.forEach(oq => {
            if (!oq.text) return;
            const nq = full.questions.find((n: Question) => n.text === oq.text && !usedNewIds.has(n.id || ''));
            if (nq) { matched.push(nq); usedNewIds.add(nq.id || ''); }
          });
          let rest = full.questions.filter((n: Question) => !usedNewIds.has(n.id || ''));
          if (startRandomizeQ) rest = shuffleArray(rest);
          let qList = [...matched, ...rest];
          if (startRandomizeO) qList = qList.map(q => shuffleOptions(q));
          const count = Math.min(Math.max(1, selectedQuestionCount || qList.length), qList.length);
          qList = qList.slice(0, count);
          const carriedAnswers: Record<string, string> = {};
          const carriedReveals: Record<string, boolean> = {};
          qList.forEach(q => {
            const oq = q.text ? oldByText.get(q.text) : undefined;
            if (!oq) return;
            const oldId = oq.id || '';
            const letter = answers[oldId];
            if (letter) {
              const optText = (oq as any)[`option${letter}`];
              const newLetter = ['A', 'B', 'C', 'D', 'E'].find(L => (q as any)[`option${L}`] === optText);
              if (newLetter) carriedAnswers[q.id || ''] = newLetter;
            }
            if (revealedAnswers[oldId]) carriedReveals[q.id || ''] = true;
          });
          const wasOnResults = showResult;
          if (!wasOnResults) {
            // Fresh open attempt for the recreated questions
            const attempt = await api.createAttempt(full.id, count);
            setCurrentAttempt(attempt);
          }
          setCurrentTest(full);
          setShuffledQuestions(qList);
          setAnswers(carriedAnswers);
          setRevealedAnswers(carriedReveals);
          setExplanations({});
          setSelectedQuestionCount(count);
          if (!wasOnResults) {
            // Continue on the SAME question the user was on (clamped — the
            // editor may have removed some of the questions)
            setCurrentQuestionIdx(Math.min(currentQuestionIdx, qList.length - 1));
          }
          // From the results screen: stay on the (updated) results; from the
          // taking screen: keep taking.
          setShowResult(wasOnResults);
          setEditOpen(false);
          setDrumInputMode(false);
          setLoading(false);
          return;
        }
      } else {
        const created = await api.createTest(data);
        toast({ title: 'Test created!', description: 'Your new test has been created.' });
        // Show the new test right away: pin it to the top of the personal feed
        if (created?.id) {
          seenIdsRef.current.add(created.id);
          setTests(prev => [created, ...prev.filter(x => x.id !== created.id)]);
          feedReqIdRef.current++; // invalidate any in-flight feed fetch
          hasLoadedRef.current = true;
          setPage('dashboard');
          setDashTestIdx(0);
          setLoading(false);
          return;
        }
      }
      setPage('dashboard');
      hasLoadedRef.current = false;
      await loadTests();
    } catch (e: any) {
      // Publishing rule: a public test must have a title that no other public
      // test uses — the server rejects the save with PUBLISH_NAME_TAKEN.
      if (e?.message === 'PUBLISH_NAME_TAKEN') {
        toast({ title: t('error'), description: t('publishNameTaken'), variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    }
    setLoading(false);
  };

  const handleDeleteTest = async (id: string) => {
    try {
      await api.deleteTest(id);
      // Purge every cached surface of the deleted test: the full-test cache
      // and both files modes (a files card of a deleted test would keep
      // rendering from the cache). The feed reload below drops the card
      // itself; the community feed loses it through the cascading delete.
      setDashFullTests(prev => {
        if (!prev[id]) return prev;
        const next = { ...prev }; delete next[id]; return next;
      });
      if ((gridFilesMode && gridFilesTestId === id) || (filesFeedMode && filesFeedTestId === id)) {
        pendingFilesJumpRef.current = null;
        setGridFilesMode(false); setGridFilesTestId(null);
        setFilesFeedMode(false); setFilesFeedTestId(null);
        setDashSlideIdx(0);
      }
      toast({ title: t('testDeleted'), description: t('testDeletedDesc') });
      await loadTests();
    } catch (e: any) {
      toast({ title: t('error'), description: e.message, variant: 'destructive' });
    }
    setDeleteId(null);
  };

  // --- TEST TAKING ---
  const openStartTest = async (test: Test) => {
    setLoading(true);
    try {
      const fullTest = await api.getTest(test.id);
      setCurrentTest(fullTest);
      const totalQ = fullTest.questions.length;
      setSelectedQuestionCount(totalQ);
      setStartRandomizeQ(fullTest.randomizeQuestions !== false);
      setStartRandomizeO(fullTest.randomizeOptions !== false);
      setPracticeMode(false);
      setFilesOpen(false);
      setChatOpen(false);
      setGroupOpen(false);
      setEditOpen(false);
      setPage('start-test');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const startTestWith = async (test: Test, count: number) => {
    setLoading(true);
    try {
      // Apply randomization (chosen on the Start Test page / dashboard feed)
      let qList = [...test.questions];
      if (startRandomizeQ) {
        qList = shuffleArray(qList);
      }
      if (startRandomizeO) {
        qList = qList.map(q => shuffleOptions(q));
      }

      // Slice to selected count
      qList = qList.slice(0, count);

      // Create attempt with the actual number of questions being answered
      const attempt = await api.createAttempt(test.id, count);
      setCurrentAttempt(attempt);
      setShuffledQuestions(qList);
      setCurrentQuestionIdx(0);
      setAnswers({});
      setShowResult(false);
      setRevealedAnswers({});
      setExplanations({});
      setFilesOpen(false);
      setGroupOpen(false);
      setEditOpen(false);
      setPage('take-test');

      // If practice mode, pre-fetch explanations (in the current UI language)
      if (practiceMode) {
        setLoadingExplanations(true);
        try {
          const ids = qList.map(q => q.id).filter(Boolean) as string[];
          if (ids.length > 0) {
            const result = await api.generateExplanations(ids, lang);
            const explMap: Record<string, string> = {};
            if (result.explanations) {
              for (const item of result.explanations) {
                if (item.explanation) explMap[item.id] = item.explanation;
              }
            }
            setExplanations(explMap);
          }
        } catch (e) {
          console.error('Failed to load explanations:', e);
        }
        setLoadingExplanations(false);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const startTest = async () => {
    if (!currentTest) return;
    await startTestWith(currentTest, selectedQuestionCount);
  };

  // Start directly from the dashboard feed (fetch the full test first)
  // fresh=true (Restart button) — skip any saved progress and start over;
  // override — start THIS test (grid cards), otherwise the test on screen
  const startFromDashboard = async (fresh = false, override?: Test) => {
    const t = override || tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)];
    if (!t || loading) return;
    setLoading(true);
    try {
      const fullTest = dashFullTests[t.id] || await api.getTest(t.id);
      setCurrentTest(fullTest);
      // Saved progress in this browser? Resume that attempt instead of a fresh start
      if (!fresh && continueTestWith(fullTest)) { setLoading(false); return; }
      const totalQ = fullTest.questions.length;
      const count = Math.min(Math.max(1, selectedQuestionCount || totalQ), totalQ);
      setSelectedQuestionCount(count);
      setFilesOpen(false);
      setChatOpen(false);
      setGroupOpen(false);
      setEditOpen(false);
      await startTestWith(fullTest, count);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      setLoading(false);
    }
  };

  // Resume a saved attempt: restore the exact shuffled order, answers, practice
  // reveals and position, and reuse the original attempt so history stays clean.
  // Returns true when there was progress to resume.
  const continueTestWith = (test: Test): boolean => {
    const saved = readTestProgress(progressUserId, test.id);
    if (!saved) return false;
    // The snapshot may predate stored translations (e.g. the session was saved
    // before a translation update). Merge fresh translation/explanation data
    // from the DB copy by question id — WITHOUT touching the shuffled option
    // order or correct answers, so carried answers stay valid. Edits recreate
    // question ids, so mismatched ids are simply left untouched.
    const freshById = new Map(test.questions.map(q => [q.id, q]));
    const qList = saved.shuffledQuestions.map(q => {
      const fresh = q.id ? freshById.get(q.id) : undefined;
      if (!fresh) return q;
      return {
        ...q,
        explanation: q.explanation ?? fresh.explanation ?? null,
        translations: { ...(fresh.translations || {}), ...(q.translations || {}) },
      };
    });
    setCurrentTest(test);
    setShuffledQuestions(qList);
    setCurrentQuestionIdx(Math.min(Math.max(0, saved.currentQuestionIdx || 0), qList.length - 1));
    setAnswers(saved.answers || {});
    setPracticeMode(!!saved.practiceMode);
    setRevealedAnswers(saved.revealedAnswers || {});
    setExplanations({});
    setShowResult(false);
    setQSearch(''); setQSearchOpen(false); setResSearch(''); setResHighlightIdx(null);
    setSelectedQuestionCount(qList.length);
    if (saved.attempt && saved.attempt.id) {
      setCurrentAttempt(saved.attempt);
    } else {
      // Attempt object missing (old/corrupted save) — open a new one, same count
      api.createAttempt(test.id, qList.length).then(setCurrentAttempt).catch(() => {});
    }
    setFilesOpen(false);
    setChatOpen(false);
    setGroupOpen(false);
    setEditOpen(false);
    setDrumInputMode(false);
    setPage('take-test');
    return true;
  };

  // Persist take-test progress (debounced 400ms): position, answers, practice
  // reveals and the exact shuffled order — everything needed to continue later.
  useEffect(() => {
    if (effectivePage !== 'take-test' || showResult || !currentTest || shuffledQuestions.length === 0) return;
    const t = setTimeout(() => {
      writeTestProgress(progressUserId, {
        v: 1,
        testId: currentTest.id,
        savedAt: Date.now(),
        attempt: currentAttempt,
        currentQuestionIdx,
        answers,
        practiceMode,
        revealedAnswers,
        shuffledQuestions,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [effectivePage, showResult, currentTest, currentAttempt, currentQuestionIdx, answers, practiceMode, revealedAnswers, shuffledQuestions, progressUserId]);

  // On-the-fly translation: while taking / reviewing a test, translate any
  // question that has no stored translation for the selected interface
  // language (user-created tests, old continue-snapshots, languages the test
  // was never translated to). Each result is applied to the state immediately,
  // cached in localStorage and persisted to the DB best-effort so everyone
  // loads it instantly afterwards. Generation counter guards against overlap:
  // a new run (deps changed) cancels the previous one; per-question failure
  // markers prevent infinite retry loops.
  useEffect(() => {
    if (!mounted || effectivePage !== 'take-test' || editOpen || !currentTest || shuffledQuestions.length === 0) return;
    const missing = shuffledQuestions.filter(
      q => q.text && q.id && !q.translations?.[lang] && !trTriedRef.current.has(`${currentTest.id}|${lang}|${q.id}`)
    );
    if (!missing.length) return;
    const testId = currentTest.id;
    const gen = ++trGenRef.current;
    const cancelled = () => trGenRef.current !== gen;
    setAutoTranslating(true);
    (async () => {
      const applyOne = (id: string, tr: QTranslationsV) => {
        if (cancelled()) return;
        const patch = (q: Question) => ({ ...q, translations: { ...(q.translations || {}), [lang]: tr } });
        setShuffledQuestions(prev => prev.map(q => (q.id === id ? patch(q) : q)));
        setCurrentTest(prev => (prev && prev.id === testId ? { ...prev, questions: prev.questions.map(q => (q.id === id ? patch(q) : q)) } : prev));
      };
      try {
        const map = await autoTranslateQuestions(missing, lang, applyOne);
        if (cancelled()) return;
        // Questions that failed stay unmarked by success — record them so the
        // effect doesn't retry them forever (e.g. when the MT service is down).
        missing.forEach(q => {
          if (q.id && !map.has(q.id)) trTriedRef.current.add(`${testId}|${lang}|${q.id}`);
        });
        const items = [...map.entries()].map(([id, tr]) => ({ id, ...tr }));
        if (items.length) api.saveTranslations(testId, lang, items).catch(() => {});
      } finally {
        if (!cancelled()) setAutoTranslating(false);
      }
    })();
  }, [mounted, effectivePage, editOpen, currentTest, shuffledQuestions, lang]);


  // Track which test is on screen while swiping the dashboard feed.
  // Same rule as the take-test feed: commit only after the swipe settles —
  // mid-gesture setState re-renders every cover slide while the card moves.
  const dashSettleCommit = () => {
    dashFeedSettleTimerRef.current = null;
    const el = dashFeedRef.current;
    if (!el || el.clientHeight === 0) return;
    if (Date.now() < dashFeedTouchUntilRef.current) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    const signal = (shown?: Test) => {
      if (shown && effectiveUser && !viewSignaledRef.current.has(shown.id)) {
        viewSignaledRef.current.add(shown.id);
        api.feedSignal(shown.id, 'view').catch(() => {});
      }
    };
    if (filesFeedModeRef.current) {
      // Files mode: commit the visible FILE slide
      if (fileSlidesCountRef.current === 0) return;
      const clamped = Math.min(fileSlidesCountRef.current - 1, Math.max(0, idx));
      setDashSlideIdx(clamped);
      signal(fileSlidesRef.current[clamped]?.test);
      return;
    }
    const clamped = Math.min(tests.length - 1, Math.max(0, idx));
    setDashTestIdx(clamped);
    // Recommendation signal (invisible): this card stayed on screen — count a view
    signal(tests[clamped]);
  };
  const armDashSettle = (delay = 140) => {
    if (dashFeedSettleTimerRef.current) clearTimeout(dashFeedSettleTimerRef.current);
    dashFeedSettleTimerRef.current = setTimeout(dashSettleCommit, delay);
  };
  const onDashScroll = () => {
    const el = dashFeedRef.current;
    if (!el || el.clientHeight === 0) return;
    armDashSettle(140);
  };
  const onDashTouchStart = () => { dashFeedTouchUntilRef.current = Date.now() + 600; };
  const onDashTouchEnd = () => {
    dashFeedTouchUntilRef.current = Date.now() + 150;
    armDashSettle(180);
  };
  const onDashWheel = () => {
    dashFeedTouchUntilRef.current = Date.now() + 250;
    armDashSettle(220);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    // In practice mode, reveal the correct answer immediately.
    // NOTE: the AI tutor chat is ONLY opened manually via the
    // "Ask AI Tutor about this question" button.
    if (practiceMode) {
      setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
    }
  };

  const buildQuestionContext = (q?: Question | null) => {
    if (!q) return undefined;
    const options: Record<string, string> = {};
    for (const letter of ['A', 'B', 'C', 'D', 'E']) {
      const val = trOption(q, letter, lang);
      if (val) options[letter] = val;
    }
    return {
      text: trText(q, lang),
      options,
      correctAnswer: q.correctAnswer,
      topic: currentTest?.topic || 'General',
    };
  };

  // Load the per-user AI chat threads once (after the user is known)
  useEffect(() => {
    if (!effectiveUser || chatThreadsLoadedRef.current) return;
    chatThreadsLoadedRef.current = true;
    try {
      const raw = localStorage.getItem(`ai_threads_${effectiveUser.id}`);
      if (raw) setChatThreads(JSON.parse(raw));
    } catch { /* corrupted cache — start fresh */ }
  }, [effectiveUser?.id]);

  // Mirror the visible conversation into the CURRENT test's thread
  useEffect(() => {
    if (!chatOpen || !currentTest || chatMessages.length === 0 || !chatThreadId || chatThreadId !== currentTest.id) return;
    setChatThreads(prev => ({
      ...prev,
      [currentTest.id]: { title: currentTest.title, messages: chatMessages, updatedAt: Date.now() },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages, chatOpen]);

  // Persist threads (per user) whenever they change
  useEffect(() => {
    if (!effectiveUser || !chatThreadsLoadedRef.current) return;
    try {
      localStorage.setItem(`ai_threads_${effectiveUser.id}`, JSON.stringify(chatThreads));
    } catch { /* storage full — the in-memory copy still works */ }
  }, [chatThreads, effectiveUser?.id]);

  // History drawer entries: every test that has at least one message
  const aiThreadMetas: AiThreadMeta[] = React.useMemo(() => Object.entries(chatThreads)
    .filter(([, th]) => th.messages.length > 0)
    .map(([testId, th]) => ({
      testId,
      title: th.title || 'Test',
      preview: th.messages[th.messages.length - 1]?.content?.slice(0, 90) || '',
      updatedAt: th.updatedAt || 0,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt), [chatThreads]);

  const selectChatThread = (testId: string) => {
    setChatHistoryOpen(false);
    if (testId === chatThreadId) return;
    const th = chatThreads[testId];
    setChatThreadId(testId);
    setChatMessages(th ? [...th.messages] : []);
    setChatInput('');
  };

  const openChat = (questionId: string, userAnswer?: string, opts?: { force?: boolean }) => {
    const q = shuffledQuestions.find(x => x.id === questionId) || null;
    setChatQuestionId(questionId);
    setChatQuestionObj(q);
    setChatUserAnswer(userAnswer || '');
    const tid = (currentTest as any)?.id || '';
    // First open on this test → resume THAT test's saved thread (per-test chats)
    const alreadyLoaded = chatThreadId === tid;
    if (!alreadyLoaded) {
      const th = chatThreads[tid];
      setChatThreadId(tid);
      setChatMessages(th ? [...th.messages] : []);
      setChatInput('');
    }
    const threadLen = alreadyLoaded ? chatMessages.length : (chatThreads[tid]?.messages.length || 0);
    // Auto-send the context message when the conversation is still empty, or
    // when the user explicitly tapped "Ask AI" on a question (force).
    if (opts?.force || threadLen === 0) {
      const initialMsg = userAnswer
        ? t('iChose', { a: userAnswer })
        : t('helpUnderstand');
      const base = alreadyLoaded ? chatMessages : (chatThreads[tid]?.messages || []);
      sendChatMessage(questionId, [...base, { role: 'user', content: initialMsg }], userAnswer, q);
    }
    setChatOpen(true);
  };

  const sendChatMessage = async (questionId?: string, existingMessages?: { role: 'user' | 'assistant'; content: string }[], userAnswer?: string, question?: Question | null) => {
    const qId = questionId || chatQuestionId;
    const uAns = userAnswer !== undefined ? userAnswer : chatUserAnswer;
    const qObj = question !== undefined ? question : (chatQuestionObj || shuffledQuestions.find(x => x.id === qId) || null);

    let newMsgs: { role: 'user' | 'assistant'; content: string }[];

    if (existingMessages) {
      // Initial auto-message from openChat - show it in the chat UI
      newMsgs = existingMessages;
      setChatMessages(existingMessages);
    } else {
      // User typed a message
      if (!chatInput.trim()) return;
      const userMsg = { role: 'user' as const, content: chatInput };
      newMsgs = [...chatMessages, userMsg];
      setChatMessages(newMsgs);
      setChatInput('');
    }

    setChatLoading(true);

    try {
      const result = await api.chat(qId, newMsgs, uAns, buildQuestionContext(qObj));
      if (result.response) {
        const assistantMsg = { role: 'assistant' as const, content: result.response };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else if (result.rateLimited) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: t('aiBusy') }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: result.error || t('aiError') }]);
      }
    } catch (e: any) {
      console.error('Chat error:', e);
      const errMsg = e?.message || '';
      if (errMsg.includes('429') || errMsg.includes('rate') || errMsg.includes('Too many')) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: t('aiBusy') }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: t('aiError') }]);
      }
    }
    setChatLoading(false);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  // ---------- Group chat (everyone taking this test) ----------
  const closeGroupChat = () => {
    setGroupOpen(false);
    setGroupMessages([]);
    setGroupInput('');
  };

  const openGroupChat = () => {
    setGroupOpen(true);
    setFilesOpen(false);
    setEditOpen(false);
    if (chatOpen) closeChat();
  };

  // Poll the group chat while the panel is open (serverless-safe, no WebSockets)
  useEffect(() => {
    if (!groupOpen || !currentTest) return;
    let stop = false;
    const poll = async () => {
      try {
        const msgs = await api.getGroupMessages(currentTest.id);
        if (!stop && Array.isArray(msgs)) setGroupMessages(msgs);
      } catch { /* transient network errors are fine — next tick retries */ }
    };
    poll();
    const timer = setInterval(poll, 4000);
    return () => { stop = true; clearInterval(timer); };
  }, [groupOpen, currentTest]);

  // Auto-scroll group chat to bottom on new messages
  useEffect(() => {
    if (groupOpen && groupEndRef.current) {
      groupEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [groupMessages, groupOpen]);

  const sendGroupMessage = async () => {
    if (!currentTest || !groupInput.trim() || groupSending) return;
    const text = groupInput.trim();
    setGroupInput('');
    setGroupSending(true);
    try {
      const saved = await api.sendGroupMessage(currentTest.id, text);
      setGroupMessages(prev => (prev.some(m => m.id === saved.id) ? prev : [...prev, saved]));
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to send message', variant: 'destructive' });
      setGroupInput(text); // restore the typed text so nothing is lost
    }
    setGroupSending(false);
  };

  const submitTest = async () => {
    if (!currentAttempt || !currentTest) return;

    const answerData = shuffledQuestions.map(q => {
      const selected = answers[q.id || ''] || '';
      return {
        questionId: q.id,
        selectedAnswer: selected,
        isCorrect: selected === q.correctAnswer,
      };
    });

    setLoading(true);
    try {
      await api.updateAttempt(currentAttempt.id, {
        answers: answerData,
        completed: true,
      });
      // Attempt submitted — the saved "continue" progress is no longer needed
      clearTestProgress(progressUserId, currentTest.id);
      setSavedProgress(null);
      setShowResult(true);
      toast({ title: t('testCompleted'), description: t('answersSubmitted') });

      // Load explanations for the review section
      try {
        const ids = shuffledQuestions.map(q => q.id).filter(Boolean) as string[];
        if (ids.length > 0) {
          const result = await api.generateExplanations(ids, lang);
          const explMap: Record<string, string> = {};
          if (result.explanations) {
            for (const item of result.explanations) {
              if (item.explanation) explMap[item.id] = item.explanation;
            }
          }
          setExplanations(explMap);
        }
      } catch (e) {
        console.error('Failed to load explanations for review:', e);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const getScore = () => {
    return shuffledQuestions.filter(q => answers[q.id || ''] === q.correctAnswer).length;
  };

  const goHome = () => {
    setPage('dashboard');
    setCurrentTest(null);
    setCurrentAttempt(null);
  };

  // =================== RENDER ===================

  // BOOT SPLASH — covers the auth / empty-dashboard flash while the session restores
  if (booting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background screen-enter">
        <div className="w-20 h-20 bg-cta rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
          <FlaskConical className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mt-5 mb-8">ChemTest</h1>
        <div className="w-7 h-7 rounded-full border-4 border-black/10 border-t-cta animate-spin" />
      </div>
    );
  }

  // AUTH PAGE (view extracted to src/components/pages/auth-view.tsx)
  if (effectivePage === 'auth') {
    return (
      <AuthView
        authMode={authMode}
        setAuthMode={setAuthMode}
        name={name}
        email={email}
        password={password}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        handleAuth={handleAuth}
        t={t}
      />
    );
  }

  // Round avatar initials for the dashboard header
  const userName = effectiveUser?.name || effectiveUser?.email || '';
  const userInitials = (() => {
    const parts = userName.trim().split(/\s+/).filter(Boolean);
    const s = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : userName.slice(0, 2);
    return (s || '?').toUpperCase();
  })();

  // Share a test via the native share sheet — Android: app chooser,
  // Windows: share flyout, fallback: copy to clipboard.
  // scope 'link'      → direct link to that test (works even for private ones)
  // scope 'community' → invite text + the creator's own private test goes public
  const doShare = async (test: Test | null, scope: 'link' | 'community') => {
    const community = scope === 'community';
    const origin = window.location.origin;
    const url = community || !test ? origin : `${origin}/?test=${test.id}`;
    const text = community
      ? t('shareTextCommunity')
      : (test ? t('shareTextTest', { title: test.title }) : t('shareTextCommunity'));
    setShareBusy(true);
    try {
      // The share buttons double as a MODE SWITCH for the creator's own test:
      // whichever option is tapped is SAVED as the test's publication variant
      // (link-only hides it from the community feed; community makes it public).
      if (test && effectiveUser && test.creatorId === effectiveUser.id) {
        try {
          const r = await api.shareTest(test.id, scope);
          if (r && typeof r.isPublic === 'boolean' && r.isPublic !== test.isPublic) {
            setTests(prev => prev.map(x => (x.id === test.id ? { ...x, isPublic: r.isPublic } : x)));
            toast({ title: r.isPublic ? t('shareMadePublic') : t('shareMadeLink') });
          }
        } catch (e: any) {
          // Publishing rule: the community flip requires a unique public title
          if (e?.message === 'PUBLISH_NAME_TAKEN') {
            toast({ title: t('error'), description: t('publishNameTaken'), variant: 'destructive' });
          }
          /* other visibility-flip failures stay best-effort */
        }
      }
      if (typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function') {
        await (navigator as any).share({ title: test?.title || 'UUU', text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: t('linkCopied') });
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        try { await navigator.clipboard.writeText(url); toast({ title: t('linkCopied') }); } catch {}
      }
    } finally {
      setShareBusy(false);
    }
  };

  // Jump to a test from the search dropdown: scroll to it if already loaded,
  // otherwise fetch the full test and pin it to the top (same as deep-link)
  const jumpToTest = (id: string) => {
    pendingFilesJumpRef.current = null;
    if (filesFeedMode) setFilesFeedMode(false);
    // Leaving the grid files view (if open) — the search jump goes to the test itself
    setGridFilesMode(false); setGridFilesTestId(null);
    setDashSearch(''); setDashSearchResults(null); setDashTagInfo(null); setDashSearchOpen(false);
    // From the grid views a search result opens the swipe feed with a back
    // button that returns to the grid at its remembered scroll position
    if (dashView === 'library' || dashView === 'shelf') {
      libReturnViewRef.current = dashView;
      gridScrollTopRef.current = dashFeedRef.current?.scrollTop || 0;
      setDashView('tiktok2');
    }
    const idx = tests.findIndex(x => x.id === id);
    const go = (i: number) => { setDashTestIdx(i); scrollDashTo(i); };
    if (idx >= 0) { go(idx); return; }
    api.getTest(id).then((full: Test) => {
      seenIdsRef.current.add(full.id);
      setTests(prev => (prev.some(x => x.id === full.id) ? prev : [full, ...prev]));
      go(0);
    }).catch(() => {});
  };

  // Flip the feed to files mode: the feed shows the files of the tapped test
  // (per-test files card — every attachment of THIS test in one scrollable
  // card). The header/bottom bar stay untouched; the on-card control exits.
  const openFilesCard = (test: Test) => {
    pendingFilesJumpRef.current = test.id;
    setDashSearch(''); setDashSearchResults(null); setDashTagInfo(null); setDashSearchOpen(false);
    setFilesFeedTestId(test.id);
    setFilesFeedMode(true);
    // Make sure this test's attachments are actually loaded (the list payload
    // only carries the attachment COUNT)
    if (!dashFetchedRef.current.has(test.id)) {
      dashFetchedRef.current.add(test.id);
      api.getTest(test.id)
        .then((full: Test) => setDashFullTests(prev => ({ ...prev, [test.id]: full })))
        .catch(() => { dashFetchedRef.current.delete(test.id); });
    }
  };
  // Back to the regular test card of the test whose files are on screen
  const closeFilesCard = () => {
    const cur = fileSlides[Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlides.length - 1))];
    const tid = cur?.test.id;
    pendingFilesJumpRef.current = null;
    setFilesFeedMode(false);
    setFilesFeedTestId(null);
    setDashSlideIdx(0);
    setDashSearch(''); setDashSearchResults(null); setDashTagInfo(null); setDashSearchOpen(false);
    if (tid) {
      const idx = tests.findIndex(x => x.id === tid);
      if (idx >= 0) { setDashTestIdx(idx); scrollDashTo(idx); }
    }
  };
  // Files mode is a persistent dashboard state: it survives view switches
  // (the presentation converts between the feed and the grid) and content-
  // mode switches. This is the single "off" switch for it.
  const exitFilesMode = () => {
    pendingFilesJumpRef.current = null;
    setFilesFeedMode(false);
    setFilesFeedTestId(null);
    setGridFilesMode(false);
    setGridFilesTestId(null);
    const top = gridScrollTopRef.current;
    if (top > 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const el = dashFeedRef.current;
        if (el && el.clientHeight > 0) el.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      }));
    }
  };

  // View switcher: TikTok swipe feed / Library shelves (3 cards per shelf) /
  // Shelf view (1 card per shelf). Files mode SURVIVES the switch — only its
  // presentation changes (grid ⇄ feed) for the same source test.
  const switchDashView = (v: 'tiktok1' | 'library' | 'shelf') => {
    if (v === dashView) return;
    const filesId = filesFeedTestId || gridFilesTestId;
    if (v === 'tiktok1') {
      if (filesFeedMode) { pendingFilesJumpRef.current = null; setDashSlideIdx(0); }
      else if (gridFilesMode && filesId) {
        // grid → feed: keep showing the SAME test's files as a feed slide
        setGridFilesMode(false); setGridFilesTestId(null);
        setFilesFeedTestId(filesId); setFilesFeedMode(true);
        pendingFilesJumpRef.current = filesId;
      }
      setDashView('tiktok1');
    } else {
      if (filesFeedMode) {
        pendingFilesJumpRef.current = null;
        setFilesFeedMode(false); setFilesFeedTestId(null);
        setDashSlideIdx(0);
        if (filesId) { setGridFilesTestId(filesId); setGridFilesMode(true); } // feed → grid
      }
      setDashView(v);
    }
  };
  // View button cycles the three layouts (like the language button cycles
  // EN → RU → UZ): TikTok feed → Library → Shelf → TikTok feed …
  const cycleDashView = () => {
    const order: Array<'tiktok1' | 'library' | 'shelf'> = ['tiktok1', 'library', 'shelf'];
    const cur = dashView === 'tiktok2' ? 'tiktok1' : dashView;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    switchDashView(next);
  };

  // Account button: one tap switches the dashboard between the two content
  // modes — personal library (own tests + bookmarks) and discover (public
  // tests from other authors). The badge icon on the avatar shows the mode.
  const toggleDiscoverMode = () => {
    // Leaving another user's library always lands in the viewer's own library
    setViewingUser(null);
    const next = !discoverModeRef.current;
    discoverModeRef.current = next; // update BEFORE the async reload picks its scope
    setDiscoverMode(next);
    // Reset feed positions: the new mode starts from its own top card.
    // Files mode intentionally SURVIVES the switch — only the list of tests
    // behind it changes.
    setDashTestIdx(0); setDashSlideIdx(0);
    setFilesFeedMode(false); setFilesFeedTestId(null); pendingFilesJumpRef.current = null;
    setShareScopeByTest({});
    loadFeedRef.current().catch(() => {});
  };

  // --- Another user's library (opened from their profile photo / chat avatar)
  // The dashboard swaps its test list for that user's public tests; every card
  // shows their name + photo; the header back arrow returns to the own feed.
  const openUserLibrary = async (u: { id: string; name?: string; image?: string | null }) => {
    if (!u.id || !effectiveUser || u.id === effectiveUser.id) return; // own profile → own library
    if (viewingUserRef.current && viewingUser?.id === u.id) return;   // already there
    pendingFilesJumpRef.current = null;
    setFilesFeedMode(false); setFilesFeedTestId(null);
    setGridFilesMode(false); setGridFilesTestId(null);
    // Close any open bottom sheet (group chat / AI tutor / files / editor):
    // the tap happened INSIDE one of them and the dashboard is changing scope
    setGroupOpen(false);
    setChatOpen(false); setChatMessages([]); setChatQuestionId(''); setChatQuestionObj(null); setChatThreadId('');
    setFilesOpen(false);
    setEditOpen(false);
    setViewingUser({ id: u.id, name: u.name || 'User', image: u.image || null });
    setViewingLoading(true);
    try {
      const theirs: Test[] = await api.getTests(u.id); // public-only (server enforces)
      seenIdsRef.current = new Set(theirs.map(x => x.id));
      feedCursorRef.current = null;
      feedHasMoreRef.current = false;
      setFeedHasMore(false);
      setTests(theirs);
      setDashTestIdx(0); setDashSlideIdx(0);
      setShareScopeByTest({});
      requestAnimationFrame(() => { const el = dashFeedRef.current; if (el) el.scrollTop = 0; });
    } catch {
      toast({ title: t('error'), variant: 'destructive' });
    } finally {
      setViewingLoading(false);
    }
  };
  const closeUserLibrary = () => {
    if (!viewingUserRef.current) return;
    setViewingUser(null);
    pendingFilesJumpRef.current = null;
    setFilesFeedMode(false); setFilesFeedTestId(null);
    setGridFilesMode(false); setGridFilesTestId(null);
    loadFeedRef.current().catch(() => {});
  };

  // Bookmark toggle (the bookmark button lives on the cards in Discover mode):
  // bookmarked tests join the user's personal library next to their own tests.
  const toggleBookmark = async (test: Test) => {
    const has = bookmarkIds.has(test.id);
    // Optimistic flip — revert on failure
    setBookmarkIds(prev => {
      const n = new Set(prev);
      if (has) n.delete(test.id); else n.add(test.id);
      return n;
    });
    try {
      if (has) await api.removeBookmark(test.id); else await api.addBookmark(test.id);
      toast({ title: has ? t('bookmarkRemoved') : t('bookmarkAdded') });
      // Refresh the list quietly: a removed bookmark drops out of the library
      // view, a new one will be visible when switching back to the library.
      loadFeedRef.current().catch(() => {});
    } catch (e: any) {
      setBookmarkIds(prev => {
        const n = new Set(prev);
        if (has) n.add(test.id); else n.delete(test.id);
        return n;
      });
      toast({ title: t('error'), description: e.message, variant: 'destructive' });
    }
  };

  // A card in library/shelf opens the swipe feed at that test (tiktok2 = feed
  // with a back button that returns to the grid at its scroll position)
  const openFromLibrary = (idx: number) => {
    libReturnViewRef.current = dashView === 'shelf' ? 'shelf' : 'library';
    gridScrollTopRef.current = dashFeedRef.current?.scrollTop || 0;
    if (filesFeedMode) { pendingFilesJumpRef.current = null; setFilesFeedMode(false); setFilesFeedTestId(null); setDashSlideIdx(0); }
    setDashTestIdx(idx);
    setDashView('tiktok2');
    scrollDashTo(idx);
  };
  // The per-card paperclip on a grid card: the SAME grid view (library or
  // shelf) keeps its layout but shows the ATTACHED-FILES cards of this test
  // instead of the test cards. Tapping the paperclip of the SAME test again
  // returns to the test cards; «К тестам» on a files card does the same.
  const openGridFiles = (test: Test) => {
    gridScrollTopRef.current = dashFeedRef.current?.scrollTop || 0;
    setGridFilesTestId(test.id);
    setGridFilesMode(true);
    // Make sure the attachments are actually loaded (the list payload only
    // carries the attachment COUNT)
    if (!dashFetchedRef.current.has(test.id)) {
      dashFetchedRef.current.add(test.id);
      api.getTest(test.id)
        .then((full: Test) => setDashFullTests(prev => ({ ...prev, [test.id]: full })))
        .catch(() => { dashFetchedRef.current.delete(test.id); });
    }
  };
  const toggleGridFiles = (test: Test) => {
    if (gridFilesMode && gridFilesTestId === test.id) closeGridFiles();
    else openGridFiles(test);
  };
  const closeGridFiles = () => {
    setGridFilesMode(false);
    setGridFilesTestId(null);
    const top = gridScrollTopRef.current;
    if (top > 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const el = dashFeedRef.current;
        if (el && el.clientHeight > 0) el.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      }));
    }
  };
  const backToLibrary = () => {
    // Leaving the files feed back to the grid also resets files mode
    if (filesFeedModeRef.current) {
      pendingFilesJumpRef.current = null;
      setFilesFeedMode(false);
      setDashSlideIdx(0);
    }
    const target = libReturnViewRef.current === 'shelf' ? 'shelf' : 'library';
    const top = gridScrollTopRef.current;
    setDashView(target);
    if (top > 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const el = dashFeedRef.current;
        if (el && el.clientHeight > 0) el.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      }));
    }
  };

  // PROFILE PAGE (view extracted to src/components/pages/profile-view.tsx)
  if (effectivePage === 'profile') {
    return (
      <ProfileView
        effectiveUser={effectiveUser}
        myAvatar={myAvatar}
        userInitials={userInitials}
        myBgStyle={myBgStyle}
        avatarBusy={avatarBusy}
        avatarInputRef={avatarInputRef}
        handleAvatarFile={handleAvatarFile}
        profileName={profileName}
        setProfileName={setProfileName}
        profileSaving={profileSaving}
        saveProfileName={saveProfileName}
        saveBgStyle={saveBgStyle}
        handleLogout={handleLogout}
        handleDeleteAccount={handleDeleteAccount}
        accBusy={accBusy}
        deleteAccOpen={deleteAccOpen}
        setDeleteAccOpen={setDeleteAccOpen}
        setPage={setPage}
        t={t}
      />
    );
  }

  const editorBody = (
    <>
          <Card className="rounded-4xl border border-black bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setEditorInfoExpanded(v => !v)}
              className="w-full flex items-center gap-1.5 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-base">{t('testInformation')}</span>
              {editorInfoExpanded ? (
                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
            <Collapse open={editorInfoExpanded} className="pt-0">
            <CardContent className="space-y-4 !pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('testTitle')}</Label>
                  <Input value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder={t('testTitlePh')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('tags')}</Label>
                  <div className="relative">
                    <div
                      className="flex flex-wrap items-center gap-1.5 min-h-[42px] w-full rounded-md border border-input bg-transparent px-2 py-1.5 text-sm cursor-text"
                      onClick={() => document.getElementById('tag-input-field')?.focus()}
                    >
                      {testTags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#FFF0D9] border border-black/15 px-2 py-0.5 text-xs font-medium">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove tag ${tag}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        id="tag-input-field"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onFocus={() => {
                          setTagsOpen(true);
                          api.getTags().then(setAllTags).catch(() => {});
                        }}
                        onBlur={() => setTimeout(() => setTagsOpen(false), 150)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
                            e.preventDefault();
                            addTag(tagInput);
                          } else if (e.key === 'Backspace' && !tagInput && testTags.length > 0) {
                            setTestTags(testTags.slice(0, -1));
                          }
                        }}
                        placeholder={testTags.length === 0 ? t('tagPh') : ''}
                        className="flex-1 min-w-[7rem] bg-transparent outline-none text-sm py-1"
                      />
                    </div>
                    {tagsOpen && tagSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-black/10 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                        {tagSuggestions.map(t => (
                          <button
                            key={t}
                            type="button"
                            onMouseDown={e => { e.preventDefault(); addTag(t); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                          >
                            <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{t('tagHint')}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('description')}</Label>
                <Textarea value={testDescription} onChange={e => setTestDescription(e.target.value)} placeholder={t('descriptionPh')} rows={2} />
              </div>
              {/* Publication variant — the SAME option-card style as the share
              selector on the test card. The choice is SAVED with the test and
              applies to the test AND its attached files: «Только по ссылке» keeps
              it out of the community feed (link opens it for anyone who has it),
              «Всему сообществу» makes test + files public. */}
              <div className="space-y-2">
                <Label>{t('publishVariant')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestIsPublic(false)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                      !testIsPublic
                        ? 'border-primary bg-[#FFE8DE] shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link2 className="w-4 h-4 text-cta shrink-0" />
                      <span className="font-semibold text-sm">{t('shareOptLink')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('shareOptLinkSub')}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestIsPublic(true)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left ${
                      testIsPublic
                        ? 'border-primary bg-[#FFE8DE] shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-sm">{t('shareOptCommunity')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('shareOptCommunitySub')}</p>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{t('publishNote')}</p>
              </div>
            </CardContent>
            </Collapse>
          </Card>

          {/* Attached files — collapsed to one line by default, same expand/collapse as the test card */}
          <Card className="rounded-4xl border border-black bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setEditorFilesExpanded(v => !v)}
              className="w-full flex items-center gap-1.5 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <Paperclip className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-base">{t('attachedFiles', { n: formAttachments.length })}</span>
              {editorFilesExpanded ? (
                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
            <Collapse open={editorFilesExpanded} keepMountedOnceShown>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  {t('editorFilesHint')}
                </p>
                <AttachmentsEditor items={formAttachments} onChange={setFormAttachments} />
              </CardContent>
            </Collapse>
          </Card>

          {/* Cover customization: science icon pack + card color */}
          <Card className="rounded-4xl border border-black bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setEditorCoverExpanded(v => !v)}
              className="w-full flex items-center gap-1.5 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-base">{t('cover')}</span>
              {editorCoverExpanded ? (
                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
            <Collapse open={editorCoverExpanded}>
            <CardContent className="space-y-4 !pt-0">
              <p className="text-xs text-muted-foreground">
                {t('coverHint')}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t('cardColor')}</Label>
                  <button
                    type="button"
                    onClick={() => setTestCoverColor('')}
                    title={t('autoIcon')}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border-2 transition-all ${
                      testCoverColor === '' ? 'border-cta bg-[#FFF0D9] text-cta font-semibold' : 'border-black/10 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {t('auto')}
                  </button>
                </div>
                <PhotoshopColorPicker value={testCoverColor || '#E3EEFF'} onChange={setTestCoverColor} />
              </div>
            </CardContent>
            </Collapse>
          </Card>

          <Card className="rounded-4xl border border-black bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setEditorQuestionsExpanded(v => !v)}
              className="w-full flex items-center gap-1.5 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <ListChecks className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-base">{t('questionsN', { n: questions.length })}</span>
              {editorQuestionsExpanded ? (
                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
            <Collapse open={editorQuestionsExpanded} keepMountedOnceShown>
            <CardContent className="!pt-0">
              <div className="flex justify-end gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => setQuestions(shuffleArray(questions))}>
                  <Shuffle className="w-3 h-3 mr-1" /> {t('shuffleAll')}
                </Button>
                <Button size="sm" onClick={addQuestion}>
                  <Plus className="w-3 h-3 mr-1" /> {t('addQuestion')}
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <Card key={idx} className="rounded-3xl border border-black bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{t('questionN', { n: idx + 1 })}</Badge>
                        <Button variant="ghost" size="sm" className="text-destructive h-7 w-7 p-0" onClick={() => removeQuestion(idx)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea value={q.text} onChange={e => updateQuestion(idx, 'text', e.target.value)} placeholder={t('questionTextPh')} rows={2} />
                      {/* Question photo — uploaded to the Telegram channel, shown
                      above the answers when taking the test */}
                      <div className="flex items-center gap-2">
                        <label
                          className={`h-7 rounded-full border px-2.5 text-xs flex items-center gap-1.5 cursor-pointer select-none ${photoBusy === `q-${idx}` ? 'border-primary bg-[#FFE8DE] text-primary' : 'border-black hover:bg-muted/50'}`}
                          title={t('qPhotoTip')}
                        >
                          {photoBusy === `q-${idx}`
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <ImagePlus className="w-3.5 h-3.5" />}
                          <span className="truncate">{q.imageUrl ? t('changePhoto') : t('addPhoto')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onClick={e => { (e.target as HTMLInputElement).value = ''; }}
                            onChange={e => pickQuestionPhoto(idx, e.target.files?.[0])}
                          />
                        </label>
                        {q.imageUrl && (
                          <>
                            <span className="h-9 w-14 rounded-lg overflow-hidden border border-black/15 shrink-0">
                              <img src={imgSrc(q.imageUrl)} alt="" className="w-full h-full object-cover" />
                            </span>
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-destructive shrink-0"
                              onClick={() => clearQuestionPhoto(idx)}
                              title={t('removePhoto')} aria-label={t('removePhoto')}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                        {photoBusy === `q-${idx}` && <span className="text-xs text-muted-foreground truncate">{t('photoUploading')}</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['A', 'B', 'C', 'D'].map(letter => {
                          const optImg = q.optionImages?.[letter];
                          return (
                          <div key={letter} className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              q.correctAnswer === letter ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              {letter}
                            </div>
                            <Input
                              value={q[`option${letter}` as keyof Question] as string}
                              onChange={e => updateQuestion(idx, `option${letter}`, e.target.value)}
                              placeholder={t('optionL', { letter })}
                              className="text-sm"
                            />
                            {/* Option photo chip: empty → plus tile opens the picker;
                            set → live thumbnail (click replaces) + red dot removes */}
                            <span className="relative shrink-0" title={t('oPhotoTip', { letter })}>
                              <label
                                className={`block w-8 h-8 rounded-lg overflow-hidden cursor-pointer ${photoBusy === `o-${idx}-${letter}` ? 'ring-2 ring-primary' : 'ring-1 ring-black/15'}`}
                              >
                                {optImg ? (
                                  <img src={imgSrc(optImg.u)} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className={`w-full h-full flex items-center justify-center ${photoBusy === `o-${idx}-${letter}` ? 'bg-[#FFE8DE]' : 'bg-muted'}`}>
                                    {photoBusy === `o-${idx}-${letter}`
                                      ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                      : <ImagePlus className="w-3.5 h-3.5 text-muted-foreground" />}
                                  </span>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onClick={e => { (e.target as HTMLInputElement).value = ''; }}
                                  onChange={e => pickOptionPhoto(idx, letter, e.target.files?.[0])}
                                />
                              </label>
                              {optImg && (
                                <button
                                  type="button"
                                  onClick={() => clearOptionPhoto(idx, letter)}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center shadow"
                                  title={t('removePhoto')} aria-label={t('removePhoto')}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </span>
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={q.correctAnswer === letter}
                              onChange={() => updateQuestion(idx, 'correctAnswer', letter)}
                              className="shrink-0 accent-[#fe5933]"
                              title={t('markCorrect')}
                            />
                          </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            </Collapse>
          </Card>
    </>
  );

  // DASHBOARD (view extracted to src/components/pages/dashboard-view.tsx)
  if (effectivePage === 'dashboard') {
    return (
      <DashboardView
        effectivePage={effectivePage}
        dashFullTests={dashFullTests}
        bookmarkIds={bookmarkIds}
        shareScopeByTest={shareScopeByTest}
        setShareScopeByTest={setShareScopeByTest}
        page={page}
        deadLink={deadLink}
        t={t}
        setDeadLink={setDeadLink}
        tests={tests}
        dashTestIdx={dashTestIdx}
        progressUserId={progressUserId}
        dashView={dashView}
        libNarrow={libNarrow}
        gridFilesMode={gridFilesMode}
        gridFilesTestId={gridFilesTestId}
        dashSearch={dashSearch}
        dashSearching={dashSearching}
        loading={loading || bootRefreshing}
        dashTagInfo={dashTagInfo}
        setDashSearch={setDashSearch}
        dashSearchResults={dashSearchResults}
        jumpToTest={jumpToTest}
        questions={questions}
        dashSearchOpen={dashSearchOpen}
        setDashSearchOpen={setDashSearchOpen}
        viewingUser={viewingUser}
        closeUserLibrary={closeUserLibrary}
        closeGridFiles={closeGridFiles}
        filesFeedMode={filesFeedMode}
        closeFilesCard={closeFilesCard}
        backToLibrary={backToLibrary}
        user={user}
        name={name}
        startCreateTest={startCreateTest}
        setEditMode={setEditMode}
        editMode={editMode}
        cycleDashView={cycleDashView}
        lang={lang}
        cycleLang={cycleLang}
        effectiveUser={effectiveUser}
        email={email}
        toggleDiscoverMode={toggleDiscoverMode}
        discoverMode={discoverMode}
        setPage={setPage}
        myAvatar={myAvatar}
        userInitials={userInitials}
        viewingLoading={viewingLoading}
        dashFeedRef={dashFeedRef}
        exitFilesMode={exitFilesMode}
        startEditTest={startEditTest}
        openFromLibrary={openFromLibrary}
        toggleBookmark={toggleBookmark}
        openUserLibrary={openUserLibrary}
        setDashTestIdx={setDashTestIdx}
        startFromDashboard={startFromDashboard}
        toggleGridFiles={toggleGridFiles}
        shareBusy={shareBusy}
        doShare={doShare}
        setDeleteId={setDeleteId}
        feedSentinelRef={feedSentinelRef}
        onDashScroll={onDashScroll}
        onDashTouchStart={onDashTouchStart}
        onDashTouchEnd={onDashTouchEnd}
        onDashWheel={onDashWheel}
        fileSlides={fileSlides}
        filesFeedTestId={filesFeedTestId}
        setSelectedQuestionCount={setSelectedQuestionCount}
        selectedQuestionCount={selectedQuestionCount}
        setPracticeMode={setPracticeMode}
        practiceMode={practiceMode}
        setStartRandomizeQ={setStartRandomizeQ}
        startRandomizeQ={startRandomizeQ}
        setStartRandomizeO={setStartRandomizeO}
        startRandomizeO={startRandomizeO}
        openFilesCard={openFilesCard}
        shuffledQuestions={shuffledQuestions}
        deleteId={deleteId}
        handleDeleteTest={handleDeleteTest}
        editorBody={editorBody}
        setEditorInfoExpanded={setEditorInfoExpanded}
        editorInfoExpanded={editorInfoExpanded}
        testTitle={testTitle}
        setTestTitle={setTestTitle}
        testTags={testTags}
        removeTag={removeTag}
        tagInput={tagInput}
        setTagInput={setTagInput}
        setTagsOpen={setTagsOpen}
        setAllTags={setAllTags}
        addTag={addTag}
        setTestTags={setTestTags}
        tagsOpen={tagsOpen}
        tagSuggestions={tagSuggestions}
        testDescription={testDescription}
        setTestDescription={setTestDescription}
        setTestIsPublic={setTestIsPublic}
        testIsPublic={testIsPublic}
        setEditorFilesExpanded={setEditorFilesExpanded}
        formAttachments={formAttachments}
        editorFilesExpanded={editorFilesExpanded}
        setFormAttachments={setFormAttachments}
        setEditorCoverExpanded={setEditorCoverExpanded}
        editorCoverExpanded={editorCoverExpanded}
        setTestCoverColor={setTestCoverColor}
        testCoverColor={testCoverColor}
        setEditorQuestionsExpanded={setEditorQuestionsExpanded}
        editorQuestionsExpanded={editorQuestionsExpanded}
        setQuestions={setQuestions}
        addQuestion={addQuestion}
        removeQuestion={removeQuestion}
        updateQuestion={updateQuestion}
        photoBusy={photoBusy}
        pickQuestionPhoto={pickQuestionPhoto}
        clearQuestionPhoto={clearQuestionPhoto}
        pickOptionPhoto={pickOptionPhoto}
        clearOptionPhoto={clearOptionPhoto}
      />
    );
  }

  // CREATE / EDIT TEST (view extracted to src/components/pages/create-edit-view.tsx)
  if (effectivePage === 'create-test' || effectivePage === 'edit-test') {
    return (
      <CreateEditView
        editingTestId={editingTestId}
        editorBody={editorBody}
        handleSaveTest={handleSaveTest}
        loading={loading}
        goHome={goHome}
        t={t}
      />
    );
  }

  // START TEST (view extracted to src/components/pages/start-test-view.tsx)
  if (effectivePage === 'start-test' && currentTest) {
    return (
      <StartTestView
        currentTest={currentTest}
        myBgStyle={myBgStyle}
        selectedQuestionCount={selectedQuestionCount}
        setSelectedQuestionCount={setSelectedQuestionCount}
        practiceMode={practiceMode}
        setPracticeMode={setPracticeMode}
        startRandomizeQ={startRandomizeQ}
        setStartRandomizeQ={setStartRandomizeQ}
        startRandomizeO={startRandomizeO}
        setStartRandomizeO={setStartRandomizeO}
        startFilesExpanded={startFilesExpanded}
        setStartFilesExpanded={setStartFilesExpanded}
        savedProgress={savedProgress}
        startTest={startTest}
        continueTestWith={continueTestWith}
        loading={loading}
        goHome={goHome}
        t={t}
      />
    );
  }

  // TAKE TEST + RESULTS (view extracted to src/components/pages/take-test-view.tsx)
  if (effectivePage === 'take-test' && shuffledQuestions.length > 0) {
    return (
      <TakeTestView
        effectivePage={effectivePage}
        answers={answers}
        revealedAnswers={revealedAnswers}
        explanations={explanations}
        shuffledQuestions={shuffledQuestions}
        currentQuestionIdx={currentQuestionIdx}
        setCurrentQuestionIdx={setCurrentQuestionIdx}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        setChatMessages={setChatMessages}
        setChatQuestionId={setChatQuestionId}
        setChatQuestionObj={setChatQuestionObj}
        setChatThreadId={setChatThreadId}
        questions={questions}
        qSearch={qSearch}
        lang={lang}
        t={t}
        setQSearch={setQSearch}
        setQSearchOpen={setQSearchOpen}
        setDrumInputMode={setDrumInputMode}
        numInputRef={numInputRef}
        drumScaleRafRef={drumScaleRafRef}
        applyDrumScales={applyDrumScales}
        drumSettleTimerRef={drumSettleTimerRef}
        drumRef={drumRef}
        drumProgrammaticRef={drumProgrammaticRef}
        takeFeedSettleTimerRef={takeFeedSettleTimerRef}
        takeFeedRef={takeFeedRef}
        takeFeedTouchUntilRef={takeFeedTouchUntilRef}
        showResult={showResult}
        getScore={getScore}
        resSearch={resSearch}
        setResSearch={setResSearch}
        setResHighlightIdx={setResHighlightIdx}
        currentTest={currentTest}
        filesOpen={filesOpen}
        groupOpen={groupOpen}
        editOpen={editOpen}
        setFilesOpen={setFilesOpen}
        setGroupOpen={setGroupOpen}
        setEditOpen={setEditOpen}
        openChat={openChat}
        startEditTestInTake={startEditTestInTake}
        myBgStyle={myBgStyle}
        autoTranslating={autoTranslating}
        goHome={goHome}
        closeChat={closeChat}
        cycleDashView={cycleDashView}
        dashView={dashView}
        cycleLang={cycleLang}
        openGroupChat={openGroupChat}
        libNarrow={libNarrow}
        resHighlightIdx={resHighlightIdx}
        loading={loading}
        chatMessages={chatMessages}
        chatLoading={chatLoading}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendChatMessage={sendChatMessage}
        chatEndRef={chatEndRef}
        chatHistoryOpen={chatHistoryOpen}
        setChatHistoryOpen={setChatHistoryOpen}
        aiThreadMetas={aiThreadMetas}
        chatThreadId={chatThreadId}
        selectChatThread={selectChatThread}
        closeGroupChat={closeGroupChat}
        groupMessages={groupMessages}
        effectiveUser={effectiveUser}
        groupInput={groupInput}
        setGroupInput={setGroupInput}
        sendGroupMessage={sendGroupMessage}
        groupSending={groupSending}
        groupEndRef={groupEndRef}
        openUserLibrary={openUserLibrary}
        editorBody={editorBody}
        handleSaveTest={handleSaveTest}
        openStartTest={openStartTest}
        qSearchOpen={qSearchOpen}
        page={page}
        practiceMode={practiceMode}
        selectAnswer={selectAnswer}
        submitTest={submitTest}
        loadingExplanations={loadingExplanations}
        chatUserAnswer={chatUserAnswer}
        chatQuestionId={chatQuestionId}
        drumInputMode={drumInputMode}
        drumRefCb={drumRefCb}
      />
    );
  }

  // HISTORY (view extracted to src/components/pages/history-view.tsx)
  if (effectivePage === 'history') {
    return <HistoryView attempts={attempts} goHome={goHome} t={t} />;
  }

  return null;
}
