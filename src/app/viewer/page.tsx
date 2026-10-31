import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import PdfFullscreenViewer from './viewer-client';

export const metadata: Metadata = {
  title: 'PDF — Viewer',
};

/**
 * Standalone fullscreen PDF viewer route — opened in its OWN tab (no SPA
 * chrome) whenever a PDF attachment's Open / New-tab button is pressed.
 * Query params:
 *   url   (required) — PDF source: same-origin /api/attachments/<id>/file or a
 *                      CORS-enabled absolute URL (raw.githubusercontent.com)
 *   title (optional) — document title for the top bar
 */
export default async function ViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const url = typeof sp.url === 'string' && sp.url.trim() ? sp.url.trim() : undefined;
  const title = typeof sp.title === 'string' && sp.title.trim() ? sp.title.trim() : undefined;

  if (!url) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center gap-3 bg-[#525659] text-white px-4 text-center">
        <AlertTriangle className="w-8 h-8" />
        <p className="text-sm font-medium">No PDF URL provided.</p>
        <a href="/" className="text-xs underline underline-offset-2 text-white/80 hover:text-white">
          Back to the site
        </a>
      </div>
    );
  }

  return <PdfFullscreenViewer url={url} title={title} />;
}
