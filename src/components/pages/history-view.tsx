'use client';

import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Attempt } from '@/lib/app-types';

/**
 * HISTORY PAGE — the list of past attempts. Data stays in page.tsx
 * (it shares the attempts state with the results flow).
 */
export interface HistoryViewProps {
  attempts: Attempt[];
  goHome: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export default function HistoryView({ attempts, goHome, t }: HistoryViewProps) {
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
              <Card key={attempt.id} className="rounded-4xl border border-black bg-white cv-auto">
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
