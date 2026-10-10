'use client';

import React from 'react';
import {
  ArrowLeft,
  ListChecks,
  Minus,
  Plus,
  BookOpen,
  Shuffle,
  Paperclip,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// Perf: keep the attachments module (and pdfjs) out of this view's chunk —
// same lazy pattern as the main page.
import dynamic from 'next/dynamic';
const AttachmentsList = dynamic(() => import('@/components/attachments').then(m => m.AttachmentsList), { ssr: false });
import { type AttachmentItem } from '@/components/attachment-utils';
import { testBackgroundCss } from '@/lib/test-bg';
import type { SavedTestProgress } from '@/lib/test-progress';
import { countAnsweredProgress } from '@/lib/test-progress';
import type { Test } from '@/lib/app-types';

/**
 * START TEST — question count selection + mode (exam/practice) +
 * randomization toggles + attached files, with the fixed bottom action bar
 * (Start / Restart + Continue when saved progress exists).
 */
export interface StartTestViewProps {
  currentTest: Test;
  myBgStyle: string;
  selectedQuestionCount: number;
  setSelectedQuestionCount: (v: number) => void;
  practiceMode: boolean;
  setPracticeMode: (v: boolean) => void;
  startRandomizeQ: boolean;
  setStartRandomizeQ: (updater: (v: boolean) => boolean) => void;
  startRandomizeO: boolean;
  setStartRandomizeO: (updater: (v: boolean) => boolean) => void;
  startFilesExpanded: boolean;
  setStartFilesExpanded: (updater: (v: boolean) => boolean) => void;
  savedProgress: SavedTestProgress | null;
  startTest: () => void;
  continueTestWith: (test: Test) => boolean | void;
  loading: boolean;
  goHome: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export default function StartTestView({
  currentTest,
  myBgStyle,
  selectedQuestionCount,
  setSelectedQuestionCount,
  practiceMode,
  setPracticeMode,
  startRandomizeQ,
  setStartRandomizeQ,
  startRandomizeO,
  setStartRandomizeO,
  startFilesExpanded,
  setStartFilesExpanded,
  savedProgress,
  startTest,
  continueTestWith,
  loading,
  goHome,
  t,
}: StartTestViewProps) {
  const totalQ = currentTest.questions.length;

  return (
    <div className="min-h-screen bg-background" style={myBgStyle ? { background: testBackgroundCss(myBgStyle) } : undefined}>
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
