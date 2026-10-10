/**
 * TIKTOK-WEB WHEEL ENGINE — one gesture = exactly one card.
 *
 * TikTok's desktop feed never scrolls a "half card": every wheel notch (or
 * trackpad flick) is translated into ONE animated step to the neighbouring
 * card, and everything the user spins during the animation is swallowed and
 * folded into the next step. The result is the signature "locked" feel —
 * the feed is always perfectly aligned, and the browser's half-card +
 * snap-back dance (which felt janky) is gone.
 *
 * The same pattern ships in fullPage.js and every TikTok/Reels clone:
 *  - accumulate wheel deltas per gesture (180ms gap = new gesture)
 *  - threshold crossed → preventDefault + smooth scrollTo(<neighbour>)
 *  - animation lock ignores further events (they accumulate), released on
 *    `scrollend` (or a 900ms hard timeout fallback)
 *  - events originating inside an inner scrollable ([data-inner-scroll])
 *    are left untouched so file lists keep their native scrolling
 *  - `prefers-reduced-motion` → instant (non-animated) steps
 */
export interface FeedWheelOptions {
  /** Number of snap cards currently in the feed (files mode count differs). */
  getCardCount: () => number;
  /** True when the event target sits inside an inner scrollable area. */
  isInnerScrollTarget: (target: EventTarget | null) => boolean;
  /** Fired right before a step starts (lets the app arm its settle guard). */
  onStep?: (dir: 1 | -1) => void;
}

export function attachFeedWheel(el: HTMLElement, opts: FeedWheelOptions): () => void {
  let lock = false;
  let acc = 0;
  let lastTs = 0;
  let releaseTimer: ReturnType<typeof setTimeout> | null = null;
  let scrollendCleanup: (() => void) | null = null;
  let reduced: MediaQueryList | null = null;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch { reduced = null; }

  const release = () => {
    lock = false;
    acc = 0;
    if (releaseTimer) { clearTimeout(releaseTimer); releaseTimer = null; }
  };

  const step = (dir: 1 | -1) => {
    const count = opts.getCardCount();
    if (count <= 0) return;
    const cur = Math.round(el.scrollTop / el.clientHeight);
    const target = Math.min(count - 1, Math.max(0, cur + dir));
    if (target === cur) { acc = 0; return; }
    opts.onStep?.(dir);
    release();
    lock = true;
    el.scrollTo({
      top: target * el.clientHeight,
      behavior: reduced?.matches ? 'auto' : 'smooth',
    });
    // Release on the natural end of the animation; the timeout is the hard
    // fallback for browsers without `scrollend` (and for interrupted scrolls).
    if ('onscrollend' in el) {
      const h = () => { el.removeEventListener('scrollend', h); release(); };
      el.addEventListener('scrollend', h, { once: true });
      scrollendCleanup = () => el.removeEventListener('scrollend', h);
    }
    releaseTimer = setTimeout(release, 900);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // pinch-zoom gesture — never hijack
    // Horizontal-dominant gestures (trackpad swipe-back) stay native.
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    // Firefox line-mode deltas → normalize to roughly pixel scale.
    const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
    if (Math.abs(dy) < 2) return;
    if (opts.isInnerScrollTarget(e.target)) return; // inner lists scroll natively
    e.preventDefault();
    const now = performance.now();
    if (now - lastTs > 180) acc = 0; // gesture gap → start a new accumulation
    lastTs = now;
    acc += dy;
    if (lock) return; // mid-animation: swallow, the next step uses the sum
    if (Math.abs(acc) >= 30) {
      const dir: 1 | -1 = acc > 0 ? 1 : -1;
      acc = 0;
      step(dir);
    }
  };

  el.addEventListener('wheel', onWheel, { passive: false });
  return () => {
    el.removeEventListener('wheel', onWheel);
    if (releaseTimer) clearTimeout(releaseTimer);
    if (scrollendCleanup) scrollendCleanup();
  };
}
