'use client';

/**
 * Fullscreen PDF viewer — the client engine of the /viewer route.
 *
 * One PDF page per slide in a vertical Swiper with the EXACT same physics as
 * the site's TikTok-style card feed (swiperParams copied verbatim from
 * dashboard-view.tsx): one flick / wheel notch = exactly one full-screen page.
 * Pages are decoded with pdfjs-dist onto <canvas> — the same pattern as
 * pdf-canvas-viewer.tsx (fit-to-screen CONTAIN, hi-DPI aware, worker in
 * public/) — minus the zoom controls: v1 is fit-to-screen only.
 *
 * Lazy rendering: ONLY the active slide ± 1 is drawn — the PageSlide
 * component MOUNTS when a page enters that window and UNMOUNTS when it
 * leaves (freeing the canvas bitmap; its render task is cancelled on
 * unmount). Every other slide is a lightweight placeholder (page number on
 * gray), and evicted pages get pdfPage.cleanup() called so a 500-page study
 * guide cannot balloon the memory.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { AlertTriangle, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';

// Type shims for pdfjs-dist (same shape as pdf-canvas-viewer.tsx). cleanup()
// is part of the shim because evicted pages release their decoded resources
// through it.
type PdfPage = {
  getViewport: (o: { scale: number }) => { width: number; height: number };
  render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> };
  cleanup?: () => void;
};

type PdfDoc = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

// EXACT same engine config as the card feed (dashboard-view.tsx): one wheel
// notch / flick = exactly one full-height slide, zero rubber-banding between
// slides, no release-to-edges drift.
const swiperParams = {
  direction: 'vertical' as const,
  modules: [Mousewheel],
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 320,
  resistanceRatio: 0,
  touchReleaseOnEdges: true,
  longSwipesRatio: 0.35,
  mousewheel: { forceToAxis: true, sensitivity: 1, thresholdDelta: 12, thresholdTime: 250, releaseOnEdges: false },
};

/** Fallback document title: decoded filename from the URL (?title= wins). */
function titleFromUrl(url: string): string {
  try {
    const last = url.split('?')[0].split('#')[0].split('/').filter(Boolean).pop() || '';
    const name = decodeURIComponent(last);
    return name && name.toLowerCase() !== 'file' ? name : 'PDF';
  } catch {
    return 'PDF';
  }
}

/** Placeholder for a page outside the active ± 1 render window — cheap. */
function PagePlaceholder({ pageNumber }: { pageNumber: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#525659] p-1">
      <span className="text-sm font-medium tabular-nums text-white/40 select-none">{pageNumber}</span>
    </div>
  );
}

/**
 * One PDF page = one slide. Mounted only while inside the active ± 1 window
 * (the parent swaps in PagePlaceholder otherwise) — unmounting frees the
 * canvas bitmap, and the effect cleanup cancels any in-flight render task.
 */
