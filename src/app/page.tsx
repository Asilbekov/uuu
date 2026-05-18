'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, setUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Beaker,
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
  BarChart3,
  Minus,
  ListChecks,
  MessageSquare,
  Send,
  X,
  Bot,
  Sparkles,
} from 'lucide-react';

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
  hasCoverImage?: boolean;
  questions: Question[];
  _count?: { questions: number; attempts: number };
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

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Test creation state
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testTopic, setTestTopic] = useState('Chemistry');
  const [randomizeQ, setRandomizeQ] = useState(true);
  const [randomizeO, setRandomizeO] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' },
  ]);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Test taking state
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState(false);

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatQuestionId, setChatQuestionId] = useState<string>('');
  const [chatUserAnswer, setChatUserAnswer] = useState<string>('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Cover images state
  const [coverImages, setCoverImages] = useState<Record<string, string>>({});
  const [generatingCovers, setGeneratingCovers] = useState<Record<string, boolean>>({});

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Read user from localStorage only after mount (prevents hydration mismatch)
  const [hydratedUser, setHydratedUser] = useState<{ id: string; email: string; name: string } | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem('chemtest_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHydratedUser(parsed);
      } catch { /* ignore */ }
    }
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

  // Generate cover image for a test
  const generateCover = async (testId: string, retryCount = 0) => {
    if (coverImages[testId] || generatingCovers[testId]) return;
    setGeneratingCovers(prev => ({ ...prev, [testId]: true }));
    try {
      const result = await api.generateCover(testId);
      if (result.coverImage) {
        setCoverImages(prev => ({ ...prev, [testId]: result.coverImage }));
      }
    } catch (e: any) {
      console.error('Failed to generate cover for test', testId, e);
      // If rate limited, retry after a delay
      if (e?.message?.includes('429') || e?.message?.includes('Rate limited') || e?.message?.includes('Too many requests')) {
        if (retryCount < 3) {
          const delay = (retryCount + 1) * 30000; // 30s, 60s, 90s
          setTimeout(() => {
            generateCover(testId, retryCount + 1);
          }, delay);
        }
      }
    }
    setGeneratingCovers(prev => ({ ...prev, [testId]: false }));
  };

  // Load tests when navigating to dashboard
  const hasLoadedRef = React.useRef(false);
  useEffect(() => {
    if (effectivePage === 'dashboard' && effectiveUser && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      Promise.all([
        api.getTests().then(data => {
          setTests(data);
          // Auto-generate covers for tests that don't have them yet (staggered to avoid rate limiting)
          const testsNeedingCovers = data.filter((test: Test) => !test.hasCoverImage);
          testsNeedingCovers.forEach((test: Test, index: number) => {
            setTimeout(() => {
              generateCover(test.id);
            }, index * 10000); // 10 seconds between each generation
          });
        }).catch(() => {}),
        api.getAttempts().then(data => setAttempts(data)).catch(() => {}),
      ]);
    }
  }, [page, user, mounted, hydratedUser]);

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
    setTestTopic('Chemistry');
    setRandomizeQ(true);
    setRandomizeO(true);
    setQuestions([{ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
    setEditingTestId(null);
  };

  const startCreateTest = () => {
    resetTestForm();
    setPage('create-test');
  };

  const startEditTest = async (test: Test) => {
    setLoading(true);
    try {
      const fullTest = await api.getTest(test.id);
      setCurrentTest(fullTest);
      setTestTitle(fullTest.title);
      setTestDescription(fullTest.description);
      setTestTopic(fullTest.topic);
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
        topic: testTopic,
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
      setPracticeMode(false);
      setPage('start-test');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const startTest = async () => {
    if (!currentTest) return;
    setLoading(true);
    try {
      // Apply randomization
      let qList = [...currentTest.questions];
      if (currentTest.randomizeQuestions) {
        qList = shuffleArray(qList);
      }
      if (currentTest.randomizeOptions) {
        qList = qList.map(q => shuffleOptions(q));
      }

      // Slice to selected count
      qList = qList.slice(0, selectedQuestionCount);

      // Create attempt with the actual number of questions being answered
      const attempt = await api.createAttempt(currentTest.id, selectedQuestionCount);
      setCurrentAttempt(attempt);
      setShuffledQuestions(qList);
      setCurrentQuestionIdx(0);
      setAnswers({});
      setShowResult(false);
      setRevealedAnswers({});
      setExplanations({});
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

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    // In practice mode, reveal the correct answer immediately
    if (practiceMode) {
      setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
      // Find the current question to check if answer is wrong
      const currentQ = shuffledQuestions.find(q => q.id === questionId);
      if (currentQ && answer !== currentQ.correctAnswer) {
        // Auto-open AI chat on wrong answer
        openChat(questionId, answer);
      }
    }
  };

  const openChat = (questionId: string, userAnswer?: string) => {
    // Only reset chat if it's a different question
    if (chatQuestionId !== questionId) {
      setChatMessages([]);
      setChatInput('');
      setChatQuestionId(questionId);
      setChatUserAnswer(userAnswer || '');
      // Auto-send initial question to AI
      sendChatMessage(questionId, [], userAnswer);
    }
    setChatOpen(true);
  };

  const sendChatMessage = async (questionId?: string, existingMessages?: { role: 'user' | 'assistant'; content: string }[], userAnswer?: string) => {
    const qId = questionId || chatQuestionId;
    const msgs = existingMessages || chatMessages;
    const uAns = userAnswer !== undefined ? userAnswer : chatUserAnswer;

    if (!chatInput.trim() && existingMessages) {
      // Initial auto-message
    } else if (!chatInput.trim()) {
      return;
    }

    const userMsg = existingMessages ? undefined : { role: 'user' as const, content: chatInput };
    const newMsgs = userMsg ? [...msgs, userMsg] : msgs;
    if (userMsg) setChatMessages(newMsgs);
    setChatInput('');
    setChatLoading(true);

    try {
      const result = await api.chat(qId, newMsgs, uAns);
      const assistantMsg = { role: 'assistant' as const, content: result.response };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
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

  // AUTH PAGE
  if (effectivePage === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
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
            <Button className="w-full" onClick={handleAuth} disabled={loading}>
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
    const totalQuestions = tests.reduce((sum, t) => sum + (t._count?.questions || 0), 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">ChemTest</h1>
                <p className="text-xs text-muted-foreground">Chemistry Test Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{effectiveUser?.name}</p>
                <p className="text-xs text-muted-foreground">{effectiveUser?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogIn className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={startCreateTest} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700">
              <Plus className="w-4 h-4 mr-2" /> Create New Test
            </Button>

            <Button variant="outline" onClick={() => { api.getAttempts().then(d => setAttempts(d)).catch(() => {}); setPage('history'); }}>
              <Clock className="w-4 h-4 mr-2" /> Test History
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-md bg-gradient-to-br from-violet-500 to-violet-600 text-white">
              <CardContent className="p-4 flex items-center gap-3">
                <BookOpen className="w-10 h-10 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">{tests.length}</p>
                  <p className="text-sm opacity-80">Total Tests</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-4 flex items-center gap-3">
                <Beaker className="w-10 h-10 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                  <p className="text-sm opacity-80">Total Questions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <CardContent className="p-4 flex items-center gap-3">
                <Trophy className="w-10 h-10 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">{attempts.filter(a => a.completed).length}</p>
                  <p className="text-sm opacity-80">Tests Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-lg font-semibold mb-4">Available Tests</h2>
          {tests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tests yet</h3>
                <p className="text-muted-foreground mb-4">Create your first test to get started</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={startCreateTest}><Plus className="w-4 h-4 mr-2" /> Create Test</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map(test => (
                <Card key={test.id} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Cover Image */}
                  <div className="relative h-40 overflow-hidden">
                    {coverImages[test.id] ? (
                      <img
                        src={coverImages[test.id]}
                        alt={test.title}
                        className="w-full h-full object-cover"
                      />
                    ) : generatingCovers[test.id] ? (
                      <div className="w-full h-full bg-gradient-to-br from-violet-200 via-purple-100 to-emerald-200 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-violet-600 font-medium">Generating AI cover...</p>
                      </div>
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        test.topic === 'Physics' ? 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600' :
                        test.topic === 'Chemistry' ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600' :
                        test.topic === 'Mathematics' ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500' :
                        'bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500'
                      }`}>
                        <div className="text-center text-white/90">
                          <div className="text-3xl mb-1">
                            {test.topic === 'Physics' ? '⚛️' :
                             test.topic === 'Chemistry' ? '🧪' :
                             test.topic === 'Mathematics' ? '📐' : '📚'}
                          </div>
                          <p className="text-xs font-medium opacity-80">{test.topic}</p>
                          <button
                            onClick={() => generateCover(test.id)}
                            className="mt-2 text-[10px] underline opacity-70 hover:opacity-100 transition-opacity"
                          >
                            Generate AI Cover
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Topic badge overlay */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 text-violet-700 backdrop-blur-sm shadow-sm">{test.topic}</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2 pt-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base leading-tight">{test.title}</CardTitle>
                      </div>
                    </div>
                    {test.description && <CardDescription className="mt-1 text-xs">{test.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {test._count?.questions || 0} questions</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {test._count?.attempts || 0} attempts</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {test.randomizeQuestions && <Badge variant="outline" className="text-xs"><Shuffle className="w-3 h-3 mr-1" />Random Q</Badge>}
                      {test.randomizeOptions && <Badge variant="outline" className="text-xs"><Shuffle className="w-3 h-3 mr-1" />Random A</Badge>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-0">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" onClick={() => openStartTest(test)}>
                      <Play className="w-3 h-3 mr-1" /> Take Test
                    </Button>
                    {test.creatorId === effectiveUser?.id && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEditTest(test)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(test.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">{editingTestId ? 'Edit Test' : 'Create New Test'}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Test Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test Title</Label>
                  <Input value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="e.g., Chemistry: Acids & Bases" />
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input value={testTopic} onChange={e => setTestTopic(e.target.value)} placeholder="e.g., Chemistry" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={testDescription} onChange={e => setTestDescription(e.target.value)} placeholder="Brief description of this test..." rows={2} />
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={randomizeQ} onCheckedChange={setRandomizeQ} />
                  <Label className="flex items-center gap-1 cursor-pointer">
                    <Shuffle className="w-4 h-4" /> Randomize Questions
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={randomizeO} onCheckedChange={setRandomizeO} />
                  <Label className="flex items-center gap-1 cursor-pointer">
                    <Shuffle className="w-4 h-4" /> Randomize Options
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuestions(shuffleArray(questions))}>
                  <Shuffle className="w-3 h-3 mr-1" /> Shuffle All
                </Button>
                <Button size="sm" onClick={addQuestion}>
                  <Plus className="w-3 h-3 mr-1" /> Add Question
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-[65vh]">
              <div className="space-y-4 pr-4">
                {questions.map((q, idx) => (
                  <Card key={idx} className="border-0 shadow-sm">
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
                              q.correctAnswer === letter ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
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
                              className="shrink-0 accent-emerald-500"
                              title="Mark as correct"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex gap-3 pb-8">
            <Button variant="outline" onClick={goHome} className="flex-1">Cancel</Button>
            <Button onClick={handleSaveTest} disabled={loading} className="flex-1 bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600">
              {loading ? 'Saving...' : editingTestId ? 'Update Test' : 'Create Test'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // START TEST - select number of questions + mode selection
  if (effectivePage === 'start-test' && currentTest) {
    const totalQ = currentTest.questions.length;
    const quickCounts = [10, 15, 20, 25, 30, 40, 50].filter(c => c <= totalQ);

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">Start Test</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <ListChecks className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">{currentTest.title}</CardTitle>
              {currentTest.description && <CardDescription className="mt-2">{currentTest.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-violet-600">{totalQ}</p>
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="flex justify-center gap-2">
                    {currentTest.randomizeQuestions && <Badge variant="outline" className="text-xs"><Shuffle className="w-3 h-3 mr-1" />Q</Badge>}
                    {currentTest.randomizeOptions && <Badge variant="outline" className="text-xs"><Shuffle className="w-3 h-3 mr-1" />A</Badge>}
                    {!currentTest.randomizeQuestions && !currentTest.randomizeOptions && (
                      <span className="text-xs text-muted-foreground">No shuffle</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Randomization</p>
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
                        ? 'border-violet-500 bg-violet-50 shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ListChecks className="w-5 h-5 text-violet-600" />
                      <span className="font-semibold text-sm">Exam Mode</span>
                    </div>
                    <p className="text-xs text-muted-foreground">See results at the end</p>
                  </button>
                  <button
                    onClick={() => setPracticeMode(true)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      practiceMode
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-sm">Practice Mode</span>
                    </div>
                    <p className="text-xs text-muted-foreground">See correct answer right away</p>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Question Count Selection */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">How many questions?</h3>
                  <p className="text-sm text-muted-foreground">Choose how many questions you want to answer</p>
                </div>

                {/* Slider */}
                <div className="px-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">1</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">{selectedQuestionCount}</span>
                    <span className="text-sm text-muted-foreground">{totalQ}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={totalQ}
                    value={selectedQuestionCount}
                    onChange={e => setSelectedQuestionCount(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant={selectedQuestionCount === totalQ ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedQuestionCount(totalQ)}
                    className={selectedQuestionCount === totalQ ? 'bg-gradient-to-r from-violet-500 to-emerald-500' : ''}
                  >
                    All ({totalQ})
                  </Button>
                  {quickCounts.map(count => (
                    <Button
                      key={count}
                      variant={selectedQuestionCount === count ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedQuestionCount(count)}
                      className={selectedQuestionCount === count ? 'bg-gradient-to-r from-violet-500 to-emerald-500' : ''}
                    >
                      {count}
                    </Button>
                  ))}
                </div>

                {/* Adjust buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => setSelectedQuestionCount(Math.max(1, selectedQuestionCount - 1))} disabled={selectedQuestionCount <= 1}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-3xl font-bold w-16 text-center">{selectedQuestionCount}</span>
                  <Button variant="outline" size="icon" onClick={() => setSelectedQuestionCount(Math.min(totalQ, selectedQuestionCount + 1))} disabled={selectedQuestionCount >= totalQ}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={startTest} disabled={loading} className="w-full h-12 text-base bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600">
                {loading ? 'Loading...' : <><Play className="w-5 h-5 mr-2" /> Start {practiceMode ? 'Practice' : 'Test'} ({selectedQuestionCount} questions)</>}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // TAKE TEST
  if (effectivePage === 'take-test' && shuffledQuestions.length > 0) {
    const currentQ = shuffledQuestions[currentQuestionIdx];
    const progressPct = ((currentQuestionIdx + 1) / shuffledQuestions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    if (showResult) {
      const score = getScore();
      const pct = Math.round((score / shuffledQuestions.length) * 100);
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h1 className="text-lg font-bold">Test Results</h1>
              </div>
              {!chatOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openChat(shuffledQuestions[0]?.id || '', answers[shuffledQuestions[0]?.id || ''])}
                  className="gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Tutor
                </Button>
              )}
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className={`flex gap-6 ${chatOpen ? 'flex-col lg:flex-row' : ''}`}>
              <div className="flex-1 min-w-0 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className={`h-2 ${pct >= 70 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : pct >= 40 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />
              <CardContent className="p-8 text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white ${
                  pct >= 70 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : pct >= 40 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-red-600'
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
                <Card key={idx} className={`border-0 shadow-sm ${isCorrect ? 'ring-2 ring-emerald-200' : 'ring-2 ring-red-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      <p className="font-medium text-sm">{idx + 1}. {q.text}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const optionText = q[`option${letter}` as keyof Question] as string;
                        if (!optionText) return null;
                        const isCorrectOption = letter === q.correctAnswer;
                        const isSelected = letter === selected;
                        return (
                          <div key={letter} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                            isCorrectOption ? 'bg-emerald-50 text-emerald-700 font-medium' :
                            isSelected ? 'bg-red-50 text-red-700' : 'bg-muted/50'
                          }`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrectOption ? 'bg-emerald-500 text-white' :
                              isSelected ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              {letter}
                            </span>
                            {optionText}
                          </div>
                        );
                      })}
                    </div>
                    {explanations[q.id || ''] && (
                      <p className="text-xs text-muted-foreground mt-2 ml-7 italic">{explanations[q.id || '']}</p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 ml-7 text-violet-600 hover:text-violet-700 hover:bg-violet-50 text-xs"
                      onClick={() => {
                        setChatMessages([]);
                        setChatInput('');
                        setChatQuestionId(q.id || '');
                        setChatUserAnswer(selected);
                        setChatOpen(true);
                        sendChatMessage(q.id || '', [], selected);
                      }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Ask AI Tutor
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex gap-3 pb-8">
              <Button variant="outline" onClick={goHome} className="flex-1">Back to Dashboard</Button>
              <Button onClick={() => openStartTest(currentTest!)} className="flex-1 bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600">
                <RefreshCw className="w-4 h-4 mr-2" /> Retry Test
              </Button>
            </div>
              </div>

              {/* AI Chat Panel in Results */}
              {chatOpen && (
                <div className="w-full lg:w-[420px] shrink-0">
                  <Card className="border-0 shadow-lg flex flex-col h-[calc(100vh-160px)] lg:h-[680px]">
                    <CardHeader className="pb-3 shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">AI Tutor</CardTitle>
                            <p className="text-xs text-muted-foreground">Ask about any question</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={closeChat}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                      <ScrollArea className="h-full px-4">
                        <div className="space-y-3 py-2">
                          {chatMessages.length === 0 && chatLoading && (
                            <div className="flex gap-2 items-start">
                              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                <Bot className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                          {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                              {msg.role === 'assistant' && (
                                <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                  <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                              )}
                              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                                msg.role === 'user'
                                  ? 'bg-violet-500 text-white rounded-tr-sm'
                                  : 'bg-muted rounded-tl-sm'
                              }`}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          {chatLoading && chatMessages.length > 0 && (
                            <div className="flex gap-2 items-start">
                              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                <Bot className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="pt-3 pb-4 shrink-0">
                      <div className="flex w-full gap-2">
                        <Input
                          placeholder="Ask a follow-up..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendChatMessage();
                            }
                          }}
                          disabled={chatLoading}
                          className="flex-1 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => sendChatMessage()}
                          disabled={chatLoading || !chatInput.trim()}
                          className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      );
    }

    // Active test-taking UI
    const qId = currentQ.id || '';
    const isRevealed = practiceMode && revealedAnswers[qId];

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={goHome}><Home className="w-4 h-4" /></Button>
                <span className="text-sm font-medium">{currentTest?.title}</span>
                {practiceMode && <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Practice Mode</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{answeredCount}/{shuffledQuestions.length} answered</span>
                {!chatOpen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openChat(qId, answers[qId])}
                    className="gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">AI Tutor</span>
                  </Button>
                )}
              </div>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Question navigation pills */}
          <div className="flex flex-wrap gap-1.5 mb-6">
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
                  onClick={() => {
                    setCurrentQuestionIdx(idx);
                    // Close chat when navigating to a different question
                    if (chatOpen) {
                      setChatOpen(false);
                      setChatMessages([]);
                      setChatQuestionId('');
                    }
                  }}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent ? 'ring-2 ring-violet-500 ring-offset-2' :
                    isCorrectAnswer ? 'bg-emerald-500 text-white' :
                    isWrongAnswer ? 'bg-red-500 text-white' :
                    isAnswered ? 'bg-violet-100 text-violet-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Main content: Question + Chat side by side */}
          <div className={`flex gap-6 ${chatOpen ? 'flex-col lg:flex-row' : ''}`}>
            {/* Current Question */}
            <div className={`flex-1 min-w-0`}>
              <Card className="border-0 shadow-lg mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">Question {currentQuestionIdx + 1} of {shuffledQuestions.length}</Badge>
                    {practiceMode && isRevealed && (
                      answers[qId] === currentQ.correctAnswer ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Correct!</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Wrong</Badge>
                      )
                    )}
                  </div>
                  <p className="text-lg font-medium mt-2">{currentQ.text}</p>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[qId] || ''}
                    onValueChange={(value) => selectAnswer(qId, value)}
                    disabled={practiceMode && revealedAnswers[qId]}
                  >
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => {
                        const optionText = currentQ[`option${letter}` as keyof Question] as string;
                        if (!optionText) return null;
                        const isRevealedOption = practiceMode && revealedAnswers[qId];
                        const isCorrectOption = letter === currentQ.correctAnswer;
                        const isSelectedOption = letter === answers[qId];

                        let optionClass = 'border hover:border-violet-300 hover:bg-violet-50/50';
                        if (isRevealedOption) {
                          if (isCorrectOption) {
                            optionClass = 'border-emerald-500 bg-emerald-50';
                          } else if (isSelectedOption && !isCorrectOption) {
                            optionClass = 'border-red-500 bg-red-50';
                          } else {
                            optionClass = 'border-muted opacity-60';
                          }
                        } else if (isSelectedOption) {
                          optionClass = 'border-violet-500 bg-violet-50';
                        }

                        return (
                          <div key={letter} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${optionClass}`}>
                            <RadioGroupItem value={letter} id={`q-${qId}-${letter}`} />
                            <Label htmlFor={`q-${qId}-${letter}`} className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRevealedOption && isCorrectOption ? 'bg-emerald-500 text-white' :
                                isRevealedOption && isSelectedOption && !isCorrectOption ? 'bg-red-500 text-white' :
                                isSelectedOption ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'
                              }`}>
                                {letter}
                              </span>
                              <span className="text-sm">{optionText}</span>
                            </Label>
                            {isRevealedOption && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                            {isRevealedOption && isSelectedOption && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>

                  {/* Practice mode: show result and explanation + Ask AI button */}
                  {practiceMode && revealedAnswers[qId] && (
                    <div className="mt-4 p-3 rounded-xl bg-muted/50">
                      <p className="text-sm font-medium mb-1">
                        Correct answer: <span className="text-emerald-600">{currentQ.correctAnswer}</span>
                      </p>
                      {explanations[qId] && (
                        <p className="text-xs text-muted-foreground mt-1 ml-7">{explanations[qId]}</p>
                      )}
                      {!chatOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                          onClick={() => openChat(qId, answers[qId])}
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Ask AI Tutor about this question
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Exam mode: Ask AI button always visible after answering */}
                  {!practiceMode && answers[qId] && !chatOpen && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                        onClick={() => openChat(qId, answers[qId])}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask AI Tutor about this question
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1));
                    if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); }
                  }}
                  disabled={currentQuestionIdx === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                {currentQuestionIdx === shuffledQuestions.length - 1 ? (
                  <Button
                    onClick={submitTest}
                    disabled={loading || answeredCount < shuffledQuestions.length}
                    className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600"
                  >
                    {loading ? 'Submitting...' : 'Submit Test'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setCurrentQuestionIdx(Math.min(shuffledQuestions.length - 1, currentQuestionIdx + 1));
                      if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); }
                    }}
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {loadingExplanations && (
                <p className="text-xs text-center text-muted-foreground mt-4">Loading explanations...</p>
              )}
            </div>

            {/* AI Chat Panel */}
            {chatOpen && (
              <div className="w-full lg:w-[420px] shrink-0">
                <Card className="border-0 shadow-lg flex flex-col h-[calc(100vh-160px)] lg:h-[680px]">
                  <CardHeader className="pb-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">AI Tutor</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {chatUserAnswer ? (
                              chatUserAnswer === shuffledQuestions.find(q => q.id === chatQuestionId)?.correctAnswer
                                ? '✓ You answered correctly'
                                : `✗ You chose ${chatUserAnswer} — correct is ${shuffledQuestions.find(q => q.id === chatQuestionId)?.correctAnswer}`
                            ) : 'Ask about this question'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={closeChat}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full px-4">
                      <div className="space-y-3 py-2">
                        {chatMessages.length === 0 && chatLoading && (
                          <div className="flex gap-2 items-start">
                            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                              <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex gap-2 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'assistant' && (
                              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                <Bot className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                              msg.role === 'user'
                                ? 'bg-violet-500 text-white rounded-tr-sm'
                                : 'bg-muted rounded-tl-sm'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {chatLoading && chatMessages.length > 0 && (
                          <div className="flex gap-2 items-start">
                            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                              <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="pt-3 pb-4 shrink-0">
                    <div className="flex w-full gap-2">
                      <Input
                        placeholder="Ask a follow-up..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        disabled={chatLoading}
                        className="flex-1 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => sendChatMessage()}
                        disabled={chatLoading || !chatInput.trim()}
                        className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // HISTORY
  if (effectivePage === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">Test History</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {attempts.length === 0 ? (
            <Card className="border-dashed">
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
                <Card key={attempt.id} className="border-0 shadow-sm">
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
