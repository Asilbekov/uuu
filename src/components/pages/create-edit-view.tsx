'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * CREATE / EDIT TEST screen — the full-page editor chrome (header + bottom
 * save bar). The form body itself (`editorBody`) is shared with the take-test
 * "Edit Test" sheet and is composed in src/app/page.tsx.
 */
export interface CreateEditViewProps {
  editingTestId: string | null;
  editorBody: React.ReactNode;
  handleSaveTest: () => void;
  loading: boolean;
  goHome: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export default function CreateEditView({
  editingTestId,
  editorBody,
  handleSaveTest,
  loading,
  goHome,
  t,
}: CreateEditViewProps) {
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
