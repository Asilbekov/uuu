'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, getUser, setUser } from '@/lib/api';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Beaker,
  LogIn,
  UserPlus,
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
  Eye,
  GraduationCap,
  Clock,
  BarChart3,
  Settings,
} from 'lucide-react';

// Types
type Page = 'auth' | 'dashboard' | 'create-test' | 'edit-test' | 'take-test' | 'results' | 'history';

interface Question {
  id?: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string | null;
  correctAnswer: string;
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
  const optionKeys = ['A', 'B', 'C', 'D'] as const;
  const optionE = question.optionE;
  if (optionE) optionKeys.push('E' as any);

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
  const [testCompleted, setTestCompleted] = useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Initialize from localStorage on mount
  const [user, setUserState] = useState<{ id: string; email: string; name: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chemtest_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chemtest_user');
      return stored ? 'dashboard' : 'auth';
    }
    return 'auth';
  });

  const loadTests = useCallback(async () => {
    try {
      const data = await api.getTests();
      setTests(data);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  }, [toast]);

  const loadAttempts = useCallback(async () => {
    try {
      const data = await api.getAttempts();
      setAttempts(data);
    } catch (e: any) {
      // Silent fail for attempts
    }
  }, []);

  // Load tests when navigating to dashboard
  const hasLoadedRef = React.useRef(false);
  useEffect(() => {
    if (page === 'dashboard' && user && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      Promise.all([
        api.getTests().then(data => setTests(data)).catch(() => {}),
        api.getAttempts().then(data => setAttempts(data)).catch(() => {}),
      ]);
    }
  }, [page, user]);

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

  const handleSeed = async () => {
    setLoading(true);
    try {
      const result = await api.seed();
      toast({ title: 'Database seeded!', description: `${result.testsCreated} tests created with ${result.totalQuestions} questions. Login: demo@chemtest.com / demo123` });
      await loadTests();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
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
  const startTest = async (test: Test) => {
    setLoading(true);
    try {
      const fullTest = await api.getTest(test.id);
      setCurrentTest(fullTest);

      // Apply randomization
      let qList = [...fullTest.questions];
      if (fullTest.randomizeQuestions) {
        qList = shuffleArray(qList);
      }
      if (fullTest.randomizeOptions) {
        qList = qList.map(q => shuffleOptions(q));
      }

      // Create attempt
      const attempt = await api.createAttempt(test.id);
      setCurrentAttempt(attempt);
      setShuffledQuestions(qList);
      setCurrentQuestionIdx(0);
      setAnswers({});
      setShowResult(false);
      setTestCompleted(false);
      setPage('take-test');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
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
      setTestCompleted(true);
      setShowResult(true);
      toast({ title: 'Test completed!', description: 'Your answers have been submitted.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const getScore = () => {
    return shuffledQuestions.filter(q => answers[q.id || ''] === q.correctAnswer).length;
  };

  // --- NAVIGATION ---
  const goHome = () => {
    setPage('dashboard');
    setCurrentTest(null);
    setCurrentAttempt(null);
  };

  // =================== RENDER ===================

  // AUTH PAGE
  if (page === 'auth') {
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
                <>Don't have an account? <button className="text-primary underline" onClick={() => setAuthMode('signup')}>Sign up</button></>
              ) : (
                <>Already have an account? <button className="text-primary underline" onClick={() => setAuthMode('login')}>Sign in</button></>
              )}
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={handleSeed} disabled={loading}>
              <GraduationCap className="w-4 h-4 mr-2" />
              Load Demo Tests (Seed Database)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // DASHBOARD
  if (page === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        {/* Header */}
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
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogIn className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={startCreateTest} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700">
              <Plus className="w-4 h-4 mr-2" /> Create New Test
            </Button>
            <Button variant="outline" onClick={handleSeed} disabled={loading}>
              <GraduationCap className="w-4 h-4 mr-2" /> Load Demo Tests
            </Button>
            <Button variant="outline" onClick={() => setPage('history')}>
              <Clock className="w-4 h-4 mr-2" /> Test History
            </Button>
          </div>

          {/* Stats */}
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
                  <p className="text-2xl font-bold">{tests.reduce((sum, t) => sum + (t._count?.questions || 0), 0)}</p>
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

          {/* Tests Grid */}
          <h2 className="text-lg font-semibold mb-4">Available Tests</h2>
          {tests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tests yet</h3>
                <p className="text-muted-foreground mb-4">Create your first test or load demo tests to get started</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={startCreateTest}><Plus className="w-4 h-4 mr-2" /> Create Test</Button>
                  <Button variant="outline" onClick={handleSeed}><GraduationCap className="w-4 h-4 mr-2" /> Load Demos</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map(test => (
                <Card key={test.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2 bg-violet-100 text-violet-700">{test.topic}</Badge>
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
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" onClick={() => startTest(test)}>
                      <Play className="w-3 h-3 mr-1" /> Take Test
                    </Button>
                    {test.creatorId === user?.id && (
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
  if (page === 'create-test' || page === 'edit-test') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">{editingTestId ? 'Edit Test' : 'Create New Test'}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Test Info */}
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

          {/* Questions */}
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

          {/* Save Button */}
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

  // TAKE TEST
  if (page === 'take-test' && shuffledQuestions.length > 0) {
    const currentQ = shuffledQuestions[currentQuestionIdx];
    const progressPct = ((currentQuestionIdx + 1) / shuffledQuestions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    if (showResult) {
      const score = getScore();
      const pct = Math.round((score / shuffledQuestions.length) * 100);
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <h1 className="text-lg font-bold">Test Results</h1>
            </div>
          </header>
          <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {/* Score Card */}
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
                  {pct >= 70 ? 'Excellent work! 🎉' : pct >= 40 ? 'Good effort! Keep studying.' : 'Keep practicing! You can do better.'}
                </p>
                <Progress value={pct} className="h-3" />
              </CardContent>
            </Card>

            {/* Review */}
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
                      {['A', 'B', 'C', 'D'].map(letter => {
                        const optionText = q[`option${letter}` as keyof Question] as string;
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
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex gap-3 pb-8">
              <Button onClick={goHome} className="flex-1">Back to Dashboard</Button>
              <Button variant="outline" onClick={() => currentTest && startTest(currentTest)} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" /> Retry Test
              </Button>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={goHome}><Home className="w-4 h-4" /></Button>
                <div>
                  <h1 className="text-sm font-bold">{currentTest?.title}</h1>
                  <p className="text-xs text-muted-foreground">Question {currentQuestionIdx + 1} of {shuffledQuestions.length}</p>
                </div>
              </div>
              <Badge variant="secondary">{answeredCount}/{shuffledQuestions.length} answered</Badge>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Question Navigation */}
          <div className="flex gap-1 flex-wrap mb-6">
            {shuffledQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  idx === currentQuestionIdx
                    ? 'bg-gradient-to-r from-violet-500 to-emerald-500 text-white shadow-md'
                    : answers[q.id || '']
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Current Question */}
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">Question {currentQuestionIdx + 1}</Badge>
              <CardTitle className="text-base leading-relaxed mt-2">{currentQ.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={answers[currentQ.id || ''] || ''} onValueChange={val => selectAnswer(currentQ.id || '', val)}>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map(letter => {
                    const optionText = currentQ[`option${letter}` as keyof Question] as string;
                    if (!optionText) return null;
                    return (
                      <label key={letter} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        answers[currentQ.id || ''] === letter
                          ? 'border-violet-400 bg-violet-50 shadow-sm'
                          : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}>
                        <RadioGroupItem value={letter} id={`q-${currentQuestionIdx}-${letter}`} />
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          answers[currentQ.id || ''] === letter ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-sm">{optionText}</span>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))} disabled={currentQuestionIdx === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            {currentQuestionIdx === shuffledQuestions.length - 1 ? (
              <Button onClick={submitTest} disabled={loading || answeredCount < shuffledQuestions.length}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Submit Test ({answeredCount}/{shuffledQuestions.length})
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestionIdx(Math.min(shuffledQuestions.length - 1, currentQuestionIdx + 1))}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // HISTORY
  if (page === 'history') {
    const completedAttempts = attempts.filter(a => a.completed);
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goHome}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            <h1 className="text-lg font-bold">Test History</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {completedAttempts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed tests yet</h3>
                <p className="text-muted-foreground">Take a test to see your results here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedAttempts.map(attempt => {
                const pct = attempt.totalQuestions > 0 ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
                return (
                  <Card key={attempt.id} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{attempt.test?.title || 'Unknown Test'}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {attempt.score}/{attempt.totalQuestions}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                        pct >= 70 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : pct >= 40 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-red-600'
                      }`}>
                        {pct}%
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Fallback
  return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
}
