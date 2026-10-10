'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import MathText from '@/components/math-text';
import LangButton from '@/components/lang-button';
import { AttachmentItem } from '@/components/attachment-utils';
import { ResizableSheetFrame } from '@/components/resize-sheet';
import { SheetHeaderSwitcher } from '@/components/sheet-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { trExpl, trOption, trText, type Lang } from '@/lib/i18n';
import { ArrowLeft, ArrowRight, CheckCircle2, Edit, Home, LayoutGrid, Library, MessageSquare, Paperclip, Pencil, Play, RefreshCw, Rows3, Search, Sparkles, Users, X, XCircle } from 'lucide-react';

// Tiny neutral placeholder shown while a lazily-loaded bottom-sheet panel is
// downloading its chunk — keeps the sheet frame sized.
function SheetLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full min-h-[240px]">
      <div className="animate-pulse text-neutral-400 text-sm">…</div>
    </div>
  );
}

const AiChatPanel = dynamic(() => import('@/components/chat-panels').then(m => m.AiChatPanel), { ssr: false, loading: () => <SheetLoadingPlaceholder /> });
const AttachmentsBottomSheet = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsBottomSheet), { ssr: false });
const AttachmentsSidePanel = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsSidePanel), { ssr: false });
const GroupChatPanel = dynamic(() => import('@/components/chat-panels').then(m => m.GroupChatPanel), { ssr: false, loading: () => <SheetLoadingPlaceholder /> });

import { type Page, type Question, type Test, type GroupMessage } from '@/lib/app-types';
import { CreatorStrip, TranslatingPill, topicBgClass, tagHash, coverBgFor, imgSrc, GLASS_TILE } from '@/components/shared-bits';
import { testBackgroundCss } from '@/lib/test-bg';
import type { AiThreadMeta } from '@/components/chat-panels';

/**
 * TAKE TEST + RESULTS screens — extracted verbatim from src/app/page.tsx.
 * All state stays in page.tsx; this view receives it via props (generated
 * mechanically — the identifier list comes from actual block usage).
 * Types marked any are internal handler signatures to be tightened later.
 */
export interface TakeTestViewProps {
  answers: Record<string, string>;
  revealedAnswers: Record<string, boolean>;
  explanations: Record<string, string>;
  effectivePage: Page;
  shuffledQuestions: Question[];
  currentQuestionIdx: number;
  setCurrentQuestionIdx: React.Dispatch<React.SetStateAction<number>>;
  chatOpen: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChatMessages: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; content: string }[]>>;
  setChatQuestionId: React.Dispatch<React.SetStateAction<string>>;
  setChatQuestionObj: React.Dispatch<React.SetStateAction<Question | null>>;
  setChatThreadId: React.Dispatch<React.SetStateAction<string>>;
  questions: Question[];
  qSearch: string;
  lang: Lang;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setQSearch: React.Dispatch<React.SetStateAction<string>>;
  setQSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDrumInputMode: React.Dispatch<React.SetStateAction<boolean>>;
  numInputRef: { current: any };
  drumScaleRafRef: { current: any };
  applyDrumScales: (...args: any[]) => any;
  drumSettleTimerRef: { current: any };
  drumRef: { current: any };
  drumProgrammaticRef: { current: any };
  takeFeedSettleTimerRef: { current: any };
  takeFeedRef: { current: any };
  takeFeedTouchUntilRef: { current: any };
  showResult: boolean;
  getScore: (...args: any[]) => any;
  resSearch: string;
  setResSearch: React.Dispatch<React.SetStateAction<string>>;
  setResHighlightIdx: React.Dispatch<React.SetStateAction<number | null>>;
  currentTest: Test | null;
  filesOpen: boolean;
  groupOpen: boolean;
  editOpen: boolean;
  setFilesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openChat: (...args: any[]) => any;
  startEditTestInTake: (...args: any[]) => any;
  myBgStyle: string;
  autoTranslating: boolean;
  goHome: (...args: any[]) => any;
  closeChat: (...args: any[]) => any;
  cycleDashView: (...args: any[]) => any;
  dashView: 'tiktok1' | 'tiktok2' | 'library' | 'shelf';
  cycleLang: (...args: any[]) => any;
  openGroupChat: (...args: any[]) => any;
  libNarrow: boolean;
  resHighlightIdx: number | null;
  loading: boolean;
  chatMessages: { role: 'user' | 'assistant'; content: string }[];
  chatLoading: boolean;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  sendChatMessage: (...args: any[]) => any;
  chatEndRef: { current: any };
  chatHistoryOpen: boolean;
  setChatHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiThreadMetas: AiThreadMeta[];
  chatThreadId: string;
  selectChatThread: (...args: any[]) => any;
  closeGroupChat: (...args: any[]) => any;
  groupMessages: GroupMessage[];
  effectiveUser: { id: string; email: string; name: string } | null;
  groupInput: string;
  setGroupInput: React.Dispatch<React.SetStateAction<string>>;
  sendGroupMessage: (...args: any[]) => any;
  groupSending: boolean;
  groupEndRef: { current: any };
  openUserLibrary: (...args: any[]) => any;
  editorBody: React.ReactNode;
  handleSaveTest: (...args: any[]) => any;
  openStartTest: (...args: any[]) => any;
  qSearchOpen: boolean;
  page: Page;
  practiceMode: boolean;
  selectAnswer: (...args: any[]) => any;
  submitTest: (...args: any[]) => any;
  loadingExplanations: boolean;
  chatUserAnswer: string;
  chatQuestionId: string;
  drumInputMode: boolean;
  drumRefCb: (...args: any[]) => any;
}

