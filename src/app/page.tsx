'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api, setUser } from '@/lib/api';
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
import { AttachmentItem, AttachmentsEditor, AttachmentsList, AttachmentsBottomSheet, AttachmentsSidePanel, typeIcon, attachmentFileUrl, formatSize } from '@/components/attachments';
import { SheetHeaderSwitcher } from '@/components/sheet-switcher';
import { AiChatPanel, GroupChatPanel } from '@/components/chat-panels';
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
  Camera,
} from 'lucide-react';
import { PhotoshopColorPicker } from '@/components/color-picker';
import { Lang, NEXT_LANG, LANG_LABEL, tUI, trText, trOption, trExpl } from '@/lib/i18n';

// localStorage key for the interface language (EN -> RU -> UZ cycle button)
const LANG_STORAGE_KEY = 'chemtest-lang';

// Language switcher button — same outline style as the other header buttons.
// Shown in the dashboard header and in the test header (instead of the old
// "Practice Mode" badge). One tap advances EN -> RU -> UZ -> EN.
function LangButton({ lang, onChange, className = '' }: { lang: Lang; onChange: () => void; className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onChange}
      title="English · Русский · Oʻzbekcha"
      className={`gap-1.5 shrink-0 rounded-full font-semibold ${className}`}
    >
      <Languages className="w-4 h-4" />
      {LANG_LABEL[lang]}
    </Button>
  );
}

// Card header for the DISCOVER mode — a distinct band across the top of the
// card: the author's photo pinned top-left, the name centered on its own
// lighter pill, and a BIG bookmark toggle on the right. Shown ONLY in
// Discover (tests of other authors); the personal library keeps cards clean.
function CreatorStrip({ name, creatorId, image, bookmarked, onToggleBookmark, addLabel, removeLabel, addShort, removeShort }: {
  name: string;
  creatorId?: string | null;
  image?: string | null;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  addLabel: string;
  removeLabel: string;
  addShort: string;
  removeShort: string;
}) {
  const initial = (name || '?').trim().slice(0, 1).toUpperCase() || '?';
  // tg: references resolve through the same-origin avatar route; data:/http
  // images render directly. Anything else → the initial-letter avatar.
  const avatarSrc = image
    ? (image.startsWith('tg:') && creatorId
        ? `/api/users/${creatorId}/avatar`
        : (image.startsWith('data:') || image.startsWith('http') ? image : null))
    : null;
  return (
    <div className="shrink-0 relative flex items-center h-11 rounded-2xl bg-[#FFE8DE] border border-black/10 pl-1 pr-1.5 shadow-sm">
      {/* Author photo — pinned top-left of the header band */}
      <span className="w-8 h-8 rounded-full overflow-hidden bg-cta text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm shrink-0" title={name}>
        {avatarSrc ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" /> : initial}
      </span>
      {/* Name centered on its own white pill (a background of its own) */}
      <span
        className="absolute left-1/2 -translate-x-1/2 max-w-[44%] px-3 py-1 rounded-full bg-white border border-black/10 shadow-sm text-[11px] font-bold text-black truncate pointer-events-none"
        title={name}
      >
        {name}
      </span>
      {/* The bookmark button — bigger and prettier: icon + short label on wide screens */}
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onToggleBookmark(); }}
        title={bookmarked ? removeLabel : addLabel}
        aria-label={bookmarked ? removeLabel : addLabel}
        className={`ml-auto shrink-0 relative z-10 h-9 min-w-9 px-2 rounded-full flex items-center justify-center gap-1 border-2 text-[11px] font-bold transition-all active:scale-90 ${
          bookmarked
            ? 'bg-primary text-white border-primary shadow-md hover:bg-primary/90'
            : 'bg-white border-black/25 text-black hover:border-black'
        }`}
      >
        {bookmarked ? <BookmarkCheck className="w-[18px] h-[18px]" /> : <BookmarkPlus className="w-[18px] h-[18px]" />}
        <span className="hidden min-[430px]:inline max-w-[92px] truncate">{bookmarked ? removeShort : addShort}</span>
      </button>
    </div>
  );
}

// Small floating pill shown while on-the-fly question translation is running
// (auto-translation only kicks in for questions with no stored translation).
function TranslatingPill({ show, label }: { show: boolean; label: string }) {
  if (!show) return null;
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-1.5 rounded-full bg-white border border-black/10 shadow-lg px-3 py-1.5 text-xs font-medium text-muted-foreground pointer-events-none">
      <Loader2 className="w-3.5 h-3.5 animate-spin text-cta" />
      {label}
    </div>
  );
}

// Types
type Page = 'auth' | 'dashboard' | 'create-test' | 'edit-test' | 'start-test' | 'take-test' | 'history';

interface Question {
  id?: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string | null;
  correctAnswer: string;
  explanation?: string | null;
  translations?: Record<string, { text?: string; options?: Record<string, string>; explanation?: string }> | null;
  orderNum?: number;
}

interface Attachment {
  id: string;
  testId: string;
  title: string;
  type: 'audio' | 'video' | 'pdf' | 'image' | 'embed' | 'link';
  url: string;
  size?: number | null;
  orderNum: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  topic: string;
  creatorId: string;
  creator?: { id: string; name: string };
  isPublic: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  tags?: string[];
  coverIcon?: string | null;
  coverColor?: string | null;
  hasCoverImage?: boolean;
  questions: Question[];
  attachments?: Attachment[];
  _count?: { questions: number; attempts: number; attachments?: number };
  createdAt: string;
}

// Cover background color per topic — shared by the cover block and the whole swipe card
function topicBgClass(topic?: string | null) {
  switch (topic) {
    case 'Physics': return 'bg-[#E3EEFF]';
    case 'Chemistry': return 'bg-[#DFF3E8]';
    case 'Mathematics': return 'bg-[#FFF0D9]';
    default: return 'bg-[#FCE8F2]';
  }
}

// Stable hash of a string (for tag-based cover styling)
function tagHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 99991;
  return h;
}

// Cover background: derived from the first tag when present (tests created
// after tags replaced topic), otherwise from the legacy topic field
function coverBgFor(test: { topic?: string | null; tags?: string[] | null }) {
  const tag = test.tags?.[0];
  if (tag) {
    const palette = ['bg-[#E3EEFF]', 'bg-[#DFF3E8]', 'bg-[#FFF0D9]', 'bg-[#FCE8F2]'];
    return palette[tagHash(tag) % palette.length];
  }
  return topicBgClass(test.topic);
}

// Per-test group chat message (see /api/tests/[id]/chat)
interface GroupMessage {
  id: string;
  testId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface Attempt {
  id: string;
  testId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  test?: { id: string; title: string; topic: string };
}

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
  return newQ as Question;
}

// Frosted-glass tile shared by the take-test bottom bar: the lens over the
// current question number AND the prev/next arrow buttons use the SAME material
// (same border, gradient and shadows), so the whole bar reads as one glass set.
const GLASS_TILE = 'rounded-xl border border-black/15 bg-gradient-to-b from-white/70 via-white/5 to-white/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.08)]';

