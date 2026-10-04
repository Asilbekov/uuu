'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, setUser } from '@/lib/api';
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
import { AttachmentItem, AttachmentsEditor, AttachmentsList, AttachmentsBottomSheet, AttachmentsSidePanel } from '@/components/attachments';
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
  Users,
  ChevronDown,
  ChevronRight,
  X,
  Hash,
  Palette,
  Atom,
  Magnet,
  Zap,
  Telescope,
  Rocket,
  Orbit,
  Globe,
  Mountain,
  Waves,
  Thermometer,
  FlaskConical as FlaskConicalIcon,
  FlaskRound,
  TestTubes,
  Dna,
  Microscope,
  Bug,
  Leaf,
  Brain,
  Stethoscope,
  HeartPulse,
  Pill,
  Calculator,
  Sigma,
  Ruler,
  Shapes,
  Cpu,
  Cog,
  Bot,
  Binary,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  Languages,
  ClipboardList,
} from 'lucide-react';
import { PhotoshopColorPicker } from '@/components/color-picker';

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

// Professional science icon pack (Lucide vector icons) for the test card cover
const COVER_ICONS: { name: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { name: 'Atom', Icon: Atom },
  { name: 'Magnet', Icon: Magnet },
  { name: 'Zap', Icon: Zap },
  { name: 'Telescope', Icon: Telescope },
  { name: 'Rocket', Icon: Rocket },
  { name: 'Orbit', Icon: Orbit },
  { name: 'Globe', Icon: Globe },
  { name: 'Mountain', Icon: Mountain },
  { name: 'Waves', Icon: Waves },
  { name: 'Thermometer', Icon: Thermometer },
  { name: 'FlaskConical', Icon: FlaskConicalIcon },
  { name: 'FlaskRound', Icon: FlaskRound },
  { name: 'TestTubes', Icon: TestTubes },
  { name: 'Dna', Icon: Dna },
  { name: 'Microscope', Icon: Microscope },
  { name: 'Bug', Icon: Bug },
  { name: 'Leaf', Icon: Leaf },
  { name: 'Brain', Icon: Brain },
  { name: 'Stethoscope', Icon: Stethoscope },
  { name: 'HeartPulse', Icon: HeartPulse },
  { name: 'Pill', Icon: Pill },
  { name: 'Calculator', Icon: Calculator },
  { name: 'Sigma', Icon: Sigma },
  { name: 'Ruler', Icon: Ruler },
  { name: 'Shapes', Icon: Shapes },
  { name: 'Cpu', Icon: Cpu },
  { name: 'Cog', Icon: Cog },
  { name: 'Bot', Icon: Bot },
  { name: 'Binary', Icon: Binary },
  { name: 'BookOpen', Icon: BookOpenIcon },
  { name: 'GraduationCap', Icon: GraduationCapIcon },
  { name: 'Languages', Icon: Languages },
];
const COVER_ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> =
  Object.fromEntries(COVER_ICONS.map(i => [i.name, i.Icon]));