export default function TakeTestView({
  effectivePage,
  answers,
  revealedAnswers,
  explanations,
  shuffledQuestions,
  currentQuestionIdx,
  setCurrentQuestionIdx,
  chatOpen,
  setChatOpen,
  setChatMessages,
  setChatQuestionId,
  setChatQuestionObj,
  setChatThreadId,
  questions,
  qSearch,
  lang,
  t,
  setQSearch,
  setQSearchOpen,
  setDrumInputMode,
  numInputRef,
  drumScaleRafRef,
  applyDrumScales,
  drumSettleTimerRef,
  drumRef,
  drumProgrammaticRef,
  takeFeedSettleTimerRef,
  takeFeedRef,
  takeFeedTouchUntilRef,
  showResult,
  getScore,
  resSearch,
  setResSearch,
  setResHighlightIdx,
  currentTest,
  filesOpen,
  groupOpen,
  editOpen,
  setFilesOpen,
  setGroupOpen,
  setEditOpen,
  openChat,
  startEditTestInTake,
  myBgStyle,
  autoTranslating,
  goHome,
  closeChat,
  cycleDashView,
  dashView,
  cycleLang,
  openGroupChat,
  libNarrow,
  resHighlightIdx,
  loading,
  chatMessages,
  chatLoading,
  chatInput,
  setChatInput,
  sendChatMessage,
  chatEndRef,
  chatHistoryOpen,
  setChatHistoryOpen,
  aiThreadMetas,
  chatThreadId,
  selectChatThread,
  closeGroupChat,
  groupMessages,
  effectiveUser,
  groupInput,
  setGroupInput,
  sendGroupMessage,
  groupSending,
  groupEndRef,
  openUserLibrary,
  editorBody,
  handleSaveTest,
  openStartTest,
  qSearchOpen,
  page,
  practiceMode,
  selectAnswer,
  submitTest,
  loadingExplanations,
  chatUserAnswer,
  chatQuestionId,
  drumInputMode,
  drumRefCb,
}: TakeTestViewProps) {
  if (effectivePage === 'take-test' && shuffledQuestions.length > 0) {
    const currentQ = shuffledQuestions[currentQuestionIdx];
    const progressPct = ((currentQuestionIdx + 1) / shuffledQuestions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    // Navigate to a question and close any open chat sheet
    const goToQuestion = (idx: number) => {
      setCurrentQuestionIdx(idx);
      if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); setChatQuestionObj(null); setChatThreadId(''); }
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
        <div className="min-h-screen bg-background" style={myBgStyle ? { background: testBackgroundCss(myBgStyle) } : undefined}>
          <TranslatingPill show={autoTranslating} label={t('translating')} />
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            {/* ONE row on EVERY viewport (flex-nowrap): buttons compress to
                icon-only pills on narrow screens; the search input shrinks. */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-nowrap items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink">
                <Button variant="ghost" size="sm" onClick={goHome} className="rounded-full shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3"><ArrowLeft className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">{t('back')}</span></Button>
                {(currentTest?.attachments?.length || 0) > 0 ? (
                  <Button
                    variant={filesOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { const next = !filesOpen; setFilesOpen(next); if (next) { setGroupOpen(false); setEditOpen(false); if (chatOpen) closeChat(); } }}
                    className={`h-8 px-1.5 sm:px-3 gap-1 shrink-0 ${filesOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('files', { n: currentTest!.attachments!.length })}</span>
                    <span className="sm:hidden">{currentTest!.attachments!.length}</span>
                  </Button>
                ) : (
                  <h1 className="text-base sm:text-lg font-bold truncate">{t('testResults')}</h1>
                )}
              </div>
              <div className="flex-1 min-w-0 sm:max-w-sm relative mx-0.5 sm:mx-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={resSearch}
                  onChange={e => setResSearch(e.target.value)}
                  placeholder={t('searchQuestions')}
                  className="h-8 sm:h-9 rounded-full pl-9 bg-white border-black/15 text-xs sm:text-sm"
                />
                {resSearchDropdown}
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
                {/* View switcher — the review list follows the selected view:
                TikTok feed → the regular vertical list; Library → review cards
                in a grid; Shelf → one full-width card per row. NO navigation. */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleDashView}
                  className="shrink-0 h-8 w-8 p-0"
                  title={t('viewMode')}
                  aria-label={t('viewMode')}
                >
                  {dashView === 'library'
                    ? <LayoutGrid className="w-4 h-4" />
                    : dashView === 'shelf'
                      ? <Rows3 className="w-4 h-4" />
                      : <Play className="w-4 h-4" />}
                </Button>
                <LangButton lang={lang} onChange={cycleLang} className="border-black px-1.5 sm:px-3" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setChatOpen(true); setFilesOpen(false); setGroupOpen(false); setEditOpen(false); openChat(shuffledQuestions[0]?.id || '', answers[shuffledQuestions[0]?.id || '']); }}
                  className="shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3"
                  title={t('aiTutor')}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('aiTutor')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openGroupChat}
                  className="shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3"
                  title={t('chatWithTook')}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('chat')}</span>
                </Button>
                <Button
                  variant={editOpen ? 'default' : 'outline'}
                  size="sm"
                  onClick={startEditTestInTake}
                  className={`shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3 ${editOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
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
            {/* The View button applies to the review list too: library → the
            same review cards in a grid, shelf → one full-width card per row. */}
            <div className={dashView === 'library' || dashView === 'shelf'
              ? `grid ${dashView === 'shelf' ? 'grid-cols-1' : (libNarrow ? 'grid-cols-2' : 'grid-cols-3')} gap-2 sm:gap-3 items-start`
              : 'space-y-6'}>
            {shuffledQuestions.map((q, idx) => {
              const selected = answers[q.id || ''] || '';
              const isCorrect = selected === q.correctAnswer;
              return (
                <Card key={idx} id={`result-q-${idx}`} className={`rounded-4xl border border-black bg-white scroll-mt-24 ${isCorrect ? 'ring-2 ring-emerald-300' : 'ring-2 ring-red-300'} ${resHighlightIdx === idx ? 'outline outline-2 outline-primary outline-offset-2' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{idx + 1}. <MathText text={trText(q, lang)} /></p>
                        {/* Question photo — same one as during the test */}
                        {imgSrc(q.imageUrl) && (
                          <img src={imgSrc(q.imageUrl)} alt="" loading="lazy" className="mt-2 w-full max-h-64 object-contain rounded-xl border border-black/10 bg-white" />
                        )}
                      </div>
                    </div>
                    <div className={`grid grid-cols-1 gap-2 ${dashView === 'library' || dashView === 'shelf' ? '' : 'sm:grid-cols-2 ml-7'}`}>
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
                            <div className="min-w-0">
                              <span className="min-w-0 break-words"><MathText text={optionText} /></span>
                              {/* Option photo — shown in the review too */}
                              {imgSrc(q.optionImages?.[letter]?.u) && (
                                <img src={imgSrc(q.optionImages[letter].u)} alt="" loading="lazy" className="mt-1.5 w-full max-w-xs max-h-44 object-contain rounded-lg border border-black/10 bg-white" />
                              )}
                            </div>
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
                  historyOpen={chatHistoryOpen}
                  onToggleHistory={() => setChatHistoryOpen(v => !v)}
                  threads={aiThreadMetas}
                  activeThreadId={chatThreadId}
                  onSelectThread={selectChatThread}
                  historyLabel={t('chatHistory')}
                  noChatsLabel={t('noChatsYet')}
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
                  onOpenProfile={openUserLibrary}
                  openProfileLabel={t('openProfile')}
                />
              )}

              {/* Edit Test window in Results — RESIZABLE bottom sheet (drag the
                  top bar up to full screen), same chrome as the chat windows;
                  its header switcher jumps to Files / AI Tutor / Test Chat and
                  back. Saving stays on the updated results. */}
              {editOpen && (
                <ResizableSheetFrame
                  onClose={() => setEditOpen(false)}
                  initialVh={0.85}
                  minVh={0.4}
                  maxW="max-w-3xl"
                  header={
                    <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
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
                  }
                  body={
                    <div className="px-4 py-4">
                      <div className="max-w-3xl mx-auto space-y-6">
                        {editorBody}
                      </div>
                    </div>
                  }
                  footer={
                    <div className="shrink-0 border-t bg-white/95 backdrop-blur-md px-4 pt-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                      <Button onClick={() => handleSaveTest(true)} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                        {loading ? t('saving') : t('saveTest')}
                      </Button>
                    </div>
                  }
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
      <div className="relative h-[100dvh] flex flex-col bg-background overflow-hidden" style={myBgStyle ? { background: testBackgroundCss(myBgStyle) } : undefined}>
        <TranslatingPill show={autoTranslating} label={t('translating')} />
        <header className="shrink-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
            {/* ONE row on EVERY viewport (flex-nowrap): all buttons compress to
                icon-only pills on narrow screens so the panel never wraps onto
                a second row. Search is a BUTTON; tapping it expands an input
                overlay that covers the whole row until dismissed. */}
            <div className="relative flex flex-nowrap items-center justify-between gap-1 sm:gap-2 mb-2">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink-0">
                <Button variant="ghost" size="sm" onClick={goHome} className="shrink-0 h-8 w-8 p-0"><Home className="w-4 h-4" /></Button>
                <LangButton lang={lang} onChange={cycleLang} className="border-black shrink-0 px-1.5 sm:px-3" />
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
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
                {/* View switcher — cycles the layouts and the QUESTION LIST on
                this page follows the selected view: TikTok feed → the regular
                one-question-per-slide quiz; Library → question cards in a grid;
                Shelf → one full-width question card per row. NO navigation. */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleDashView}
                  className="shrink-0 h-8 w-8 p-0"
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
                  className="shrink-0 h-8 w-8 p-0"
                  title={t('searchQuestions')}
                  aria-label={t('searchQuestions')}
                >
                  <Search className="w-4 h-4" />
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground hidden lg:inline">{t('xOfYAnswered', { n: answeredCount, m: shuffledQuestions.length })}</span>
                {(currentTest?.attachments?.length || 0) > 0 && (
                  <Button
                    variant={filesOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { const next = !filesOpen; setFilesOpen(next); if (next) { setGroupOpen(false); setEditOpen(false); if (chatOpen) { setChatOpen(false); setChatMessages([]); setChatQuestionId(''); setChatQuestionObj(null); setChatThreadId(''); } } }}
                    className={`h-8 px-1.5 sm:px-3 gap-1 ${filesOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
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
                    className="shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3"
                    title={t('aiTutor')}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('aiTutor')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openGroupChat}
                    className="shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3"
                    title={t('chatWithAll')}
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('chat')}</span>
                  </Button>
                  <Button
                    variant={editOpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={startEditTestInTake}
                    className={`shrink-0 h-8 w-8 p-0 sm:w-auto sm:px-3 ${editOpen ? 'bg-cta hover:bg-cta/90 text-white border-cta' : ''}`}
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
            {/* LIBRARY / SHELF view of the questions — the View button applies to
                the QUESTIONS here: instead of the TikTok-style slide feed the
                questions become cards in the same layouts as the dashboard
                (library = 2/3 per row, shelf = one full-width card per row).
                Every card is fully answerable right on the spot. */}
            {(dashView === 'library' || dashView === 'shelf') ? (
              <div className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="max-w-5xl mx-auto px-2 sm:px-3 py-3 sm:py-4">
                  <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-3">{t('questionsGridHint')}</p>
                  <div className={`grid ${dashView === 'shelf' ? 'grid-cols-1' : (libNarrow ? 'grid-cols-2' : 'grid-cols-3')} gap-2 sm:gap-3`}>
                    {shuffledQuestions.map((q, idx) => {
                      const gqId = q.id || '';
                      const gAnswered = !!answers[gqId];
                      const gRevealed = practiceMode && revealedAnswers[gqId];
                      return (
                        <Card key={idx} id={`qgrid-${idx}`} className={`rounded-2xl border border-black bg-white overflow-hidden flex flex-col ${gRevealed ? (answers[gqId] === q.correctAnswer ? 'ring-2 ring-emerald-300' : 'ring-2 ring-red-300') : gAnswered ? 'ring-1 ring-emerald-200' : ''}`}>
                          <CardContent className="p-2.5 sm:p-3 flex flex-col gap-1.5 sm:gap-2 flex-1 min-h-0">
                            <div className="flex items-center justify-between shrink-0">
                              <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs">{idx + 1}</Badge>
                              {gRevealed ? (
                                answers[gqId] === q.correctAnswer
                                  ? <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] sm:text-xs"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('correct')}</Badge>
                                  : <Badge className="rounded-full bg-red-100 text-red-700 border-red-200 text-[10px] sm:text-xs"><XCircle className="w-3 h-3 mr-1" /> {t('wrong')}</Badge>
                              ) : gAnswered ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <span className="w-4 h-4" />}
                            </div>
                            <p className="text-[13px] sm:text-sm font-medium leading-snug line-clamp-4 sm:line-clamp-none"><MathText text={trText(q, lang)} /></p>
                            {/* Question photo (compact for the grid) */}
                            {imgSrc(q.imageUrl) && (
                              <img src={imgSrc(q.imageUrl)} alt="" loading="lazy" className="w-full max-h-44 object-contain rounded-lg border border-black/10 bg-white" />
                            )}
                            <div className="mt-auto pt-1 space-y-1">
                              {['A', 'B', 'C', 'D', 'E'].map(letter => {
                                const optionText = trOption(q, letter, lang);
                                if (!optionText) return null;
                                const isSel = letter === answers[gqId];
                                const isCorrect = letter === q.correctAnswer;
                                let cls = 'border-black/15 hover:border-black hover:bg-[#FFF0D9]/40';
                                if (gRevealed) {
                                  if (isCorrect) cls = 'border-emerald-500 bg-emerald-50';
                                  else if (isSel) cls = 'border-red-500 bg-red-50';
                                  else cls = 'border-muted opacity-60';
                                } else if (isSel) {
                                  cls = 'border-cta bg-[#FFF0D9]';
                                }
                                return (
                                  <button
                                    key={letter}
                                    type="button"
                                    onClick={() => selectAnswer(gqId, letter)}
                                    disabled={gRevealed}
                                    className={`w-full flex items-start gap-1.5 px-1.5 py-1 rounded-lg border text-left transition-all disabled:cursor-default ${cls}`}
                                  >
                                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                      gRevealed && isCorrect ? 'bg-emerald-500 text-white' :
                                      gRevealed && isSel ? 'bg-red-500 text-white' :
                                      isSel ? 'bg-cta text-white' : 'bg-muted text-muted-foreground'
                                    }`}>
                                      {letter}
                                    </span>
                                    <span className="text-[11px] sm:text-xs leading-snug min-w-0 line-clamp-2 break-words"><MathText text={optionText} /></span>
                                    {imgSrc(q.optionImages?.[letter]?.u) && (
                                      <img src={imgSrc(q.optionImages[letter].u)} alt="" loading="lazy" className="hidden sm:block w-10 h-10 object-cover rounded-md border border-black/10 shrink-0 ml-auto" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  {/* Finish the test right from the grid — the bottom bar's submit
                  only appears on the last slide, which the grid replaces */}
                  <div className="mt-4 mb-6 flex justify-center">
                    <Button onClick={submitTest} disabled={loading || answeredCount < shuffledQuestions.length} className="rounded-full bg-primary hover:bg-primary/90 px-8">
                      {loading ? t('submitting') : t('submitTest')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
            // Questions feed — one full-height card per question, TikTok-style swipe
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
                  {/* Question photo — lives in the Telegram channel, streamed on demand */}
                  {imgSrc(q.imageUrl) && (
                    <img
                      src={imgSrc(q.imageUrl)}
                      alt=""
                      loading="lazy"
                      className="mt-3 w-full max-h-72 object-contain rounded-2xl border border-black/10 bg-white"
                    />
                  )}
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
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={`q-${slideQId}-${letter}`} className="flex items-start gap-2.5 cursor-pointer">
                                <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isRevealedOption && isCorrectOption ? 'bg-emerald-500 text-white' :
                                  isRevealedOption && isSelectedOption && !isCorrectOption ? 'bg-red-500 text-white' :
                                  isSelectedOption ? 'bg-cta text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {letter}
                                </span>
                                <span className="text-[16px] sm:text-[15px] leading-relaxed min-w-0 break-words"><MathText text={optionText} /></span>
                              </Label>
                              {/* Option photo — part of the answer, travels with it on shuffle */}
                              {imgSrc(q.optionImages?.[letter]?.u) && (
                                <img
                                  src={imgSrc(q.optionImages[letter].u)}
                                  alt=""
                                  loading="lazy"
                                  onClick={() => { if (!(practiceMode && revealedAnswers[slideQId])) selectAnswer(slideQId, letter); }}
                                  className="mt-2 ml-9.5 w-full max-w-xs max-h-48 object-contain rounded-xl border border-black/10 bg-white cursor-pointer"
                                />
                              )}
                            </div>
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
            )}

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
                historyOpen={chatHistoryOpen}
                onToggleHistory={() => setChatHistoryOpen(v => !v)}
                threads={aiThreadMetas}
                activeThreadId={chatThreadId}
                onSelectThread={selectChatThread}
                historyLabel={t('chatHistory')}
                noChatsLabel={t('noChatsYet')}
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
                onOpenProfile={openUserLibrary}
                openProfileLabel={t('openProfile')}
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
              <ResizableSheetFrame
                onClose={() => setEditOpen(false)}
                initialVh={0.85}
                minVh={0.4}
                maxW="max-w-3xl"
                header={
                  <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
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
                }
                body={
                  <div className="px-4 py-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {editorBody}
                    </div>
                  </div>
                }
                footer={
                  <div className="shrink-0 border-t bg-white/95 backdrop-blur-md px-4 pt-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                    <Button onClick={() => handleSaveTest(true)} disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90">
                      {loading ? t('saving') : t('saveTest')}
                    </Button>
                  </div>
                }
              />
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
}