function PageSlide({
  docRef,
  pagesRef,
  pageNumber,
  resizeTick,
}: {
  docRef: { current: PdfDoc | null };
  pagesRef: { current: Map<number, PdfPage> };
  pageNumber: number;
  resizeTick: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const taskRef = useRef<{ cancel: () => void; promise: Promise<void> } | null>(null);
  const [ready, setReady] = useState(false); // canvas holds a fully drawn page
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const doc = docRef.current;
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!doc || !canvas || !wrap) return;
      try {
        setReady(false);
        setFailed(false);
        taskRef.current?.cancel();
        // Small shared cache (the parent evicts outside the active ± 1 window).
        let pdfPage = pagesRef.current.get(pageNumber);
        if (!pdfPage) {
          pdfPage = await doc.getPage(pageNumber);
          if (cancelled) return;
          pagesRef.current.set(pageNumber, pdfPage);
        }
        // Fit-to-screen CONTAIN: the whole page visible, centered.
        const availW = Math.max(1, wrap.clientWidth - 8); // p-1 breathing room
        const availH = Math.max(1, wrap.clientHeight - 8);
        const base = pdfPage.getViewport({ scale: 1 });
        const fitScale = Math.min(availW / base.width, availH / base.height);
        // Hi-DPI: device pixels into the bitmap, CSS pixels into the style.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = pdfPage.getViewport({ scale: fitScale * dpr });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const task = pdfPage.render({ canvasContext: ctx, viewport });
        taskRef.current = task as unknown as { cancel: () => void; promise: Promise<void> };
        await task.promise;
        if (!cancelled) setReady(true);
      } catch (e) {
        // Swiping past a page mid-render cancels its task — not an error.
        const name = (e as Error)?.name;
        if (name !== 'RenderingCancelledException') {
          console.error('PDF page render failed', e);
          if (!cancelled) setFailed(true);
        }
      }
    })();
    return () => {
      cancelled = true;
      taskRef.current?.cancel();
      taskRef.current = null;
    };
  }, [pageNumber, resizeTick, docRef, pagesRef]);

  return (
    <div ref={wrapRef} className="w-full h-full flex items-center justify-center bg-[#525659] p-1">
      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} className="block bg-white shadow-lg" />
        {!ready && !failed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-6 h-6 animate-spin text-white/80" />
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white/80">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-[11px]">Page {pageNumber} failed</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PdfFullscreenViewer({ url, title }: { url: string; title?: string }) {
  const docRef = useRef<PdfDoc | null>(null);
  const pagesRef = useRef<Map<number, PdfPage>>(new Map());
  const swiperRef = useRef<SwiperClass | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resizeTick, setResizeTick] = useState(0);

  const displayTitle = useMemo(() => title || titleFromUrl(url), [title, url]);

  // Load the document once (worker + getDocument, same as pdf-canvas-viewer).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const task = pdfjs.getDocument({ url, withCredentials: false });
        const doc = (await task.promise) as unknown as PdfDoc;
        if (cancelled) {
          doc.destroy();
          return;
        }
        docRef.current = doc;
        setNumPages(doc.numPages);
      } catch (e) {
        if (!cancelled) {
          console.error('PDF.js load failed', e);
          setError('Could not load the PDF');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      for (const page of pagesRef.current.values()) {
        try { page.cleanup?.(); } catch { /* already gone */ }
      }
      pagesRef.current.clear();
      docRef.current?.destroy();
      docRef.current = null;
    };
  }, [url]);

  // Evict cached pages outside the active ± 1 window (1-based page numbers):
  // pdfjs keeps decoded resources per page proxy — cleanup() bounds memory.
  useEffect(() => {
    if (!numPages) return;
    const lo = Math.max(1, activeIndex);
    const hi = Math.min(numPages, activeIndex + 2);
    for (const [n, page] of pagesRef.current) {
      if (n < lo || n > hi) {
        try { page.cleanup?.(); } catch { /* already gone */ }
        pagesRef.current.delete(n);
      }
    }
  }, [activeIndex, numPages]);

  // Re-render the visible pages on resize (debounced) — fit-to-screen follows
  // the new viewport.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setResizeTick(v => v + 1), 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Keyboard parity with the feed: ↑/↓/PgUp/PgDn step one page; ←/→ do the
  // same (classic PDF page-turn directions). Ignored while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      const tag = tgt?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tgt?.isContentEditable) return;
      const sw = swiperRef.current;
      if (!sw || sw.destroyed) return;
      if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        sw.slidePrev();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        sw.slideNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#525659]">
      {/* Top bar — back to the site, document title, page counter + the raw
          escape hatch (native viewer, e.g. for zooming). */}
      <header className="shrink-0 bg-white border-b border-black/10 pt-[env(safe-area-inset-top)]">
        <div className="h-[52px] flex items-center gap-2 px-2 sm:px-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back to the site"
            className="flex items-center gap-1.5 min-h-11 min-w-11 -ml-1 px-2 rounded-full hover:bg-black/5 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>
          <p className="flex-1 min-w-0 text-center text-sm font-semibold truncate" title={displayTitle}>
            {displayTitle}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {loading ? '…' : `${Math.min(activeIndex + 1, numPages || 1)} / ${numPages}`}
            </span>
            <button
              type="button"
              onClick={() => window.open(url, '_blank')}
              aria-label="Open the raw PDF in a new tab"
              title="Open the raw PDF in a new tab"
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen vertical page feed — one PDF page per slide; only the
          active slide ± 1 carries a canvas, the rest are placeholders. */}
      <main className="flex-1 min-h-0 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
            <Loader2 className="w-7 h-7 animate-spin" />
            <span className="text-xs">Loading PDF…</span>
          </div>
        )}
        {!loading && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/90 px-4 text-center">
            <AlertTriangle className="w-8 h-8" />
            <p className="text-sm">{error}</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline underline-offset-2 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" /> Open in a new tab
            </a>
          </div>
        )}
        {!loading && !error && numPages > 0 && (
          <Swiper
            {...swiperParams}
            className="feed-swiper h-full"
            onSwiper={(sw) => { swiperRef.current = sw; }}
            onSlideChange={(sw) => setActiveIndex(sw.activeIndex)}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <SwiperSlide key={i} className="!h-full">
                {Math.abs(i - activeIndex) <= 1 ? (
                  <PageSlide
                    docRef={docRef}
                    pagesRef={pagesRef}
                    pageNumber={i + 1}
                    resizeTick={resizeTick}
                  />
                ) : (
                  <PagePlaceholder pageNumber={i + 1} />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </main>
    </div>
  );
}