// Auto icon for the cover: derived from the first tag, otherwise from the legacy topic
function autoCoverIconName(test: { topic?: string | null; tags?: string[] | null }): string {
  const tag = test.tags?.[0];
  if (tag) return COVER_ICONS[tagHash(tag) % COVER_ICONS.length].name;
  switch (test.topic) {
    case 'Physics': return 'Atom';
    case 'Chemistry': return 'FlaskConical';
    case 'Mathematics': return 'Calculator';
    default: return 'BookOpen';
  }
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

export default function ChemTestApp() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
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
      api.getTests().then(data => setTests(data)).catch(() => { hasLoadedRef.current = false; }),
      api.getAttempts().then(data => setAttempts(data)).catch(() => {}),
    ]).finally(() => setBooting(false));
  }, []);

  // Apply hydrated user - use hydratedUser if no explicit login has happened
  // Only use hydratedUser after mount to avoid hydration mismatch
  const effectiveUser = user || (mounted ? hydratedUser : null);
  const effectivePage = page === 'auth' && mounted && hydratedUser ? 'dashboard' : page;

  const loadTests = useCallback(async () => {
    try {
      const data = await api.getTests();
      setTests(data);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  }, [toast]);

  // Load tests when navigating to dashboard (skipped when boot already restored the data)
  useEffect(() => {
    if (effectivePage === 'dashboard' && effectiveUser && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      Promise.all([
        api.getTests().then(data => {
          setTests(data);
        }).catch(() => {}),
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

  // When the visible test changes (swipe): apply its defaults, sync feed scroll, lazy-fetch full test for attachments
  useEffect(() => {
    if (effectivePage !== 'dashboard') return;
    if (tests.length === 0) return;
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
  }, [dashTestIdx, effectivePage, tests]);

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
      const [userTests, userAttempts] = await Promise.all([
        api.getTests().catch(() => [] as Test[]),
        api.getAttempts().catch(() => [] as Attempt[]),
      ]);
      setTests(userTests);
      setAttempts(userAttempts);
      setPage('dashboard');
      toast({ title: 'Success', description: authMode === 'signup' ? 'Account created!' : 'Welcome back!' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setUserState(null);
    setPage('auth');
    setEmail('');
    setPassword('');
    setName('');
  };



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
      setQuestions(fullTest.questions.map(q => ({
        text: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        correctAnswer: q.correctAnswer,
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

  const handleSaveTest = async () => {
    if (!testTitle) {
      toast({ title: 'Error', description: 'Test title is required', variant: 'destructive' });
      return;
    }
    if (questions.some(q => !q.text || !q.optionA || !q.optionB || !q.optionC || !q.optionD)) {
      toast({ title: 'Error', description: 'All questions must have text and options A-D', variant: 'destructive' });
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
        isPublic: true,
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
        toast({ title: 'Test updated!', description: 'Your test has been updated successfully.' });
      } else {
        await api.createTest(data);
        toast({ title: 'Test created!', description: 'Your new test has been created.' });
      }
      setPage('dashboard');
      hasLoadedRef.current = false;
      await loadTests();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
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
      setPage('take-test');

      // If practice mode, pre-fetch explanations
      if (practiceMode) {
        setLoadingExplanations(true);
        try {
          const ids = qList.map(q => q.id).filter(Boolean) as string[];
          if (ids.length > 0) {
            const result = await api.generateExplanations(ids);
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
  const startFromDashboard = async () => {
    const t = tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)];
    if (!t || loading) return;
    setLoading(true);
    try {
      const fullTest = dashFullTests[t.id] || await api.getTest(t.id);
      setCurrentTest(fullTest);
      const totalQ = fullTest.questions.length;
      const count = Math.min(Math.max(1, selectedQuestionCount || totalQ), totalQ);
      setSelectedQuestionCount(count);
      setFilesOpen(false);
      setChatOpen(false);
      setGroupOpen(false);
      await startTestWith(fullTest, count);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      setLoading(false);
    }
  };

  // Track which test is on screen while swiping the dashboard feed.
  // Same rule as the take-test feed: commit only after the swipe settles —
  // mid-gesture setState re-renders every cover slide while the card moves.
  const dashSettleCommit = () => {
    dashFeedSettleTimerRef.current = null;
    const el = dashFeedRef.current;
    if (!el || el.clientHeight === 0) return;
    if (Date.now() < dashFeedTouchUntilRef.current) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setDashTestIdx(Math.min(tests.length - 1, Math.max(0, idx)));
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
      const val = q[`option${letter}` as keyof Question] as string | undefined | null;
      if (val) options[letter] = val;
    }
    return {
      text: q.text,
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
        ? `I chose answer ${userAnswer}. Can you explain this question?`
        : 'Can you help me understand this question?';
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
        setChatMessages(prev => [...prev, { role: 'assistant', content: '⏳ AI is currently busy. Please wait a moment and try sending your message again.' }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: result.error || 'Sorry, something went wrong. Please try again.' }]);
      }
    } catch (e: any) {
      console.error('Chat error:', e);
      const errMsg = e?.message || '';
      if (errMsg.includes('429') || errMsg.includes('rate') || errMsg.includes('Too many')) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: '⏳ AI is currently busy. Please wait a moment and try sending your message again.' }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
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
      setShowResult(true);
      toast({ title: 'Test completed!', description: 'Your answers have been submitted.' });

      // Load explanations for the review section
      try {
        const ids = shuffledQuestions.map(q => q.id).filter(Boolean) as string[];
        if (ids.length > 0) {
          const result = await api.generateExplanations(ids);
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
              {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()} />
            </div>
            <Button className="w-full h-11 rounded-full text-base font-semibold" onClick={handleAuth} disabled={loading}>
              {loading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {authMode === 'login' ? (
                <>Don&apos;t have an account? <button className="text-primary underline" onClick={() => setAuthMode('signup')}>Sign up</button></>
              ) : (
                <>Already have an account? <button className="text-primary underline" onClick={() => setAuthMode('login')}>Sign in</button></>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    );
  }

  // DASHBOARD
  if (effectivePage === 'dashboard') {
    const curDashTest = tests.length > 0 ? tests[Math.min(Math.max(0, dashTestIdx), tests.length - 1)] : null;

    return (
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Button onClick={startCreateTest} className="rounded-full bg-primary hover:bg-primary/90 shrink-0">
                <Plus className="w-4 h-4 mr-2" /> Create Test
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditMode(v => !v)}
                className={`rounded-full shrink-0 ${editMode ? 'bg-cta hover:bg-cta/90 text-white border-cta' : 'border-black'}`}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Test
              </Button>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{effectiveUser?.name}</p>
                <p className="text-xs text-muted-foreground">{effectiveUser?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full border border-black hover:bg-muted">
                <LogIn className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </header>

        {tests.length === 0 ? (
          <main className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <Card className="rounded-4xl border-dashed border-black/30 bg-white">
                <CardContent className="py-12 text-center">
                  <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tests yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first test to get started</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={startCreateTest}><Plus className="w-4 h-4 mr-2" /> Create Test</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        ) : (
          <>
            {/* TikTok-style vertical feed — swipe up/down between tests */}
            <div
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
                // Explicitly picked color wins; otherwise derive from the first tag / topic
                const bgClass = test.coverColor ? '' : coverBgFor(test);
                const bgStyle = test.coverColor ? { backgroundColor: test.coverColor } : undefined;
                return (
                  <section key={test.id} style={bgStyle} className={`relative h-full snap-start snap-always overflow-y-auto [scrollbar-width:none] ${bgClass}`}>
                    <div className="min-h-full flex flex-col items-center justify-center px-4 py-4">
                      <div className="w-full max-w-md space-y-4">
                        {/* Cover header — no borders, blends seamlessly with the card */}
                        <div className="relative h-44 overflow-hidden">
                          <div style={bgStyle} className={`w-full h-full flex flex-col items-center justify-center px-4 text-center ${bgClass}`}>
                            {(() => {
                              const Picked = test.coverIcon ? COVER_ICON_MAP[test.coverIcon] : null;
                              if (Picked) return <Picked className="w-16 h-16 text-cta" strokeWidth={1.5} />;
                              if (test.coverIcon) return <span className="text-6xl leading-none">{test.coverIcon}</span>; // legacy emoji
                              const AutoIcon = COVER_ICON_MAP[autoCoverIconName(test)] || BookOpenIcon;
                              return <AutoIcon className="w-16 h-16 text-cta" strokeWidth={1.5} />;
                            })()}
                            <p className="text-lg font-bold text-cta leading-snug line-clamp-2 px-2 mt-3">{test.title}</p>
                          </div>
                        </div>

                        {isCur && editMode && (
                          <div className="space-y-2 text-center">
                            <p className="text-xs text-muted-foreground">Edit mode is on — swipe up/down to choose a test</p>
                            {test.creatorId === effectiveUser?.id && (
                              <Button size="sm" variant="outline" className="rounded-full border-black text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(test.id)}>
                                <Trash2 className="w-3 h-3 mr-1" /> Delete Test
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Controls on every slide — nothing pops in mid-swipe */}
                        {!editMode && (
                          <>
                            {/* Question count — editable counter + slider */}
                            <div className="space-y-3">
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
                                  className="text-3xl font-bold w-20 text-center bg-white rounded-xl border-2 border-black/10 focus:border-cta outline-none py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSelectedQuestionCount(Math.min(totalQ, selectedQuestionCount + 1))} disabled={selectedQuestionCount >= totalQ}>
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="px-6">
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
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setPracticeMode(false)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                  !practiceMode
                                    ? 'border-cta bg-[#FFF0D9] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <ListChecks className="w-4 h-4 text-cta" />
                                  <span className="font-semibold text-sm">Exam Mode</span>
                                </div>
                                <p className="text-xs text-muted-foreground">See results at the end</p>
                              </button>
                              <button
                                onClick={() => setPracticeMode(true)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                  practiceMode
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                  <span className="font-semibold text-sm">Practice Mode</span>
                                </div>
                                <p className="text-xs text-muted-foreground">See correct answer right away</p>
                              </button>
                            </div>

                            {/* Randomization — tap a card to toggle, styled like the mode cards */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setStartRandomizeQ(v => !v)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                  startRandomizeQ
                                    ? 'border-cta bg-[#FFF0D9] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Shuffle className="w-4 h-4 text-cta shrink-0" />
                                  <span className="font-semibold text-sm">Randomize Questions</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{startRandomizeQ ? 'Question order is shuffled' : 'Questions in original order'}</p>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStartRandomizeO(v => !v)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                  startRandomizeO
                                    ? 'border-primary bg-[#FFE8DE] shadow-md'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Shuffle className="w-4 h-4 text-primary shrink-0" />
                                  <span className="font-semibold text-sm">Randomize Answers</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{startRandomizeO ? 'Answer order is shuffled' : 'Answers in original order'}</p>
                              </button>
                            </div>

                            {/* Attached files — collapsed to one line; arrow expands/collapses */}
                            {files.length > 0 && (
                              <div className="rounded-2xl border border-black bg-white overflow-hidden">
                                <button
                                  onClick={() => setStartFilesExpanded(v => !v)}
                                  className="w-full flex items-center gap-1.5 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
                                >
                                  <Paperclip className="w-4 h-4 shrink-0" />
                                  <span className="font-semibold text-sm">Attached Files ({files.length})</span>
                                  {startFilesExpanded ? (
                                    <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
                                  )}
                                </button>
                                {startFilesExpanded && (
                                  <div className="px-3 pb-3">
                                    <AttachmentsList items={files} />
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Bottom bar — Start Test for the test on screen */}
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
                    <Edit className="w-4 h-4 mr-2" /> Edit This Test
                  </Button>
                ) : (
                  <Button onClick={startFromDashboard} disabled={loading || !curDashTest} className="w-full rounded-full bg-primary hover:bg-primary/90">
                    {loading ? 'Loading...' : <><Play className="w-4 h-4 mr-2" /> Start {practiceMode ? 'Practice' : 'Test'} ({selectedQuestionCount} questions)</>}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Test?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. All questions and attempts will be deleted.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDeleteTest(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // CREATE / EDIT TEST
  if (effectivePage === 'create-test' || effectivePage === 'edit-test') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">{editingTestId ? 'Edit Test' : 'Create New Test'}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pt-6 pb-32 space-y-6">
          <Card className="rounded-4xl border border-black bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setEditorInfoExpanded(v => !v)}
              className="w-full flex items-center gap-1.5 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-base">Test Information</span>
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
                  <Label>Test Title</Label>
                  <Input value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="e.g., Chemistry: Acids & Bases" />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
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
                        placeholder={testTags.length === 0 ? 'Type a tag and press Enter…' : ''}
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
                  <p className="text-xs text-muted-foreground">Press Enter to add your own tag (max 10) — tags you use are offered as suggestions next time</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={testDescription} onChange={e => setTestDescription(e.target.value)} placeholder="Brief description of this test..." rows={2} />
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
              <span className="font-semibold text-base">Attached Files ({formAttachments.length})</span>
              {editorFilesExpanded ? (
                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
            {editorFilesExpanded && (
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  Audio, video, PDF or links students can open while taking this test —
                  audio and video play right inside the test; large files are best added by link.
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
              <span className="font-semibold text-base">Cover</span>
              {editorCoverExpanded ? (
                <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
            {editorCoverExpanded && (
            <CardContent className="space-y-4 pt-0">
              <p className="text-xs text-muted-foreground">
                Pick an icon and a card color for the test card in the feed.
              </p>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Icon</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTestCoverIcon('')}
                    title="Auto — based on the first tag"
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                      testCoverIcon === '' ? 'border-cta bg-[#FFF0D9] shadow-md' : 'border-black/10 bg-muted/30 hover:bg-muted'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-cta" />
                  </button>
                  {COVER_ICONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setTestCoverIcon(name)}
                      title={name}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                        testCoverIcon === name ? 'border-cta bg-[#FFF0D9] shadow-md' : 'border-black/10 bg-muted/30 hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Card Color</Label>
                  <button
                    type="button"
                    onClick={() => setTestCoverColor('')}
                    title="Auto — based on the first tag"
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border-2 transition-all ${
                      testCoverColor === '' ? 'border-cta bg-[#FFF0D9] text-cta font-semibold' : 'border-black/10 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Auto
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
              <span className="font-semibold text-base">Questions ({questions.length})</span>
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
                  <Shuffle className="w-3 h-3 mr-1" /> Shuffle All
                </Button>
                <Button size="sm" onClick={addQuestion}>
                  <Plus className="w-3 h-3 mr-1" /> Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <Card key={idx} className="rounded-3xl border border-black bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Question {idx + 1}</Badge>
                        <Button variant="ghost" size="sm" className="text-destructive h-7 w-7 p-0" onClick={() => removeQuestion(idx)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea value={q.text} onChange={e => updateQuestion(idx, 'text', e.target.value)} placeholder="Enter question text..." rows={2} />
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
                              placeholder={`Option ${letter}`}
                              className="text-sm"
                            />
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={q.correctAnswer === letter}
                              onChange={() => updateQuestion(idx, 'correctAnswer', letter)}
                              className="shrink-0 accent-[#fe5933]"
                              title="Mark as correct"
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
        </main>

        {/* Bottom action bar — fixed to the screen edge, never rises with content */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10">
          <div
            className="max-w-4xl mx-auto px-4 pt-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <Button onClick={handleSaveTest} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
              {loading ? 'Saving...' : editingTestId ? 'Save' : 'Create Test'}
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
            <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">Start Test</h1>
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
                  <h3 className="text-lg font-semibold mb-1">How many questions?</h3>
                  <p className="text-sm text-muted-foreground">Choose how many questions you want to answer</p>
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
                    aria-label="Number of questions"
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
                  <h3 className="text-lg font-semibold mb-1">Test Mode</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to take the test</p>
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
                      <span className="font-semibold text-sm">Exam Mode</span>
                    </div>
                    <p className="text-xs text-muted-foreground">See results at the end</p>
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
                      <span className="font-semibold text-sm">Practice Mode</span>
                    </div>
                    <p className="text-xs text-muted-foreground">See correct answer right away</p>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Randomization Settings */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">Randomization</h3>
                  <p className="text-sm text-muted-foreground">Choose the order of questions and answers</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStartRandomizeQ(v => !v)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      startRandomizeQ
                        ? 'border-cta bg-[#FFF0D9] shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Shuffle className="w-4 h-4 text-cta shrink-0" />
                      <span className="font-semibold text-sm">Randomize Questions</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{startRandomizeQ ? 'Question order is shuffled' : 'Questions in original order'}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartRandomizeO(v => !v)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      startRandomizeO
                        ? 'border-primary bg-[#FFE8DE] shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Shuffle className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-sm">Randomize Answers</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{startRandomizeO ? 'Answer order is shuffled' : 'Answers in original order'}</p>
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
                    <span className="font-semibold text-sm">Attached Files ({currentTest.attachments!.length})</span>
                    {startFilesExpanded ? (
                      <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
                    )}
                  </button>
                  {startFilesExpanded && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Audio, video and study files for this test — also available during the test via the up arrow at the bottom.
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
            <Button onClick={startTest} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
              {loading ? 'Loading...' : <><Play className="w-4 h-4 mr-2" /> Start {practiceMode ? 'Practice' : 'Test'} ({selectedQuestionCount} questions)</>}
            </Button>
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

      // Bottom-sheet window switcher (Attached Files / AI Tutor / Test Chat)
      const sheetOptions = [
        ...(currentTest?.attachments?.length ? [{
          key: 'files',
          label: `Attached Files (${currentTest.attachments.length})`,
          icon: <Paperclip className="w-3.5 h-3.5" />,
          active: filesOpen,
        }] : []),
        { key: 'ai', label: 'AI Tutor', icon: <MessageSquare className="w-3.5 h-3.5" />, active: chatOpen },
        { key: 'group', label: 'Test Chat', icon: <Users className="w-3.5 h-3.5" />, active: groupOpen },
      ];
      const switchSheet = (key: string) => {
        if (key === 'files') {
          setFilesOpen(true);
          setChatOpen(false);
          setGroupOpen(false);
        } else if (key === 'ai') {
          setFilesOpen(false);
          setGroupOpen(false);
          openChat(shuffledQuestions[0]?.id || '', answers[shuffledQuestions[0]?.id || '']);
        } else if (key === 'group') {
          setFilesOpen(false);
          setChatOpen(false);
          setGroupOpen(true);
        }
      };
      const sheetSwitcher = { options: sheetOptions, onSelect: switchSheet };
      return (
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full shrink-0"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                {(currentTest?.attachments?.length || 0) > 0 ? (
                  <Button
                    variant={filesOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { const next = !filesOpen; setFilesOpen(next); if (next) { setGroupOpen(false); if (chatOpen) closeChat(); } }}
                    className={`gap-1.5 ${filesOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden sm:inline">Files ({currentTest!.attachments!.length})</span>
                    <span className="sm:hidden">{currentTest!.attachments!.length}</span>
                  </Button>
                ) : (
                  <h1 className="text-lg font-bold">Test Results</h1>
                )}
              </div>
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setChatOpen(true); setFilesOpen(false); setGroupOpen(false); openChat(shuffledQuestions[0]?.id || '', answers[shuffledQuestions[0]?.id || '']); }}
                  className="gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Tutor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openGroupChat}
                  className="gap-1.5"
                  title="Chat with everyone who took this test"
                >
                  <Users className="w-4 h-4" />
                  Chat
                </Button>
              </>
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
                  {pct >= 70 ? 'Excellent work!' : pct >= 40 ? 'Good effort! Keep studying.' : 'Keep practicing! You can do better.'}
                </p>
                <Progress value={pct} className="h-3" />
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold">Review Answers</h3>
            {shuffledQuestions.map((q, idx) => {
              const selected = answers[q.id || ''] || '';
              const isCorrect = selected === q.correctAnswer;
              return (
                <Card key={idx} className={`rounded-4xl border border-black bg-white ${isCorrect ? 'ring-2 ring-emerald-300' : 'ring-2 ring-red-300'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      <p className="font-medium text-sm">{idx + 1}. <MathText text={q.text} /></p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const optionText = q[`option${letter}` as keyof Question] as string;
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
                    {explanations[q.id || ''] && (
                      <p className="text-xs text-muted-foreground mt-2 ml-7 italic"><MathText text={explanations[q.id || ''] || ''} /></p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 ml-7 text-primary hover:bg-[#FFE8DE] text-xs"
                      onClick={() => openChat(q.id || '', selected, { force: true })}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Ask AI Tutor
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
                  subtitle="Ask about any question"
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
                  subtitle="Everyone who took this test"
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
            </div>
          </main>

          {/* Bottom action bar — fixed to the screen edge, never rises with content */}
          <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10">
            <div
              className="max-w-7xl mx-auto px-4 pt-3"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <Button onClick={() => openStartTest(currentTest!)} className="w-full rounded-full bg-primary hover:bg-primary/90">
                <RefreshCw className="w-4 h-4 mr-2" /> Retry Test
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
        label: `Attached Files (${currentTest.attachments.length})`,
        icon: <Paperclip className="w-3.5 h-3.5" />,
        active: filesOpen,
      }] : []),
      { key: 'ai', label: 'AI Tutor', icon: <MessageSquare className="w-3.5 h-3.5" />, active: chatOpen },
      { key: 'group', label: 'Test Chat', icon: <Users className="w-3.5 h-3.5" />, active: groupOpen },
    ];
    const switchSheet = (key: string) => {
      if (key === 'files') {
        setFilesOpen(true);
        setChatOpen(false);
        setGroupOpen(false);
      } else if (key === 'ai') {
        setFilesOpen(false);
        setGroupOpen(false);
        openChat(qId, answers[qId]);
      } else if (key === 'group') {
        setFilesOpen(false);
        setChatOpen(false);
        setGroupOpen(true);
      }
    };
    const sheetSwitcher = { options: sheetOptions, onSelect: switchSheet };

    return (
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden">
        <header className="shrink-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Button variant="ghost" size="sm" onClick={goHome} className="shrink-0"><Home className="w-4 h-4" /></Button>
                <span className="text-sm font-medium line-clamp-2 leading-snug min-w-0">{currentTest?.title}</span>
                {practiceMode && <Badge variant="outline" className="text-xs rounded-full bg-[#FFE8DE] text-primary border-primary/40 shrink-0">Practice Mode</Badge>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-muted-foreground hidden sm:inline">{answeredCount}/{shuffledQuestions.length} answered</span>
                {(currentTest?.attachments?.length || 0) > 0 && (
                  <Button
                    variant={filesOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { const next = !filesOpen; setFilesOpen(next); if (next) { setGroupOpen(false); if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); setChatQuestionObj(null); } } }}
                    className={`gap-1.5 ${filesOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden sm:inline">Files ({currentTest!.attachments!.length})</span>
                    <span className="sm:hidden">{currentTest!.attachments!.length}</span>
                  </Button>
                )}
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setChatOpen(true); setFilesOpen(false); setGroupOpen(false); openChat(qId, answers[qId]); }}
                    className="gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">AI Tutor</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openGroupChat}
                    className="gap-1.5"
                    title="Chat with everyone taking this test"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Chat</span>
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
                    <Badge variant="secondary" className="text-sm rounded-full">Question {idx + 1} of {shuffledQuestions.length}</Badge>
                    {practiceMode && slideRevealed && (
                      answers[slideQId] === q.correctAnswer ? (
                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Correct!</Badge>
                      ) : (
                        <Badge className="rounded-full bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Wrong</Badge>
                      )
                    )}
                  </div>
                  <p className="text-lg font-medium mt-2"><MathText text={q.text} /></p>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[slideQId] || ''}
                    onValueChange={(value) => selectAnswer(slideQId, value)}
                    disabled={practiceMode && revealedAnswers[slideQId]}
                  >
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const optionText = q[`option${letter}` as keyof Question] as string;
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
                        Correct answer: <span className="text-emerald-600">{q.correctAnswer}</span>
                      </p>
                      {explanations[slideQId] && (
                        <p className="text-xs text-muted-foreground mt-1 ml-7"><MathText text={explanations[slideQId]} /></p>
                      )}
                      {!chatOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary hover:bg-[#FFE8DE]"
                          onClick={() => openChat(slideQId, answers[slideQId])}
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Ask AI Tutor about this question
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
                        Ask AI Tutor about this question
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {loadingExplanations && (
                <p className="text-xs text-center text-muted-foreground mt-4">Loading explanations...</p>
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
                    ? '✓ You answered correctly'
                    : `✗ You chose ${chatUserAnswer} — correct is ${shuffledQuestions.find(q => q.id === chatQuestionId)?.correctAnswer}`
                ) : 'Ask about this question'}
                messages={chatMessages}
                loading={chatLoading}
                input={chatInput}
                onInputChange={setChatInput}
                onSend={() => sendChatMessage()}
                endRef={chatEndRef}
                switcher={sheetSwitcher}
              />
            )}

            {/* Group chat panel — bottom sheet on mobile, side panel on desktop */}
            {groupOpen && (
              <GroupChatPanel
                open={groupOpen}
                onClose={closeGroupChat}
                subtitle="Everyone taking this test"
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

            {/* Attached files side panel (desktop) */}
            {filesOpen && !chatOpen && !groupOpen && (
              <div className="hidden lg:block">
                <AttachmentsSidePanel
                  items={(currentTest?.attachments || []) as AttachmentItem[]}
                  onClose={() => setFilesOpen(false)}
                />
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
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shrink-0"
                onClick={() => goToQuestion(Math.max(0, currentQuestionIdx - 1))}
                disabled={currentQuestionIdx === 0}
                aria-label="Previous question"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

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
                    aria-label="Question number"
                    className={`absolute inset-y-1 left-1/2 -translate-x-1/2 w-14 bg-transparent border-0 outline-none text-center text-2xl font-extrabold tabular-nums caret-black/40 placeholder:text-base placeholder:font-semibold placeholder:text-muted-foreground/60 ${
                      answers[shuffledQuestions[currentQuestionIdx]?.id || ''] ? 'text-cta' : 'text-foreground'
                    }`}
                  />
                  {/* Glass window — identical lens to drum mode */}
                  <div className="pointer-events-none absolute inset-y-1 left-1/2 -translate-x-1/2 w-14 rounded-xl border border-black/15 bg-gradient-to-b from-white/70 via-white/5 to-white/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.08)]" />
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
                          title={isCurrent ? 'Tap to type a question number' : `Go to question ${idx + 1}`}
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
                  <div className="pointer-events-none absolute inset-y-1 left-1/2 -translate-x-1/2 w-14 rounded-xl border border-black/15 bg-gradient-to-b from-white/70 via-white/5 to-white/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.08)]" />
                </div>
              )}

              {currentQuestionIdx === shuffledQuestions.length - 1 ? (
                <Button
                  onClick={submitTest}
                  disabled={loading || answeredCount < shuffledQuestions.length}
                  className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
                >
                  {loading ? 'Submitting...' : 'Submit Test'}
                </Button>
              ) : (
                <Button
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={() => goToQuestion(Math.min(shuffledQuestions.length - 1, currentQuestionIdx + 1))}
                  aria-label="Next question"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
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
            <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">Test History</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {attempts.length === 0 ? (
            <Card className="rounded-4xl border-dashed border-black/30 bg-white">
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No attempts yet</h3>
                <p className="text-muted-foreground mb-4">Take a test to see your history here</p>
                <Button onClick={goHome}>Browse Tests</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {attempts.map(attempt => (
                <Card key={attempt.id} className="rounded-4xl border border-black bg-white">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{attempt.test?.title || 'Unknown Test'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(attempt.startedAt).toLocaleDateString()} at {new Date(attempt.startedAt).toLocaleTimeString()}
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
                        <Badge variant="outline">In Progress</Badge>
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