// =================== SAVED TEST PROGRESS ("Continue Test") ===================
// While a test is being taken, its full state is persisted to localStorage per
// user+test: the exact shuffled question order, answers, practice reveals and
// position, plus the open attempt. A reload (or leaving and coming back) then
// offers "Continue Test" instead of starting over. Cleared on submit.
interface SavedTestProgress {
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

function readTestProgress(userId: string, testId: string): SavedTestProgress | null {
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

function writeTestProgress(userId: string, p: SavedTestProgress) {
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

function clearTestProgress(userId: string, testId: string) {
  const key = progressKey(userId, testId);
  try { localStorage.removeItem(key); } catch {}
  progressCache.set(key, null);
}

const countAnsweredProgress = (p: SavedTestProgress | null) =>
  p ? Object.keys(p.answers || {}).filter(k => k && p.answers[k]).length : 0;

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
  // Per-card share scope selection: exactly one of the two share buttons on a
  // card can be highlighted at a time (radio behaviour, like the mode cards).
  const [shareScopeByTest, setShareScopeByTest] = useState<Record<string, 'link' | 'community'>>({});
  // Files feed mode: the TikTok feed flips from one-slide-per-test to one-
  // slide-per-ATTACHMENT (flattened across the recommended tests). Swiping
  // runs through this test's files, then the next recommended test's files.
  // Header and bottom bar stay untouched; the paperclip button toggles back.
  const [filesFeedMode, setFilesFeedMode] = useState(false);
  const filesFeedModeRef = useRef(false);
  useEffect(() => { filesFeedModeRef.current = filesFeedMode; }, [filesFeedMode]);
  // Grid files mode (Library/Shelf): the grid KEEPS its layout but swaps the
  // test cards for the attachment cards of ONE test (the one whose paperclip
  // was tapped). The header back arrow returns to the test cards.
  const [gridFilesMode, setGridFilesMode] = useState(false);
  const [gridFilesTestId, setGridFilesTestId] = useState<string | null>(null);
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

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatQuestionId, setChatQuestionId] = useState<string>('');
  const [chatUserAnswer, setChatUserAnswer] = useState<string>('');
  const [chatQuestionObj, setChatQuestionObj] = useState<Question | null>(null);
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
    setHydratedUser(parsed);
    // Restore the session data BEFORE revealing the UI — no empty dashboard flash
    hasLoadedRef.current = true;
    Promise.all([
      loadFeedRef.current().catch(() => { hasLoadedRef.current = false; }),
      api.getAttempts().then(data => setAttempts(data)).catch(() => {}),
    ]).finally(() => setBooting(false));
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
    } catch {
      // keep the previous list on transient errors
    }
  }, []);

  // Stable handle for code that runs before/without re-render (boot, login)
  const loadFeedRef = useRef(loadFeed);
  loadFeedRef.current = loadFeed;

  // Next pages, appended silently when the user approaches the end of the feed
  const loadMoreFeed = useCallback(async (): Promise<void> => {
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
    }).catch(() => { cleanUrl(); });
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
  // one slide per attachment, in recommendation order (tests without files
  // are skipped — the swipe flows from this test's files to the next test's).
  // A test's slides join ONLY once every earlier loaded test is fetched too,
  // so resolving fetches APPEND slides and never shift the visible position.
  const fileSlides = React.useMemo(() => {
    if (!filesFeedMode) return [] as { test: Test; file: AttachmentItem; count: number; fIdx: number }[];
    const out: { test: Test; file: AttachmentItem; count: number; fIdx: number }[] = [];
    for (const t of tests) {
      const full = dashFullTests[t.id];
      if (!full) break; // earlier test's attachments still loading — stop here
      const fl = ((full.attachments ?? []) as AttachmentItem[]).filter(Boolean);
      fl.forEach((f, i) => out.push({ test: t, file: f, count: fl.length, fIdx: i }));
    }
    return out;
  }, [filesFeedMode, tests, dashFullTests]);
  const fileSlidesRef = useRef<{ test: Test; file: AttachmentItem; count: number; fIdx: number }[]>([]);
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
        id: q.id,
      })));
      setFormAttachments((fullTest.attachments || []).map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        url: a.url,
        size: a.size ?? null,
        orderNum: a.orderNum,
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
            id: q.id,
          })));
          setFormAttachments((copy.attachments || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            url: a.url,
            size: a.size ?? null,
            orderNum: a.orderNum,
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
          orderNum: i,
        })),
        attachments: formAttachments.map((a, i) => ({
          title: a.title,
          type: a.type,
          url: a.url,
          size: a.size ?? null,
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
      toast({ title: 'Deleted', description: 'Test deleted successfully.' });
      await loadTests();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
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
        translations: { ...(fresh.translations || {}), ...(q.translations || {}) } || null,
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

  const openChat = (questionId: string, userAnswer?: string, opts?: { force?: boolean }) => {
    const q = shuffledQuestions.find(x => x.id === questionId) || null;
    // Reset chat if it's a different question, or when explicitly forced
    if (opts?.force || chatQuestionId !== questionId) {
      setChatMessages([]);
      setChatInput('');
      setChatQuestionId(questionId);
      setChatQuestionObj(q);
      setChatUserAnswer(userAnswer || '');
      // Auto-send initial question to AI with a contextual message
      const initialMsg = userAnswer
        ? t('iChose', { a: userAnswer })
        : t('helpUnderstand');
      sendChatMessage(questionId, [{ role: 'user', content: initialMsg }], userAnswer, q);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-20 h-20 bg-cta rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
          <FlaskConical className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mt-5 mb-8">ChemTest</h1>
        <div className="w-7 h-7 rounded-full border-4 border-black/10 border-t-cta animate-spin" />
      </div>
    );
  }

  // AUTH PAGE
  if (effectivePage === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md rounded-4xl border border-black shadow-lg bg-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-cta rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ChemTest
            </CardTitle>
            <CardDescription>
              {authMode === 'login' ? t('signInToAccount') : t('createNewAccount')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input id="password" type="password" placeholder={t('min6chars')} value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()} />
            </div>
            <Button className="w-full h-11 rounded-full text-base font-semibold" onClick={handleAuth} disabled={loading}>
              {loading ? t('loading') : authMode === 'login' ? t('signIn') : t('signUp')}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {authMode === 'login' ? (
                <>{t('noAccount')} <button className="text-primary underline" onClick={() => setAuthMode('signup')}>{t('signUpLink')}</button></>
              ) : (
                <>{t('haveAccount')} <button className="text-primary underline" onClick={() => setAuthMode('login')}>{t('signInLink')}</button></>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
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

  // Flip the feed to files mode: every slide is one attachment, flowing into
  // the next recommended test's files. Header/bottom bar stay untouched.
  const openFilesCard = (test: Test) => {
    pendingFilesJumpRef.current = test.id;
    setDashSearch(''); setDashSearchResults(null); setDashTagInfo(null); setDashSearchOpen(false);
    setFilesFeedMode(true);
    // Prefetch attachments for ALL loaded tests so the flattened slide list
    // stabilizes quickly (each test's slides appear as its fetch resolves)
    for (const t of tests) {
      if (dashFetchedRef.current.has(t.id)) continue;
      dashFetchedRef.current.add(t.id);
      api.getTest(t.id)
        .then((full: Test) => setDashFullTests(prev => ({ ...prev, [t.id]: full })))
        .catch(() => { dashFetchedRef.current.delete(t.id); });
    }
  };
  // Back to the regular test card of the test whose files are on screen
  const closeFilesCard = () => {
    const cur = fileSlides[Math.min(Math.max(0, dashSlideIdx), Math.max(0, fileSlides.length - 1))];
    const tid = cur?.test.id;
    pendingFilesJumpRef.current = null;
    setFilesFeedMode(false);
    setDashSlideIdx(0);
    setDashSearch(''); setDashSearchResults(null); setDashTagInfo(null); setDashSearchOpen(false);
    if (tid) {
      const idx = tests.findIndex(x => x.id === tid);
      if (idx >= 0) { setDashTestIdx(idx); scrollDashTo(idx); }
    }
  };

  // View switcher: TikTok swipe feed / Library shelves (3 cards per shelf) /
  // Shelf view (1 card per shelf). Leaving the feed resets files mode.
  const switchDashView = (v: 'tiktok1' | 'library' | 'shelf') => {
    if (v === dashView) return;
    if (v === 'tiktok1') {
      if (filesFeedMode) { pendingFilesJumpRef.current = null; setFilesFeedMode(false); setDashSlideIdx(0); }
      setDashView('tiktok1');
    } else {
      if (filesFeedMode) { pendingFilesJumpRef.current = null; setFilesFeedMode(false); setDashSlideIdx(0); }
      setDashView(v);
    }
    // Grid files view never survives a view switch
    setGridFilesMode(false); setGridFilesTestId(null);
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
    const next = !discoverModeRef.current;
    discoverModeRef.current = next; // update BEFORE the async reload picks its scope
    setDiscoverMode(next);
    // Reset feed positions: the new mode starts from its own top card
    setDashTestIdx(0); setDashSlideIdx(0);
    setFilesFeedMode(false); pendingFilesJumpRef.current = null;
    setGridFilesMode(false); setGridFilesTestId(null);
    setShareScopeByTest({});
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
    if (filesFeedMode) { pendingFilesJumpRef.current = null; setFilesFeedMode(false); setDashSlideIdx(0); }
    setDashTestIdx(idx);
    setDashView('tiktok2');
    scrollDashTo(idx);
  };
  // The per-card paperclip on a grid card: the SAME grid view (library or
  // shelf) keeps its layout but shows the ATTACHED-FILES cards of this test
  // instead of the test cards. The header back arrow (and every file card's
  // "К тестам" button) returns to the test cards at the remembered scroll.
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

  // DASHBOARD
  if (effectivePage === 'dashboard') {
    const curDashTest = tests.length > 0 ? tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)] : null;
    // Saved progress for the test on screen (cached read) — drives the Continue button
    const dashSaved = curDashTest ? readTestProgress(progressUserId, curDashTest.id) : null;
    // Library / shelf grids: slice the loaded tests into shelf rows
    // (library = 2 cards per shelf on phones / 3 from sm up, shelf = 1 card per
    // shelf); rows scroll endlessly
    const gridPerRow = dashView === 'shelf' ? 1 : (dashView === 'library' && libNarrow ? 2 : 3);
    const gridColsClass = dashView === 'shelf' ? 'grid-cols-1' : (dashView === 'library' && libNarrow ? 'grid-cols-2' : 'grid-cols-3');
    const gridRows: Test[][] = [];
    for (let i = 0; i < tests.length; i += gridPerRow) gridRows.push(tests.slice(i, i + gridPerRow));
    // Grid files mode: attachments of the ONE test whose paperclip was tapped
    const gridFilesTest = gridFilesMode && gridFilesTestId
      ? (tests.find(x => x.id === gridFilesTestId) || null)
      : null;
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
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          {/* One row on EVERY viewport, no matter how many buttons: the row
              never wraps (flex-nowrap); buttons compress to icon-only pills on
              narrow screens. Search is a button too — when open, its input
              overlay covers the whole row instead of pushing buttons out. */}
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-nowrap items-center justify-between gap-1 sm:gap-2">
            {dashSearchOpen && (
              <div className="absolute inset-0 z-50 bg-white flex items-center gap-2 px-3 sm:px-4 animate-in fade-in duration-150">
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
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {(dashView === 'tiktok2' || gridFilesMode) && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={gridFilesMode ? closeGridFiles : backToLibrary}
                  className="rounded-full shrink-0 border-black"
                  title={gridFilesMode ? t('backToTests') : t('backToLibrary')}
                  aria-label={gridFilesMode ? t('backToTests') : t('backToLibrary')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
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
              {/* Profile-photo uploader — the picture lands in the Telegram
              channel like every other file and shows up on the account avatar
              and on the author header of this user's tests in Discover */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarBusy || !effectiveUser}
                title={t('avatarUpload')}
                aria-label={t('avatarUpload')}
                className="w-9 h-9 rounded-full border border-black/25 bg-white flex items-center justify-center text-black hover:border-black active:scale-95 transition-all shrink-0 disabled:opacity-60"
              >
                {avatarBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) handleAvatarFile(f); }}
              />
              {/* Account button — one tap switches the content mode between the
              personal library (Library badge) and Discover (Compass badge).
              The avatar shows the user's profile photo (Telegram-stored) with
              the initials as the fallback. */}
              <button
                onClick={toggleDiscoverMode}
                disabled={loading}
                title={discoverMode ? `${t('modeDiscover')} · ${t('modeDiscoverHint')}` : `${t('modeMine')} · ${t('modeMineHint')}`}
                aria-label={discoverMode ? t('modeDiscover') : t('modeMine')}
                className="relative w-9 h-9 rounded-full bg-cta text-white flex items-center justify-center font-bold text-sm shadow-sm active:scale-95 transition-transform shrink-0 disabled:opacity-70 overflow-visible"
              >
                {myAvatar
                  ? <img src={myAvatar} alt="" className="absolute inset-0 w-full h-full rounded-full object-cover" />
                  : userInitials}
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-black/15 flex items-center justify-center">
                  {discoverMode
                    ? <Compass className="w-2.5 h-2.5 text-cta" aria-hidden="true" />
                    : <Library className="w-2.5 h-2.5 text-cta" aria-hidden="true" />}
                </span>
              </button>
            </div>
          </div>
        </header>

        {tests.length === 0 ? (
          <main className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <Card className="rounded-4xl border-dashed border-black/30 bg-white">
                <CardContent className="py-12 text-center">
                  <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{discoverMode ? t('discoverEmptyTitle') : t('noTestsYet')}</h3>
                  <p className="text-muted-foreground mb-4">{discoverMode ? t('discoverEmptyDesc') : t('createFirst')}</p>
                  {!discoverMode && (
                    <div className="flex gap-3 justify-center">
                      <Button onClick={startCreateTest}><Plus className="w-4 h-4 mr-2" /> {t('createTest')}</Button>
                    </div>
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
              <div key="feed-grid" ref={dashFeedRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="max-w-5xl mx-auto h-full">
                  {gridFilesMode ? (
                    /* ATTACHED-FILES cards in the SAME grid layout — the view does not
                    change, only the cards do: one card per attachment of the test whose
                    paperclip was tapped. Back arrow (header) / «К тестам» returns. */
                    gridFiles.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-muted-foreground">{t('filesEmpty')}</p>
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
                              {/* Discover mode: author header + bookmark. The personal
                              library keeps the card clean (you know it's yours). */}
                              {discoverMode && (
                                <CreatorStrip
                                  name={(test as any).creator?.name || ''}
                                  creatorId={(test as any).creator?.id || test.creatorId}
                                  image={(test as any).creator?.image || null}
                                  bookmarked={bookmarkIds.has(test.id)}
                                  onToggleBookmark={() => toggleBookmark(test)}
                                  addLabel={t('bookmarkAdd')}
                                  removeLabel={t('bookmarkRemove')}
                                  addShort={t('bookmarkAddShort')}
                                  removeShort={t('bookmarkRemoveShort')}
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
                                    onClick={e => { e.stopPropagation(); openGridFiles(test); }}
                                    title={t('attachedFiles', { n: fcnt })} aria-label={t('attachedFiles', { n: fcnt })}
                                    className="h-7 rounded-full border-black text-[10px] sm:text-xs px-1 justify-start gap-0.5 has-[>svg]:px-1"
                                  >
                                    <Paperclip className="size-3 shrink-0" /> <span className="truncate [@media(max-width:399px)]:text-[9px]">{t('attachedFiles', { n: fcnt })}</span>
                                  </Button>
                                )}
                                {/* Share buttons live in the personal library only —
                                in Discover these tests belong to other authors */}
                                {!discoverMode && (
                                <Button size="sm" variant="outline" disabled={!!shareBusy}
                                  onClick={e => { e.stopPropagation(); setShareScopeByTest(prev => ({ ...prev, [test.id]: 'link' })); doShare(test, 'link'); }}
                                  title={t('shareOptLink')} aria-label={t('shareOptLink')}
                                  className={`h-7 rounded-full text-[10px] sm:text-xs px-1 justify-start gap-1 has-[>svg]:px-1 ${(shareScopeByTest[test.id] || (test.isPublic === false ? 'link' : 'community')) === 'link' ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                >
                                  <Link2 className="size-3 shrink-0" /> <span className="truncate">{t('shareOptLink')}</span>
                                </Button>
                                )}
                                {!discoverMode && (
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
                                {/* Discover mode: author header + bookmark on the shelf card too */}
                                {discoverMode && (
                                  <CreatorStrip
                                    name={(test as any).creator?.name || ''}
                                    creatorId={(test as any).creator?.id || test.creatorId}
                                    image={(test as any).creator?.image || null}
                                    bookmarked={bookmarkIds.has(test.id)}
                                    onToggleBookmark={() => toggleBookmark(test)}
                                    addLabel={t('bookmarkAdd')}
                                    removeLabel={t('bookmarkRemove')}
                                    addShort={t('bookmarkAddShort')}
                                    removeShort={t('bookmarkRemoveShort')}
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
                                      onClick={e => { e.stopPropagation(); openGridFiles(test); }}
                                      title={t('attachedFiles', { n: fcnt })} aria-label={t('attachedFiles', { n: fcnt })}
                                      className="h-7 rounded-full border-black text-xs sm:text-sm px-2 justify-start"
                                    >
                                      <Paperclip className="size-3 shrink-0" /> <span className="truncate">{t('attachedFiles', { n: fcnt })}</span>
                                    </Button>
                                  )}
                                  {/* Share buttons live in the personal library only */}
                                  {!discoverMode && (
                                  <Button size="sm" variant="outline" disabled={!!shareBusy}
                                    onClick={e => { e.stopPropagation(); setShareScopeByTest(prev => ({ ...prev, [test.id]: 'link' })); doShare(test, 'link'); }}
                                    title={t('shareOptLink')} aria-label={t('shareOptLink')}
                                    className={`h-7 rounded-full text-xs sm:text-sm px-2 justify-start ${(shareScopeByTest[test.id] || (test.isPublic === false ? 'link' : 'community')) === 'link' ? 'border-primary bg-[#FFE8DE]' : 'border-black'}`}
                                  >
                                    <Link2 className="size-3 shrink-0" /> <span className="truncate">{t('shareOptLink')}</span>
                                  </Button>
                                  )}
                                  {!discoverMode && (
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
              Header and bottom bar stay untouched; the paperclip button toggles back. */
              <div
                key="feed-files"
                ref={dashFeedRef}
                onScroll={onDashScroll}
                onTouchStart={onDashTouchStart}
                onTouchMove={onDashTouchStart}
                onTouchEnd={onDashTouchEnd}
                onTouchCancel={onDashTouchEnd}
                onWheel={onDashWheel}
                className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory overscroll-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {fileSlides.length === 0 ? (
                  <section className="h-full snap-start snap-always flex items-center justify-center">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t('loading')}</p>
                  </section>
                ) : fileSlides.map((s, i) => {
                  const test = s.test;
                  const bgClass = test.coverColor ? '' : coverBgFor(test);
                  const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                  return (
                    <section key={`${test.id}-${s.fIdx}`} style={bgStyle} className={`relative h-full snap-start snap-always overflow-hidden ${bgClass}`}>
                      <div className="h-full w-full flex flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                        <div className="w-full max-w-md flex flex-col gap-2.5 sm:gap-4 h-full min-h-0">
                          <div className="shrink-0 rounded-2xl bg-white/80 px-4 py-2.5 text-center">
                            <p className="text-xs font-semibold text-foreground/70 line-clamp-1">{test.title}</p>
                            <p className="text-base sm:text-lg font-bold leading-snug">{t('attachedFiles', { n: s.count })}</p>
                            <p className="text-[11px] sm:text-xs text-foreground/70">{t('fileOf', { i: s.fIdx + 1, n: s.count })}</p>
                          </div>
                          <div className="flex-1 min-h-0 rounded-2xl border border-black bg-white p-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <AttachmentsList items={[s.file]} />
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
                            {s.fIdx === s.count - 1 ? t('swipeNextTestFiles') : t('swipeNextFile')}
                          </p>
                        </div>
                      </div>
                    </section>
                  );
                })}
                <div ref={feedSentinelRef} className="h-px w-full shrink-0" aria-hidden="true" />
              </div>
            ) : (
            /* TikTok-style vertical feed — swipe up/down between tests */
            <div
              key="feed-tiktok"
              ref={dashFeedRef}
              onScroll={onDashScroll}
              onTouchStart={onDashTouchStart}
              onTouchMove={onDashTouchStart}
              onTouchEnd={onDashTouchEnd}
              onTouchCancel={onDashTouchEnd}
              onWheel={onDashWheel}
              className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory overscroll-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tests.map((test, idx) => {
                const isCur = idx === Math.min(dashTestIdx, tests.length - 1);
                const totalQ = test._count?.questions || test.questions?.length || 0;
                const files = (dashFullTests[test.id]?.attachments ?? test.attachments ?? []) as AttachmentItem[];
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
                    <div className="h-full w-full flex flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4 min-h-0">
                      <div className="w-full max-w-md flex flex-col gap-2.5 sm:gap-4 min-h-0">
                        {/* Discover mode: author header with the bookmark toggle,
                        right above the cover. Personal library stays clean. */}
                        {discoverMode && (
                          <CreatorStrip
                            name={(test as any).creator?.name || ''}
                            creatorId={(test as any).creator?.id || test.creatorId}
                            image={(test as any).creator?.image || null}
                            bookmarked={bookmarkIds.has(test.id)}
                            onToggleBookmark={() => toggleBookmark(test)}
                            addLabel={t('bookmarkAdd')}
                            removeLabel={t('bookmarkRemove')}
                            addShort={t('bookmarkAddShort')}
                            removeShort={t('bookmarkRemoveShort')}
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
                            Discover mode hides it: other authors' tests are only
                            browsed here, not published. */}
                            {!discoverMode && (
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

                            {/* Attached files — flips the feed to the FILES mode:
                            one attachment per slide, flowing into the next test's
                            files; the button toggles back to this card */}
                            {files.length > 0 && (
                              <button
                                type="button"
                                onClick={() => openFilesCard(test)}
                                className="shrink-0 w-full flex items-center gap-1.5 rounded-2xl border-2 border-black bg-white px-3 py-2 sm:py-2.5 text-left hover:bg-muted/50 transition-colors"
                              >
                                <Paperclip className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-sm">{t('attachedFiles', { n: files.length })}</span>
                                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
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

  // Editor form body — shared by the full-page editor AND the take-test
  // "Edit Test" bottom sheet: one source of truth, identical form in both.
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
            {editorInfoExpanded && (
            <CardContent className="space-y-4 pt-0">
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
            )}
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
            {editorFilesExpanded && (
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  {t('editorFilesHint')}
                </p>
                <AttachmentsEditor items={formAttachments} onChange={setFormAttachments} />
              </CardContent>
            )}
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
            {editorCoverExpanded && (
            <CardContent className="space-y-4 pt-0">
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
            )}
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
            {editorQuestionsExpanded && (
            <CardContent className="pt-0">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['A', 'B', 'C', 'D'].map(letter => (
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
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={q.correctAnswer === letter}
                              onChange={() => updateQuestion(idx, 'correctAnswer', letter)}
                              className="shrink-0 accent-[#fe5933]"
                              title={t('markCorrect')}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            )}
          </Card>
    </>
  );

  // CREATE / EDIT TEST
  if (effectivePage === 'create-test' || effectivePage === 'edit-test') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> {t('back')}</Button>
            <h1 className="text-lg font-bold">{editingTestId ? t('editTest') : t('createNewTest')}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pt-6 pb-32 space-y-6">
          {editorBody}
        </main>

        {/* Bottom action bar — fixed to the screen edge, never rises with content */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10">
          <div
            className="max-w-4xl mx-auto px-4 pt-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <Button onClick={() => handleSaveTest()} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
              {loading ? t('saving') : editingTestId ? t('save') : t('createTest')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // START TEST - select number of questions + mode selection
  if (effectivePage === 'start-test' && currentTest) {
    const totalQ = currentTest.questions.length;

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> {t('back')}</Button>
            <h1 className="text-lg font-bold">{t('startTest')}</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 pt-8 pb-32">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-cta rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <ListChecks className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">{currentTest.title}</CardTitle>
              {currentTest.description && <CardDescription className="mt-2">{currentTest.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Count Selection */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">{t('howMany')}</h3>
                  <p className="text-sm text-muted-foreground">{t('chooseHowMany')}</p>
                </div>

                {/* Counter — tap the number to type an exact value */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => setSelectedQuestionCount(Math.max(1, selectedQuestionCount - 1))} disabled={selectedQuestionCount <= 1}>
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
                    onBlur={e => {
                      if (e.target.value === '') setSelectedQuestionCount(1);
                    }}
                    aria-label={t('numQuestions')}
                    className="text-3xl font-bold w-20 text-center bg-white rounded-xl border-2 border-black/10 focus:border-cta outline-none py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button variant="outline" size="icon" onClick={() => setSelectedQuestionCount(Math.min(totalQ, selectedQuestionCount + 1))} disabled={selectedQuestionCount >= totalQ}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Slider */}
                <div className="px-4">
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

              <Separator />

              {/* Mode Selection */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">{t('testMode')}</h3>
                  <p className="text-sm text-muted-foreground">{t('chooseHowTake')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPracticeMode(false)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      !practiceMode
                        ? 'border-cta bg-[#FFF0D9] shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ListChecks className="w-5 h-5 text-cta" />
                      <span className="font-semibold text-sm">{t('examMode')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('seeResultsEnd')}</p>
                  </button>
                  <button
                    onClick={() => setPracticeMode(true)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      practiceMode
                        ? 'border-primary bg-[#FFE8DE] shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-sm">{t('practiceMode')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('seeAnswerNow')}</p>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Randomization Settings */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">{t('randomization')}</h3>
                  <p className="text-sm text-muted-foreground">{t('chooseOrder')}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                    <p className="text-xs text-muted-foreground">{startRandomizeQ ? t('qShuffled') : t('qOriginal')}</p>
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
                    <p className="text-xs text-muted-foreground">{startRandomizeO ? t('aShuffled') : t('aOriginal')}</p>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Attached files — collapsed to a one-line header by default; arrow expands/collapses */}
              {(currentTest.attachments?.length || 0) > 0 && (
                <div className="rounded-2xl border border-black bg-white overflow-hidden">
                  <button
                    onClick={() => setStartFilesExpanded(v => !v)}
                    className="w-full flex items-center gap-1.5 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-sm">{t('attachedFiles', { n: currentTest.attachments!.length })}</span>
                    {startFilesExpanded ? (
                      <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
                    )}
                  </button>
                  {startFilesExpanded && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {t('startFilesHint')}
                      </p>
                      <AttachmentsList items={currentTest.attachments as AttachmentItem[]} />
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </main>

        {/* Bottom bar — fixed to the screen edge, never rises with content */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10">
          <div
            className="max-w-2xl mx-auto px-4 pt-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            {savedProgress && savedProgress.shuffledQuestions.length > 0 ? (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={startTest}
                  disabled={loading}
                  className="w-full rounded-full"
                  aria-label={t('startOver')}
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> {t('restart')}
                </Button>
                <Button
                  onClick={() => continueTestWith(currentTest!)}
                  disabled={loading}
                  className="w-full rounded-full bg-primary hover:bg-primary/90"
                >
                  {loading ? t('loading') : <><Play className="w-4 h-4 mr-2" /> {t('continueTest', { n: countAnsweredProgress(savedProgress), m: savedProgress.shuffledQuestions.length })}</>}
                </Button>
              </div>
            ) : (
              <Button onClick={startTest} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                {loading ? t('loading') : <><Play className="w-4 h-4 mr-2" /> {practiceMode ? t('startPractice', { count: selectedQuestionCount }) : t('startTestN', { count: selectedQuestionCount })}</>}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TAKE TEST
  if (effectivePage === 'take-test' && shuffledQuestions.length > 0) {
    const currentQ = shuffledQuestions[currentQuestionIdx];
    const progressPct = ((currentQuestionIdx + 1) / shuffledQuestions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    // Navigate to a question and close any open chat sheet
    const goToQuestion = (idx: number) => {
      setCurrentQuestionIdx(idx);
      if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); setChatQuestionObj(null); }
    };

    // Question search (take-test header): filter this test's questions by text
    // or option content; selecting a result jumps straight to that question.
    const qlc = qSearch.trim().toLowerCase();
    const qResults = qlc ? shuffledQuestions
      .map((q: any, qIdx: number) => ({ q, qIdx }))
      .filter(({ q }) =>
        trText(q, lang).toLowerCase().includes(qlc) ||
        ['A', 'B', 'C', 'D', 'E'].some(L => (trOption(q, L, lang) || '').toLowerCase().includes(qlc))
      )
      .slice(0, 12) : [];
    const qSearchDropdown = !qlc ? null : (
      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-black/10 shadow-xl max-h-72 overflow-y-auto text-left">
        {qResults.length === 0 ? (
          <p className="px-3 py-3 text-sm text-muted-foreground">{t('noResults')}</p>
        ) : qResults.map(({ q, qIdx }) => (
          <button
            key={q.id || qIdx}
            type="button"
            onClick={() => { goToQuestion(qIdx); setQSearch(''); setQSearchOpen(false); }}
            className="w-full text-left px-3 py-2.5 hover:bg-muted/50 border-b border-black/5 last:border-0 flex items-start gap-2"
          >
            <Badge variant="secondary" className="rounded-full shrink-0">{qIdx + 1}</Badge>
            <span className="text-sm line-clamp-2"><MathText text={trText(q, lang)} /></span>
          </button>
        ))}
      </div>
    );
    const jumpToQuestion = (raw: string) => {
      const digits = (raw || '').replace(/[^0-9]/g, '');
      const n = digits ? parseInt(digits, 10) : NaN;
      if (!Number.isNaN(n) && n >= 1 && n <= shuffledQuestions.length) goToQuestion(n - 1);
      setDrumInputMode(false);
      if (numInputRef.current) numInputRef.current.value = '';
    };

    // Drum scroll: magnify around the center in real time; when the strip settles,
    // select the number closest to the glass (skips programmatic scrolls)
    const onDrumScroll = () => {
      if (!drumScaleRafRef.current) {
        drumScaleRafRef.current = requestAnimationFrame(() => {
          drumScaleRafRef.current = 0;
          applyDrumScales();
        });
      }
      if (drumSettleTimerRef.current) clearTimeout(drumSettleTimerRef.current);
      drumSettleTimerRef.current = setTimeout(() => {
        const c = drumRef.current;
        if (!c || Date.now() - drumProgrammaticRef.current < 300) return;
        const mid = c.getBoundingClientRect().left + c.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        (Array.from(c.children) as HTMLElement[]).forEach((k, i) => {
          const r = k.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        if (best !== currentQuestionIdx && best >= 0 && best < shuffledQuestions.length) goToQuestion(best);
      }, 150);
    };

    // Feed scroll: commit the question switch only AFTER the swipe settles.
    // Switching mid-gesture re-renders every slide while the card is still
    // moving (visible stutter) and lets the sync effect yank the card under
    // the finger — so we wait until scrolling comes to rest and the finger
    // is up, then select the slide closest to the viewport (TikTok-style).
    const feedSettleCommit = () => {
      takeFeedSettleTimerRef.current = null;
      const c = takeFeedRef.current;
      if (!c || c.clientHeight === 0) return;
      if (Date.now() < takeFeedTouchUntilRef.current) return;
      const idx = Math.round(c.scrollTop / c.clientHeight);
      if (idx !== currentQuestionIdx && idx >= 0 && idx < shuffledQuestions.length) goToQuestion(idx);
    };
    const armFeedSettle = (delay = 140) => {
      if (takeFeedSettleTimerRef.current) clearTimeout(takeFeedSettleTimerRef.current);
      takeFeedSettleTimerRef.current = setTimeout(feedSettleCommit, delay);
    };
    const onFeedScroll = () => {
      const el = takeFeedRef.current;
      if (!el || el.clientHeight === 0) return;
      armFeedSettle(140);
    };
    const onFeedTouchStart = () => { takeFeedTouchUntilRef.current = Date.now() + 600; };
    const onFeedTouchEnd = () => {
      takeFeedTouchUntilRef.current = Date.now() + 150;
      armFeedSettle(180); // final commit if the release produced no snap animation
    };
    const onFeedWheel = () => {
      takeFeedTouchUntilRef.current = Date.now() + 250;
      armFeedSettle(220);
    };

    if (showResult) {
      const score = getScore();
      const pct = Math.round((score / shuffledQuestions.length) * 100);

      // Results header search: filter the review questions by text or option
      // content; selecting a result scrolls to that question card and highlights it.
      const rlc = resSearch.trim().toLowerCase();
      const rResults = rlc ? shuffledQuestions
        .map((q: any, qIdx: number) => ({ q, qIdx }))
        .filter(({ q }) =>
          trText(q, lang).toLowerCase().includes(rlc) ||
          ['A', 'B', 'C', 'D', 'E'].some(L => (trOption(q, L, lang) || '').toLowerCase().includes(rlc))
        )
        .slice(0, 12) : [];
      const resSearchDropdown = !rlc ? null : (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-black/10 shadow-xl max-h-72 overflow-y-auto text-left">
          {rResults.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">{t('noResults')}</p>
          ) : rResults.map(({ q, qIdx }) => (
            <button
              key={q.id || qIdx}
              type="button"
              onClick={() => { jumpToResultQuestion(qIdx); setResSearch(''); }}
              className="w-full text-left px-3 py-2.5 hover:bg-muted/50 border-b border-black/5 last:border-0 flex items-start gap-2"
            >
              <Badge variant="secondary" className="rounded-full shrink-0">{qIdx + 1}</Badge>
              <span className="text-sm line-clamp-2"><MathText text={trText(q, lang)} /></span>
            </button>
          ))}
        </div>
      );
      const jumpToResultQuestion = (idx: number) => {
        const el = typeof document !== 'undefined' ? document.getElementById(`result-q-${idx}`) : null;
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setResHighlightIdx(idx);
        window.setTimeout(() => setResHighlightIdx(prev => (prev === idx ? null : prev)), 2400);
      };

      // Bottom-sheet window switcher (Attached Files / AI Tutor / Test Chat / Edit Test)
      const sheetOptions = [
        ...(currentTest?.attachments?.length ? [{
          key: 'files',
          label: t('attachedFiles', { n: currentTest.attachments.length }),
          icon: <Paperclip className="w-3.5 h-3.5" />,
          active: filesOpen,
        }] : []),
        { key: 'ai', label: t('aiTutor'), icon: <MessageSquare className="w-3.5 h-3.5" />, active: chatOpen },
        { key: 'group', label: t('testChat'), icon: <Users className="w-3.5 h-3.5" />, active: groupOpen },
        { key: 'edit', label: t('editTest'), icon: <Pencil className="w-3.5 h-3.5" />, active: editOpen },
      ];
      const switchSheet = (key: string) => {
        if (key === 'files') {
          setFilesOpen(true);
          setChatOpen(false);
          setGroupOpen(false);
          setEditOpen(false);
        } else if (key === 'ai') {
          setFilesOpen(false);
          setGroupOpen(false);
          setEditOpen(false);
          openChat(shuffledQuestions[0]?.id || '', answers[shuffledQuestions[0]?.id || '']);
        } else if (key === 'group') {
          setFilesOpen(false);
          setChatOpen(false);
          setGroupOpen(true);
          setEditOpen(false);
        } else if (key === 'edit') {
          setFilesOpen(false);
          setChatOpen(false);
          setGroupOpen(false);
          startEditTestInTake();
        }
      };
      const sheetSwitcher = { options: sheetOptions, onSelect: switchSheet };
      return (
        <div className="min-h-screen bg-background">
          <TranslatingPill show={autoTranslating} label={t('translating')} />
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            {/* Search lives BETWEEN the button groups in the same row; on narrow
                screens the right icon group wraps onto its own row below it. */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full shrink-0"><ArrowLeft className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">{t('back')}</span></Button>
                {(currentTest?.attachments?.length || 0) > 0 ? (
                  <Button
                    variant={filesOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { const next = !filesOpen; setFilesOpen(next); if (next) { setGroupOpen(false); setEditOpen(false); if (chatOpen) closeChat(); } }}
                    className={`gap-1.5 ${filesOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('files', { n: currentTest!.attachments!.length })}</span>
                    <span className="sm:hidden">{currentTest!.attachments!.length}</span>
                  </Button>
                ) : (
                  <h1 className="text-lg font-bold">{t('testResults')}</h1>
                )}
              </div>
              <div className="flex-1 min-w-[110px] sm:max-w-sm relative mx-1 sm:mx-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={resSearch}
                  onChange={e => setResSearch(e.target.value)}
                  placeholder={t('searchQuestions')}
                  className="h-9 rounded-full pl-9 bg-white border-black/15 text-sm"
                />
                {resSearchDropdown}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
                <LangButton lang={lang} onChange={cycleLang} className="border-black" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setChatOpen(true); setFilesOpen(false); setGroupOpen(false); setEditOpen(false); openChat(shuffledQuestions[0]?.id || '', answers[shuffledQuestions[0]?.id || '']); }}
                  className="gap-1.5"
                  title={t('aiTutor')}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('aiTutor')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openGroupChat}
                  className="gap-1.5"
                  title={t('chatWithTook')}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('chat')}</span>
                </Button>
                <Button
                  variant={editOpen ? 'default' : 'outline'}
                  size="sm"
                  onClick={startEditTestInTake}
                  className={`gap-1.5 ${editOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                  title={t('editThisTestTitle')}
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('editTest')}</span>
                </Button>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 pt-8 pb-32">
            <div className={`flex gap-6 ${chatOpen || groupOpen ? 'flex-col lg:flex-row' : ''}`}>
              <div className="flex-1 min-w-0 space-y-6">
            <Card className="rounded-4xl border border-black bg-white overflow-hidden">
              <div className={`h-2 ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <CardContent className="p-8 text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white ${
                  pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                  {pct}%
                </div>
                <h2 className="text-2xl font-bold mb-1">{score} / {shuffledQuestions.length}</h2>
                <p className="text-muted-foreground mb-4">
                  {pct >= 70 ? t('excellent') : pct >= 40 ? t('goodEffort') : t('keepPracticing')}
                </p>
                <Progress value={pct} className="h-3" />
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold">{t('reviewAnswers')}</h3>
            {shuffledQuestions.map((q, idx) => {
              const selected = answers[q.id || ''] || '';
              const isCorrect = selected === q.correctAnswer;
              return (
                <Card key={idx} id={`result-q-${idx}`} className={`rounded-4xl border border-black bg-white scroll-mt-24 ${isCorrect ? 'ring-2 ring-emerald-300' : 'ring-2 ring-red-300'} ${resHighlightIdx === idx ? 'outline outline-2 outline-primary outline-offset-2' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      <p className="font-medium text-sm">{idx + 1}. <MathText text={trText(q, lang)} /></p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const optionText = trOption(q, letter, lang);
                        if (!optionText) return null;
                        const isCorrectOption = letter === q.correctAnswer;
                        const isSelected = letter === selected;
                        return (
                          <div key={letter} className={`px-3 py-2 rounded-lg text-[15px] sm:text-sm flex items-start gap-2 ${
                            isCorrectOption ? 'bg-emerald-50 text-emerald-700 font-medium' :
                            isSelected ? 'bg-red-50 text-red-700' : 'bg-muted/50'
                          }`}>
                            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrectOption ? 'bg-emerald-500 text-white' :
                              isSelected ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              {letter}
                            </span>
                            <span className="min-w-0 break-words"><MathText text={optionText} /></span>
                          </div>
                        );
                      })}
                    </div>
                    {trExpl(q, lang, explanations[q.id || '']) && (
                      <p className="text-xs text-muted-foreground mt-2 ml-7 italic"><MathText text={trExpl(q, lang, explanations[q.id || '']) || ''} /></p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 ml-7 text-primary hover:bg-[#FFE8DE] text-xs"
                      onClick={() => openChat(q.id || '', selected, { force: true })}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {t('askAi')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
              </div>

              {/* AI Chat Panel in Results — bottom sheet on mobile, side panel on desktop */}
              {chatOpen && (
                <AiChatPanel
                  open={chatOpen}
                  onClose={closeChat}
                  subtitle={t('askAboutAny')}
                  messages={chatMessages}
                  loading={chatLoading}
                  input={chatInput}
                  onInputChange={setChatInput}
                  onSend={() => sendChatMessage()}
                  endRef={chatEndRef}
                  switcher={sheetSwitcher}
                />
              )}

              {/* Group chat panel in Results — bottom sheet on mobile, side panel on desktop */}
              {groupOpen && (
                <GroupChatPanel
                  open={groupOpen}
                  onClose={closeGroupChat}
                  subtitle={t('everyoneTook')}
                  messages={groupMessages}
                  currentUserId={effectiveUser?.id}
                  input={groupInput}
                  onInputChange={setGroupInput}
                  onSend={sendGroupMessage}
                  sending={groupSending}
                  endRef={groupEndRef}
                  switcher={sheetSwitcher}
                />
              )}

              {/* Edit Test window in Results — bottom sheet, same chrome as the
                  chat windows; its header switcher jumps to Files / AI Tutor /
                  Test Chat and back. Saving stays on the updated results. */}
              {editOpen && (
                <div className="fixed inset-0 z-50">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setEditOpen(false)} />
                  <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl bg-white rounded-t-3xl shadow-2xl border-t border-black/10 flex flex-col h-[85vh] animate-in slide-in-from-bottom duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                      <SheetHeaderSwitcher
                        icon={<Pencil className="w-4 h-4 text-white" />}
                        title={t('editTest')}
                        subtitle={currentTest?.title}
                        options={sheetOptions}
                        onSelect={switchSheet}
                      />
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => setEditOpen(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      <div className="max-w-3xl mx-auto space-y-6">
                        {editorBody}
                      </div>
                    </div>
                    <div className="shrink-0 border-t bg-white/95 backdrop-blur-md px-4 pt-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                      <Button onClick={() => handleSaveTest(true)} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                        {loading ? t('saving') : t('saveTest')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Bottom action bar — fixed to the screen edge, never rises with content */}
          <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10">
            <div
              className="max-w-7xl mx-auto px-4 pt-3"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <Button onClick={() => openStartTest(currentTest!)} className="w-full rounded-full bg-primary hover:bg-primary/90">
                <RefreshCw className="w-4 h-4 mr-2" /> {t('retryTest')}
              </Button>
            </div>
          </div>

          {/* Attached files bottom sheet (mobile) — launcher hidden, opens via header Files button */}
          <AttachmentsBottomSheet
            items={(currentTest?.attachments || []) as AttachmentItem[]}
            open={filesOpen}
            onOpenChange={setFilesOpen}
            switcher={sheetSwitcher}
            hideLauncher
            title={t('attachedFiles', { n: currentTest?.attachments?.length || 0 })}
          />
        </div>
      );
    }

    // Active test-taking UI
    const qId = currentQ.id || '';

    // Bottom-sheet window switcher (Attached Files / AI Tutor / Test Chat)
    const sheetOptions = [
      ...(currentTest?.attachments?.length ? [{
        key: 'files',
        label: t('attachedFiles', { n: currentTest.attachments.length }),
        icon: <Paperclip className="w-3.5 h-3.5" />,
        active: filesOpen,
      }] : []),
      { key: 'ai', label: t('aiTutor'), icon: <MessageSquare className="w-3.5 h-3.5" />, active: chatOpen },
      { key: 'group', label: t('testChat'), icon: <Users className="w-3.5 h-3.5" />, active: groupOpen },
      { key: 'edit', label: t('editTest'), icon: <Pencil className="w-3.5 h-3.5" />, active: editOpen },
    ];
    const switchSheet = (key: string) => {
      if (key === 'files') {
        setFilesOpen(true);
        setChatOpen(false);
        setGroupOpen(false);
        setEditOpen(false);
      } else if (key === 'ai') {
        setFilesOpen(false);
        setGroupOpen(false);
        setEditOpen(false);
        openChat(qId, answers[qId]);
      } else if (key === 'group') {
        setFilesOpen(false);
        setChatOpen(false);
        setGroupOpen(true);
        setEditOpen(false);
      } else if (key === 'edit') {
        setFilesOpen(false);
        setChatOpen(false);
        setGroupOpen(false);
        startEditTestInTake();
      }
    };
    const sheetSwitcher = { options: sheetOptions, onSelect: switchSheet };

    return (
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden">
        <TranslatingPill show={autoTranslating} label={t('translating')} />
        <header className="shrink-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* Search is a BUTTON in the action group; tapping it expands an
                input overlay that covers the whole header row (every button)
                until dismissed. On narrow screens the action buttons wrap onto
                their own row below it. */}
            <div className="relative flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Button variant="ghost" size="sm" onClick={goHome} className="shrink-0"><Home className="w-4 h-4" /></Button>
                <LangButton lang={lang} onChange={cycleLang} className="border-black shrink-0" />
              </div>
              {qSearchOpen && (
                <div className="absolute inset-0 z-50 bg-white flex items-center gap-2 px-1 animate-in fade-in duration-150">
                  <div className="flex-1 min-w-0 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      autoFocus
                      value={qSearch}
                      onChange={e => setQSearch(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Escape') { setQSearchOpen(false); setQSearch(''); } }}
                      placeholder={t('searchQuestions')}
                      className="h-9 rounded-full pl-9 bg-white border-black/15 text-sm"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setQSearchOpen(false); setQSearch(''); }}
                    className="shrink-0 h-9 w-9 p-0"
                    aria-label={t('cancel')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {qSearchDropdown}
                </div>
              )}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                {/* View switcher (present on every page header): one tap advances
                to the NEXT dashboard layout (TikTok feed → Library → Shelf → …)
                and returns home. The icon shows the current view. */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { cycleDashView(); goHome(); }}
                  className="shrink-0 w-9 p-0"
                  title={t('viewMode')}
                  aria-label={t('viewMode')}
                >
                  {dashView === 'library'
                    ? <LayoutGrid className="w-4 h-4" />
                    : dashView === 'shelf'
                      ? <Rows3 className="w-4 h-4" />
                      : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQSearchOpen(true)}
                  className="shrink-0 w-9 p-0"
                  title={t('searchQuestions')}
                  aria-label={t('searchQuestions')}
                >
                  <Search className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground hidden sm:inline">{t('xOfYAnswered', { n: answeredCount, m: shuffledQuestions.length })}</span>
                {(currentTest?.attachments?.length || 0) > 0 && (
                  <Button
                    variant={filesOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { const next = !filesOpen; setFilesOpen(next); if (next) { setGroupOpen(false); setEditOpen(false); if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); setChatQuestionObj(null); } } }}
                    className={`gap-1.5 ${filesOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('files', { n: currentTest!.attachments!.length })}</span>
                    <span className="sm:hidden">{currentTest!.attachments!.length}</span>
                  </Button>
                )}
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setChatOpen(true); setFilesOpen(false); setGroupOpen(false); setEditOpen(false); openChat(qId, answers[qId]); }}
                    className="gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('aiTutor')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openGroupChat}
                    className="gap-1.5"
                    title={t('chatWithAll')}
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('chat')}</span>
                  </Button>
                  <Button
                    variant={editOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={startEditTestInTake}
                    className={`gap-1.5 ${editOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                    title={t('editThisTestTitle')}
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('editTest')}</span>
                  </Button>
                </>
              </div>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        </header>

        <main className="flex-1 min-h-0">
          {/* Question card + Chat/Files side by side (desktop) */}
          <div className={`h-full max-w-7xl mx-auto flex gap-6 ${chatOpen || groupOpen || filesOpen ? 'flex-col lg:flex-row' : ''}`}>
            {/* Questions feed — one full-height card per question, TikTok-style swipe */}
            <div
              ref={takeFeedRef}
              onScroll={onFeedScroll}
              onTouchStart={onFeedTouchStart}
              onTouchMove={onFeedTouchStart}
              onTouchEnd={onFeedTouchEnd}
              onTouchCancel={onFeedTouchEnd}
              onWheel={onFeedWheel}
              className="relative flex-1 min-w-0 h-full overflow-y-auto snap-y snap-mandatory overscroll-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shuffledQuestions.map((q, idx) => {
                const slideQId = q.id || '';
                const slideRevealed = practiceMode && revealedAnswers[slideQId];
                // relative = containing block for sr-only radios inside the card,
                // otherwise they anchor to the document and stretch it into a
                // huge white void below the feed (position:absolute escapes the
                // feed's overflow clipping when no ancestor is positioned)
                return (
              <section key={idx} className="relative h-full w-full snap-start snap-always overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="min-h-full flex flex-col px-4 py-4">
                  <div className="max-w-3xl w-full mx-auto my-auto">
              <Card className="rounded-4xl border border-black bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm rounded-full">{t('questionXofY', { n: idx + 1, m: shuffledQuestions.length })}</Badge>
                    {practiceMode && slideRevealed && (
                      answers[slideQId] === q.correctAnswer ? (
                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('correct')}</Badge>
                      ) : (
                        <Badge className="rounded-full bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> {t('wrong')}</Badge>
                      )
                    )}
                  </div>
                  <p className="text-lg font-medium mt-2"><MathText text={trText(q, lang)} /></p>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[slideQId] || ''}
                    onValueChange={(value) => selectAnswer(slideQId, value)}
                    disabled={practiceMode && revealedAnswers[slideQId]}
                  >
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const optionText = trOption(q, letter, lang);
                        if (!optionText) return null;
                        const isRevealedOption = practiceMode && revealedAnswers[slideQId];
                        const isCorrectOption = letter === q.correctAnswer;
                        const isSelectedOption = letter === answers[slideQId];

                        let optionClass = 'border-black/15 hover:border-black hover:bg-[#FFF0D9]/40';
                        if (isRevealedOption) {
                          if (isCorrectOption) {
                            optionClass = 'border-emerald-500 bg-emerald-50';
                          } else if (isSelectedOption && !isCorrectOption) {
                            optionClass = 'border-red-500 bg-red-50';
                          } else {
                            optionClass = 'border-muted opacity-60';
                          }
                        } else if (isSelectedOption) {
                          optionClass = 'border-cta bg-[#FFF0D9]';
                        }

                        return (
                          <div key={letter} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${optionClass}`}>
                            <RadioGroupItem value={letter} id={`q-${slideQId}-${letter}`} className="sr-only" />
                            <Label htmlFor={`q-${slideQId}-${letter}`} className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                              <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRevealedOption && isCorrectOption ? 'bg-emerald-500 text-white' :
                                isRevealedOption && isSelectedOption && !isCorrectOption ? 'bg-red-500 text-white' :
                                isSelectedOption ? 'bg-cta text-white' : 'bg-muted text-muted-foreground'
                              }`}>
                                {letter}
                              </span>
                              <span className="text-[16px] sm:text-[15px] leading-relaxed min-w-0 break-words"><MathText text={optionText} /></span>
                            </Label>
                            {isRevealedOption && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />}
                            {isRevealedOption && isSelectedOption && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>

                  {/* Practice mode: show result and explanation + Ask AI button */}
                  {practiceMode && revealedAnswers[slideQId] && (
                    <div className="mt-4 p-3 rounded-xl bg-muted/50">
                      <p className="text-sm font-medium mb-1">
                        {t('correctAnswerIs', { letter: q.correctAnswer })}
                      </p>
                      {trExpl(q, lang, explanations[slideQId]) && (
                        <p className="text-xs text-muted-foreground mt-1 ml-7"><MathText text={trExpl(q, lang, explanations[slideQId]) || ''} /></p>
                      )}
                      {!chatOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary hover:bg-[#FFE8DE]"
                          onClick={() => openChat(slideQId, answers[slideQId])}
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          {t('askAiAbout')}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Exam mode: Ask AI button always visible after answering */}
                  {!practiceMode && answers[slideQId] && !chatOpen && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full border-black text-foreground hover:bg-[#FFF0D9]"
                        onClick={() => openChat(slideQId, answers[slideQId])}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {t('askAiAbout')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {loadingExplanations && (
                <p className="text-xs text-center text-muted-foreground mt-4">{t('loadingExpl')}</p>
              )}
                  </div>
                </div>
              </section>
                );
              })}
            </div>

            {/* AI Chat Panel — bottom sheet on mobile, side panel on desktop */}
            {chatOpen && (
              <AiChatPanel
                open={chatOpen}
                onClose={closeChat}
                subtitle={chatUserAnswer ? (
                  chatUserAnswer === shuffledQuestions.find(q => q.id === chatQuestionId)?.correctAnswer
                    ? t('answeredCorrectly')
                    : t('choseX', { a: chatUserAnswer, b: shuffledQuestions.find(q => q.id === chatQuestionId)?.correctAnswer || '' })
                ) : t('askAboutThis')}
                messages={chatMessages}
                loading={chatLoading}
                input={chatInput}
                onInputChange={setChatInput}
                onSend={() => sendChatMessage()}
                endRef={chatEndRef}
                switcher={sheetSwitcher}
                inputPlaceholder={t('askFollowUp')}
              />
            )}

            {/* Group chat panel — bottom sheet on mobile, side panel on desktop */}
            {groupOpen && (
              <GroupChatPanel
                open={groupOpen}
                onClose={closeGroupChat}
                title={t('testChat')}
                subtitle={t('everyoneTaking')}
                messages={groupMessages}
                currentUserId={effectiveUser?.id}
                input={groupInput}
                onInputChange={setGroupInput}
                onSend={sendGroupMessage}
                sending={groupSending}
                endRef={groupEndRef}
                switcher={sheetSwitcher}
                inputPlaceholder={t('messageGroup')}
              />
            )}

            {/* Attached files side panel (desktop) */}
            {filesOpen && !chatOpen && !groupOpen && (
              <div className="hidden lg:block">
                <AttachmentsSidePanel
                  items={(currentTest?.attachments || []) as AttachmentItem[]}
                  onClose={() => setFilesOpen(false)}
                  title={t('attachedFiles', { n: currentTest?.attachments?.length || 0 })}
                />
              </div>
            )}

            {/* Edit Test window — bottom sheet, same chrome as the chat windows;
                its header switcher jumps to Files / AI Tutor / Test Chat and back */}
            {editOpen && (
              <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/50" onClick={() => setEditOpen(false)} />
                <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl bg-white rounded-t-3xl shadow-2xl border-t border-black/10 flex flex-col h-[85vh] animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                    <SheetHeaderSwitcher
                      icon={<Pencil className="w-4 h-4 text-white" />}
                      title={t('editTest')}
                      subtitle={currentTest?.title}
                      options={sheetOptions}
                      onSelect={switchSheet}
                    />
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => setEditOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {editorBody}
                    </div>
                  </div>
                  <div className="shrink-0 border-t bg-white/95 backdrop-blur-md px-4 pt-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                    <Button onClick={() => handleSaveTest(true)} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                      {loading ? t('saving') : t('saveTest')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Bottom navigation bar — flex footer, permanently glued to the bottom edge */}
        <div className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10">
          <div
            className="max-w-7xl mx-auto px-4 pt-2"
            style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-center gap-2">
              {/* Glass arrows — same tile as the number lens (w-14, rounded-xl,
                  same border/gradient/shadows); h-14 aligns edges with the lens. */}
              <button
                type="button"
                onClick={() => goToQuestion(Math.max(0, currentQuestionIdx - 1))}
                disabled={currentQuestionIdx === 0}
                aria-label="Previous question"
                className={`w-14 h-14 shrink-0 flex items-center justify-center text-foreground transition-transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${GLASS_TILE}`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {drumInputMode ? (
                <form
                  onSubmit={e => { e.preventDefault(); jumpToQuestion(numInputRef.current?.value || ''); }}
                  className="relative flex-1 min-w-0 h-16"
                >
                  {/* Typing mode keeps the bar's look EXACTLY as in drum mode: the
                      input occupies the current pill's slot (w-14, centered) and the
                      same glass lens stays on top — no oval pill swap. The number
                      color also mirrors the current pill (cta when answered). */}
                  <input
                    ref={numInputRef}
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    enterKeyHint="go"
                    defaultValue={String(currentQuestionIdx + 1)}
                    onFocus={e => e.currentTarget.select()}
                    placeholder={`1–${shuffledQuestions.length}`}
                    aria-label={t('numQuestions')}
                    className={`absolute inset-y-1 left-1/2 -translate-x-1/2 w-14 bg-transparent border-0 outline-none text-center text-2xl font-extrabold tabular-nums caret-black/40 placeholder:text-base placeholder:font-semibold placeholder:text-muted-foreground/60 ${
                      answers[shuffledQuestions[currentQuestionIdx]?.id || ''] ? 'text-cta' : 'text-foreground'
                    }`}
                  />
                  {/* Glass window — identical lens to drum mode */}
                  <div className={`pointer-events-none absolute inset-y-1 left-1/2 -translate-x-1/2 w-14 ${GLASS_TILE}`} />
                </form>
              ) : (
                <div className="relative flex-1 min-w-0 h-16">
                  <div
                    ref={drumRefCb}
                    onScroll={onDrumScroll}
                    className="h-full flex items-center overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                    style={{
                      scrollSnapType: 'x mandatory',
                      paddingLeft: 'calc(50% - 1.75rem)',
                      paddingRight: 'calc(50% - 1.75rem)',
                    }}
                  >
                    {shuffledQuestions.map((q, idx) => {
                      const qIdNav = q.id || '';
                      const isAnswered = !!answers[qIdNav];
                      const isRevealedNav = practiceMode && revealedAnswers[qIdNav];
                      const isCurrent = idx === currentQuestionIdx;
                      const isCorrectAnswer = isRevealedNav && answers[qIdNav] === q.correctAnswer;
                      const isWrongAnswer = isRevealedNav && answers[qIdNav] && answers[qIdNav] !== q.correctAnswer;

                      return (
                        <button
                          key={idx}
                          data-current={isCurrent}
                          onClick={() => {
                            if (isCurrent) {
                              setDrumInputMode(true); // input pre-fills via defaultValue on mount
                            } else {
                              goToQuestion(idx);
                            }
                          }}
                          title={isCurrent ? t('tapToType') : t('goToQuestion', { n: idx + 1 })}
                          className="w-14 h-full shrink-0 flex items-center justify-center"
                          style={{ scrollSnapAlign: 'center' }}
                        >
                          <span
                            className={`text-2xl font-bold tabular-nums leading-none select-none transition-colors ${
                              isCorrectAnswer ? 'text-emerald-500' :
                              isWrongAnswer ? 'text-red-500' :
                              isCurrent ? (isAnswered ? 'text-cta font-extrabold' : 'text-foreground font-extrabold') :
                              isAnswered ? 'text-cta/70' : 'text-muted-foreground/50'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Glass window — the current number sits under the lens */}
                  <div className={`pointer-events-none absolute inset-y-1 left-1/2 -translate-x-1/2 w-14 ${GLASS_TILE}`} />
                </div>
              )}

              {currentQuestionIdx === shuffledQuestions.length - 1 ? (
                <Button
                  onClick={submitTest}
                  disabled={loading || answeredCount < shuffledQuestions.length}
                  className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
                >
                  {loading ? t('submitting') : t('submitTest')}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToQuestion(Math.min(shuffledQuestions.length - 1, currentQuestionIdx + 1))}
                  aria-label="Next question"
                  className={`w-14 h-14 shrink-0 flex items-center justify-center text-foreground transition-transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${GLASS_TILE}`}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Attached files: mobile bottom sheet (launcher hidden — header Files button opens it) */}
        <AttachmentsBottomSheet
          items={(currentTest?.attachments || []) as AttachmentItem[]}
          open={filesOpen}
          onOpenChange={setFilesOpen}
          switcher={sheetSwitcher}
          hideLauncher
          title={t('attachedFiles', { n: currentTest?.attachments?.length || 0 })}
        />
      </div>
    );
  }

  // HISTORY
  if (effectivePage === 'history') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> {t('back')}</Button>
            <h1 className="text-lg font-bold">{t('testHistory')}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {attempts.length === 0 ? (
            <Card className="rounded-4xl border-dashed border-black/30 bg-white">
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('noAttempts')}</h3>
                <p className="text-muted-foreground mb-4">{t('takeTestHint')}</p>
                <Button onClick={goHome}>{t('browseTests')}</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {attempts.map(attempt => (
                <Card key={attempt.id} className="rounded-4xl border border-black bg-white">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{attempt.test?.title || t('unknownTest')}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(attempt.startedAt).toLocaleDateString()} {t('at')} {new Date(attempt.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {attempt.completed ? (
                        <>
                          <p className={`text-lg font-bold ${
                            attempt.totalQuestions > 0 && (attempt.score / attempt.totalQuestions) >= 0.7 ? 'text-emerald-600' :
                            attempt.totalQuestions > 0 && (attempt.score / attempt.totalQuestions) >= 0.4 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {attempt.score}/{attempt.totalQuestions}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attempt.totalQuestions > 0 ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0}%
                          </p>
                        </>
                      ) : (
                        <Badge variant="outline">{t('inProgress')}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
}
