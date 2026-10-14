'use client';

// ---------------------------------------------------------------------------
// VERSION TREE — the minimalist SVG tree of a test's version family, stacked
// into an INFINITE VERTICAL WINDOW.
//
//   trunk (bottom) = the test whose tree is shown
//   branch         = a tier of the crown; the tree GROWS with the family
//   apple          = one version of this test — the photo of the user who
//                    created it, hanging on a branch. Tapping an apple re-roots
//                    the window at THAT version (its own branches and apples
//                    become visible — recursive navigation).
//
//   Navigation — NO buttons: the window is a vertical Swiper over the whole
//   ancestor chain. The tree you opened sits on the first slide; every swipe
//   UP reveals the tree one level above (parent version, grandparent, … up to
//   the family trunk). One more swipe past the trunk lands on the exit slide
//   and carries the user back to the test cards — the swipe never dead-ends.
//
//   Growth levels ("уровни роста"): the crown develops tier by tier as the
//   number of apples increases — 0 apples = a sprout, then 1..5 tiers of
//   branches, the trunk gets taller and the crown wider. Everything is drawn
//   as pure SVG (no node cards) and scales to fill the whole card.
//
// Layout contract mirrors the attached-files modes: `variant="feed"` renders
// full-height inside the TikTok feed, `variant="grid"` renders inside the
// library/shelf grid.
// ---------------------------------------------------------------------------

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { TreeNode } from '@/lib/app-types';
import { useSessionStore } from '@/stores/session-store';
import { tUI } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { ArrowLeft, LayoutGrid, RotateCcw, TreeDeciduous } from 'lucide-react';

// ---- SVG canvas -------------------------------------------------------------
// The world is 400 units wide; the HEIGHT adapts to the card's aspect ratio
// (ResizeObserver) so `meet` scaling fills the whole card at every size — the
// tree is as big as the test card, on the phone and on the desktop alike.
const VB_W = 400;
const DEFAULT_VB_H = 560;
const TRUNK_X = VB_W / 2;

// Palette — warm minimalist: brown wood, soft green leaves, red apples.
// These solids stay UNDER every texture layer: photographic textures are
// served from /public/textures and drawn as SVG patterns on top — if an
// image is slow or missing, the flat-color tree still renders fully.
const C_TRUNK = '#7A5230';
const C_BRANCH = '#6F4A2A';
const C_BRANCH_THIN = '#7E5B39';
const C_LEAF = '#4C9A46';
const C_INK = '#40634D';

const EMPTY_APPLES: TreeNode[] = [];

// Avatar resolver — tg: refs go through the same-origin avatar route
// (same rule as CreatorStrip in shared-bits).
function avatarSrc(image: string | null | undefined, userId?: string): string {
  if (!image) return '';
  if (image.startsWith('tg:') && userId) return `/api/users/${userId}/avatar`;
  if (image.startsWith('data:') || image.startsWith('http')) return image;
  return '';
}

interface Branch {
  d: string;
  p0: { x: number; y: number };
  c: { x: number; y: number };
  p1: { x: number; y: number };
  tier: number;
}

interface Geometry {
  tiers: number;
  trunkD: string;
  trunkTopY: number;
  groundY: number;
  usable: number;
  branches: Branch[]; // ordered bottom tier → top, left then right
}

/** Growth levels: how many branch tiers a tree has for a given number of
 * apples (direct versions of the viewed test). The trunk fraction is the
 * share of the usable vertical span the trunk occupies at that stage — the
 * tree literally GROWS stage by stage. */
function growthStage(apples: number): { tiers: number; trunkFrac: number } {
  if (apples <= 0) return { tiers: 0, trunkFrac: 0.34 };
  if (apples <= 2) return { tiers: 1, trunkFrac: 0.50 };
  if (apples <= 4) return { tiers: 2, trunkFrac: 0.58 };
  if (apples <= 6) return { tiers: 3, trunkFrac: 0.66 };
  if (apples <= 8) return { tiers: 4, trunkFrac: 0.73 };
  return { tiers: 5, trunkFrac: 0.80 };
}

/** Pure SVG geometry of the tree at its current growth stage. All sizes are
 * relative to the usable vertical span, so the tree fills any card. */
function buildTreeGeometry(appleCount: number, vbH: number): Geometry {
  const groundY = vbH - 24;
  const usable = groundY - 28; // leave head-room at the top
  const { tiers, trunkFrac } = growthStage(appleCount);
  const trunkH = usable * trunkFrac;
  const trunkTopY = groundY - trunkH;

  // Trunk: a tapered closed path with a gentle S-curve (wider at the base,
  // a slight lean toward the light).
  const halfBase = Math.max(8, usable * 0.045);
  const halfTop = Math.max(3, usable * 0.016);
  const lean = usable * 0.018;
  const trunkD = [
    `M ${TRUNK_X - halfBase} ${groundY}`,
    `C ${TRUNK_X - halfBase + 2} ${groundY - trunkH * 0.42}, ${TRUNK_X - halfTop - lean} ${trunkTopY + trunkH * 0.4}, ${TRUNK_X - halfTop + lean} ${trunkTopY}`,
    `Q ${TRUNK_X + lean} ${trunkTopY - Math.max(4, usable * 0.012)}, ${TRUNK_X + halfTop + lean} ${trunkTopY}`,
    `C ${TRUNK_X + halfTop + lean + 4} ${trunkTopY + trunkH * 0.4}, ${TRUNK_X + halfBase - 2} ${groundY - trunkH * 0.42}, ${TRUNK_X + halfBase} ${groundY}`,
    'Z',
  ].join(' ');

  // Branches: pairs left/right per tier, bottom tiers reach wider (a real
  // crown), every tier sits a bit higher and the curve rises toward its tip.
  const branches: Branch[] = [];
  if (tiers > 0) {
    const lowestY = groundY - usable * 0.17;
    const highestY = Math.max(trunkTopY + usable * 0.08, lowestY - (tiers - 1) * usable * 0.135);
    const rise = usable * 0.09;
    for (let i = 0; i < tiers; i++) {
      const y = tiers === 1
        ? groundY - trunkH * 0.55
        : lowestY - (i * (lowestY - highestY)) / (tiers - 1);
      const spread = Math.min(VB_W / 2 - 16, usable * (0.34 + 0.075 * (tiers - 1 - i)));
      for (const side of [-1, 1] as const) {
        const p0 = { x: TRUNK_X, y };
        const c = { x: TRUNK_X + side * spread * 0.45, y: y - rise * 0.85 };
        const p1 = { x: TRUNK_X + side * spread, y: y - rise };
        branches.push({
          d: `M ${p0.x} ${p0.y} Q ${c.x} ${c.y}, ${p1.x} ${p1.y}`,
          p0, c, p1, tier: i,
        });
      }
    }
  }
  return { tiers, trunkD, trunkTopY, branches, groundY, usable };
}

/** Point on a quadratic bezier at parameter t. */
function qPoint(p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }, t: number) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
  };
}

// Hang positions along a branch for stacked apples (1st, 2nd, 3rd…)
const HANG_T = [0.72, 0.5, 0.88, 0.36];

interface PlacedApple {
  node: TreeNode;
  x: number;
  y: number; // apple CENTER
  hangY: number; // branch point the stem starts from
}

interface FullLayout {
  geo: Geometry;
  apples: PlacedApple[];
  appleR: number;
}

function layoutTree(apples: TreeNode[], vbH: number): FullLayout {
  const geo = buildTreeGeometry(apples.length, vbH);
  const appleR = Math.max(11, Math.min(17, geo.usable * 0.05));
  const placed: PlacedApple[] = [];
  const slots = geo.branches.length;
  if (slots > 0) {
    apples.forEach((node, j) => {
      if (j >= slots * HANG_T.length) return; // hard cap — 40 apples max
      const b = geo.branches[j % slots];
      const sub = Math.floor(j / slots);
      const pt = qPoint(b.p0, b.c, b.p1, HANG_T[sub] ?? 0.7);
      placed.push({
        node,
        x: pt.x,
        y: pt.y + appleR * 1.55,
        hangY: pt.y,
      });
    });
  }
  return { geo, apples: placed, appleR };
}

// ---- one slide: the SVG tree of a single family member -----------------------

type TFn = (key: string, vars?: Record<string, string | number>) => string;

interface TreeCanvasProps {
  /** The test/version whose tree this slide draws (its trunk). */
  node: TreeNode;
  /** The direct versions of `node` — the apples hanging on it. */
  apples: TreeNode[];
  t: TFn;
  /** Apple tap → re-root the window at that version. */
  onApple: (id: string) => void;
}

function TreeCanvas({ node, apples, t, onApple }: TreeCanvasProps) {
  // The canvas box drives the SVG world height: the tree always fills the
  // card. The element arrives LATER than the first effect run (the slide may
  // mount before Swiper assigns the slide size), so the ref is a state
  // setter — the observer effect re-runs the moment the canvas really mounts.
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null);
  const [vbH, setVbH] = useState<number>(DEFAULT_VB_H);
  // Per-instance suffix for every SVG def id (patterns/gradients/filters):
  // several slides are mounted at once, and duplicated ids would make
  // browsers resolve url(#…) against the FIRST slide's defs only.
  const [uid] = useState(() => Math.random().toString(36).slice(2, 8));
  useEffect(() => {
    if (!wrapEl || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      if (r.width > 0 && r.height > 0) {
        setVbH(Math.round(Math.min(680, Math.max(300, VB_W * r.height / r.width))));
      }
    });
    ro.observe(wrapEl);
    return () => ro.disconnect();
  }, [wrapEl]);

  const layout = useMemo(() => layoutTree(apples, vbH), [apples, vbH]);

  const isTrunkRoot = !node.parentId;
  const rootAuthor = node.creator?.name || '';
  const rootLabel = isTrunkRoot
    ? t('treeOriginalBy', { name: rootAuthor })
    : t('treeVersionBy', { name: rootAuthor });

  return (
    <div
      ref={setWrapEl}
      className="relative h-full w-full rounded-3xl border border-black/10 overflow-hidden"
      style={{
        // photographic sky + the brand meadow haze fading in toward the ground
        backgroundImage:
          'linear-gradient(180deg, rgba(250,253,246,0.5) 0%, rgba(244,250,239,0.3) 42%, rgba(237,246,230,0.68) 78%, #EDF6E6 100%), url(/textures/sky.jpg)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VB_W} ${vbH}`}
        preserveAspectRatio="xMidYMax meet"
        role="img"
        aria-label={t('versionTree')}
      >
        <defs>
          {/* photographic textures (served from /public/textures) — every
          textured layer sits ON TOP of a solid-color twin so a slow or
          missing image degrades gracefully to the flat palette */}
          <pattern id={`vt-bk-${uid}`} patternUnits="userSpaceOnUse" width="72" height="96">
            <image href="/textures/bark.jpg" width="72" height="96" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id={`vt-lv-${uid}`} patternUnits="userSpaceOnUse" width="72" height="72">
            <image href="/textures/leaves.jpg" width="72" height="72" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id={`vt-gr-${uid}`} patternUnits="userSpaceOnUse" width="96" height="96">
            <image href="/textures/grass.jpg" width="96" height="96" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          {/* cylindrical shading: makes the flat trunk path read as a body */}
          <linearGradient id={`vt-ts-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000000" stopOpacity="0.32" />
            <stop offset="0.22" stopColor="#000000" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="0.78" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.36" />
          </linearGradient>
          {/* apple volume: light top-left, deep rim */}
          <radialGradient id={`vt-ap-${uid}`} cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#FF7A64" />
            <stop offset="0.45" stopColor="#E23B2E" />
            <stop offset="1" stopColor="#A31D12" />
          </radialGradient>
          {/* the lawn fades into the meadow color at the rim */}
          <radialGradient id={`vt-gf-${uid}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.55" stopColor="#EDF6E6" stopOpacity="0" />
            <stop offset="1" stopColor="#EDF6E6" stopOpacity="0.85" />
          </radialGradient>
          <filter id={`vt-sh-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#23411F" floodOpacity="0.3" />
          </filter>
          <filter id={`vt-ash-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#3A1D07" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ground — real grass texture, rim-faded into the meadow color */}
        <ellipse cx={TRUNK_X} cy={layout.geo.groundY + 10} rx={170} ry={13} fill="#6E9B4E" opacity={0.5} />
        <ellipse cx={TRUNK_X} cy={layout.geo.groundY + 7} rx={112} ry={9} fill={`url(#vt-gr-${uid})`} />
        <ellipse cx={TRUNK_X} cy={layout.geo.groundY + 7} rx={112} ry={9} fill={`url(#vt-gf-${uid})`} />

        {/* trunk — bark texture + cylindrical shading over a solid base */}
        <path d={layout.geo.trunkD} fill={C_TRUNK} />
        <path d={layout.geo.trunkD} fill={`url(#vt-bk-${uid})`} />
        <path d={layout.geo.trunkD} fill={`url(#vt-ts-${uid})`} />

        {/* branches */}
        {layout.geo.branches.map((b, i) => (
          <path
            key={`br-${i}`}
            d={b.d}
            fill="none"
            stroke={b.tier >= layout.geo.tiers - 1 ? C_BRANCH_THIN : C_BRANCH}
            strokeWidth={Math.max(2.2, layout.appleR * 0.42 - b.tier * 0.7)}
            strokeLinecap="round"
          />
        ))}

        {/* leaf clusters on every branch tip — foliage texture over solid */}
        {layout.geo.branches.map((b, i) => {
          const lr = layout.appleR * 0.95; // leaf ellipse rx scale
          const lx = b.p1.x + (b.p1.x < TRUNK_X ? lr * 0.7 : -lr * 0.7);
          const rot1 = b.p1.x < TRUNK_X ? -24 : 24;
          const rot2 = b.p1.x < TRUNK_X ? -40 : 40;
          const ux = b.p1.x * 0.9 + TRUNK_X * 0.1; // third tuft, tucked inward
          return (
            <g key={`leaf-${i}`} filter={`url(#vt-sh-${uid})`}>
              <ellipse cx={b.p1.x} cy={b.p1.y - 3} rx={lr} ry={lr * 0.55} transform={`rotate(${rot1} ${b.p1.x} ${b.p1.y - 3})`} fill={C_LEAF} opacity={0.95} />
              <ellipse cx={b.p1.x} cy={b.p1.y - 3} rx={lr} ry={lr * 0.55} transform={`rotate(${rot1} ${b.p1.x} ${b.p1.y - 3})`} fill={`url(#vt-lv-${uid})`} />
              <ellipse cx={lx} cy={b.p1.y - lr * 0.8} rx={lr * 0.72} ry={lr * 0.4} transform={`rotate(${rot2} ${lx} ${b.p1.y - lr * 0.8})`} fill={C_LEAF} opacity={0.85} />
              <ellipse cx={lx} cy={b.p1.y - lr * 0.8} rx={lr * 0.72} ry={lr * 0.4} transform={`rotate(${rot2} ${lx} ${b.p1.y - lr * 0.8})`} fill={`url(#vt-lv-${uid})`} opacity={0.92} />
              <ellipse cx={ux} cy={b.p1.y + lr * 0.3} rx={lr * 0.5} ry={lr * 0.3} fill={C_LEAF} opacity={0.8} />
              <ellipse cx={ux} cy={b.p1.y + lr * 0.3} rx={lr * 0.5} ry={lr * 0.3} fill={`url(#vt-lv-${uid})`} opacity={0.9} />
            </g>
          );
        })}

        {/* crown top: finishes the silhouette and hides the trunk's cut */}
        {layout.geo.tiers > 0 && (() => {
          const R = layout.appleR;
          const ty = layout.geo.trunkTopY;
          return (
            <g filter={`url(#vt-sh-${uid})`}>
              <ellipse cx={TRUNK_X} cy={ty - 4} rx={R * 1.15} ry={R * 0.62} fill={C_LEAF} opacity={0.95} />
              <ellipse cx={TRUNK_X} cy={ty - 4} rx={R * 1.15} ry={R * 0.62} fill={`url(#vt-lv-${uid})`} />
              <ellipse cx={TRUNK_X - R * 0.95} cy={ty + 3} rx={R * 0.72} ry={R * 0.42} transform={`rotate(-26 ${TRUNK_X - R * 0.95} ${ty + 3})`} fill={C_LEAF} opacity={0.9} />
              <ellipse cx={TRUNK_X - R * 0.95} cy={ty + 3} rx={R * 0.72} ry={R * 0.42} transform={`rotate(-26 ${TRUNK_X - R * 0.95} ${ty + 3})`} fill={`url(#vt-lv-${uid})`} opacity={0.94} />
              <ellipse cx={TRUNK_X + R * 0.95} cy={ty + 3} rx={R * 0.72} ry={R * 0.42} transform={`rotate(26 ${TRUNK_X + R * 0.95} ${ty + 3})`} fill={C_LEAF} opacity={0.9} />
              <ellipse cx={TRUNK_X + R * 0.95} cy={ty + 3} rx={R * 0.72} ry={R * 0.42} transform={`rotate(26 ${TRUNK_X + R * 0.95} ${ty + 3})`} fill={`url(#vt-lv-${uid})`} opacity={0.94} />
            </g>
          );
        })()}

        {/* sprout: no branches yet — leaves right on the trunk top */}
        {layout.geo.tiers === 0 && (
          <g filter={`url(#vt-sh-${uid})`}>
            <ellipse cx={TRUNK_X - 12} cy={layout.geo.trunkTopY - 6} rx={13} ry={6} transform={`rotate(-28 ${TRUNK_X - 12} ${layout.geo.trunkTopY - 6})`} fill={C_LEAF} />
            <ellipse cx={TRUNK_X - 12} cy={layout.geo.trunkTopY - 6} rx={13} ry={6} transform={`rotate(-28 ${TRUNK_X - 12} ${layout.geo.trunkTopY - 6})`} fill={`url(#vt-lv-${uid})`} />
            <ellipse cx={TRUNK_X + 12} cy={layout.geo.trunkTopY - 6} rx={13} ry={6} transform={`rotate(28 ${TRUNK_X + 12} ${layout.geo.trunkTopY - 6})`} fill={C_LEAF} />
            <ellipse cx={TRUNK_X + 12} cy={layout.geo.trunkTopY - 6} rx={13} ry={6} transform={`rotate(28 ${TRUNK_X + 12} ${layout.geo.trunkTopY - 6})`} fill={`url(#vt-lv-${uid})`} />
            <ellipse cx={TRUNK_X} cy={layout.geo.trunkTopY - 13} rx={9} ry={5.5} fill={C_LEAF} />
            <ellipse cx={TRUNK_X} cy={layout.geo.trunkTopY - 13} rx={9} ry={5.5} fill={`url(#vt-lv-${uid})`} />
          </g>
        )}

        {/* stems + apples (the versions) */}
        {layout.apples.map(a => {
          const author = a.node.creator;
          const src = avatarSrc(author?.image, author?.id);
          const initial = (author?.name || '?').trim().slice(0, 1).toUpperCase() || '?';
          const firstName = (author?.name || '').trim().split(/\s+/)[0] || '';
          const R = layout.appleR;
          const nameFs = Math.max(8, Math.min(11, R * 0.62));
          return (
            <g
              key={`apple-${a.node.id}`}
              className="vt-apple"
              role="button"
              tabIndex={0}
              filter={`url(#vt-ash-${uid})`}
              onClick={() => onApple(a.node.id)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onApple(a.node.id); }}
              aria-label={`${firstName} — ${t('treeVersionLabel')}`}
            >
              <title>{`${firstName} — ${t('treeHint')}`}</title>
              {/* generous invisible hit-area: the <g>'s bbox center falls in
              the EMPTY space between the apple and its name label (the text is
              pointer-events:none), so a plain bbox click missed the apple —
              this transparent disc catches the tap/click for the whole apple */}
              <circle cx={a.x} cy={a.y + R * 0.55} r={R * 1.8} fill="transparent" style={{ pointerEvents: 'all' }} />
              {/* stem */}
              <line x1={a.x} y1={a.hangY + 1} x2={a.x} y2={a.y - R + 2} stroke={C_BRANCH} strokeWidth={1.6} />
              {/* apple body: photo clipped inside a shaded red circle */}
              <circle cx={a.x} cy={a.y} r={R} fill={`url(#vt-ap-${uid})`} stroke="#fff" strokeWidth={2.4} />
              {src ? (
                <>
                  <clipPath id={`vt-clip-${a.node.id}`}>
                    <circle cx={a.x} cy={a.y} r={R - 2.4} />
                  </clipPath>
                  <image
                    href={src}
                    x={a.x - R + 2.4}
                    y={a.y - R + 2.4}
                    width={(R - 2.4) * 2}
                    height={(R - 2.4) * 2}
                    clipPath={`url(#vt-clip-${a.node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </>
              ) : (
                <text x={a.x} y={a.y + R * 0.24} textAnchor="middle" fontSize={R * 0.82} fontWeight={700} fill="#fff">
                  {initial}
                </text>
              )}
              {/* tiny leaf on the apple */}
              <ellipse cx={a.x + R * 0.34} cy={a.y - R - 1.5} rx={R * 0.3} ry={R * 0.15} fill={C_LEAF} transform={`rotate(-32 ${a.x + R * 0.34} ${a.y - R - 1.5})`} />
              {/* the creator's first name under the apple */}
              {firstName && (
                <text x={a.x} y={a.y + R + nameFs + 3} textAnchor="middle" fontSize={nameFs} fill={C_INK} style={{ pointerEvents: 'none' }}>
                  {firstName}
                </text>
              )}
            </g>
          );
        })}

        {/* the trunk's own label: whose test / whose version this tree is */}
        <text x={TRUNK_X} y={layout.geo.groundY + 22} textAnchor="middle" fontSize={11} fontWeight={600} fill={C_INK} opacity={0.9} stroke="#F4FAEF" strokeWidth={2.5} strokeLinejoin="round" paintOrder="stroke">
          {rootLabel}
        </text>

        {/* empty family: the sprout waits for the first version */}
        {apples.length === 0 && (
          <text x={TRUNK_X} y={Math.max(24, layout.geo.trunkTopY - 22)} textAnchor="middle" fontSize={9.5} fill={C_INK} opacity={0.85} stroke="#F4FAEF" strokeWidth={2.2} strokeLinejoin="round" paintOrder="stroke">
            {t('treeEmpty')}
          </text>
        )}
      </svg>
    </div>
  );
}

// ---- component ----------------------------------------------------------------

export interface VersionTreeProps {
  /** The test whose tree is shown (the starting root of the view). */
  testId: string;
  /** Leave the tree (the exit slide past the family trunk lands here). */
  onClose: () => void;
  /** feed = full-height TikTok slide; grid = card inside library/shelf. */
  variant?: 'feed' | 'grid';
}

export default function VersionTreeView({ testId, onClose, variant = 'feed' }: VersionTreeProps) {
  const lang = useSessionStore(s => s.lang);
  const t = useCallback((key: string, vars?: Record<string, string | number>) => tUI(lang, key, vars), [lang]);

  const [family, setFamily] = useState<{ rootId: string; nodes: TreeNode[] } | null>(null);
  const [viewRootId, setViewRootId] = useState<string>(testId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Which slide the window is parked on — drives the header (whose tree /
  // how many versions are on it) while the user walks up the chain.
  const [activeIdx, setActiveIdx] = useState(0);
  // Swiped past the family trunk → the exit slide is up → auto-return to the
  // test cards. Swiping back down cancels it.
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  const fetchFamily = useCallback((id: string) => {
    setLoading(true);
    setError(null);
    api.getTestTree(id)
      .then(data => {
        setFamily(data);
        if (!data.nodes.some(n => n.id === id)) {
          setError(t('noResults'));
        }
      })
      .catch(e => setError(e?.message || 'Error'))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    setActiveIdx(0);
    fetchFamily(viewRootId);
  }, [viewRootId, fetchFamily]);

  // The apples of every family member, grouped by parent (sorted oldest first).
  const applesByParent = useMemo(() => {
    const m = new Map<string, TreeNode[]>();
    if (family) {
      for (const n of family.nodes) {
        const key = n.parentId || '';
        const arr = m.get(key);
        if (arr) arr.push(n);
        else m.set(key, [n]);
      }
      for (const arr of m.values()) arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return m;
  }, [family]);

  // THE VERTICAL WINDOW: the ancestor chain of the viewed test, walked from
  // the current root up through every parentId to the family trunk.
  // chain[0] = the tree the user opened (first slide) → the last entry is the
  // original test's trunk; one MORE slide past it exits back to the tests.
  const chain = useMemo(() => {
    if (!family) return EMPTY_APPLES;
    const out: TreeNode[] = [];
    const seen = new Set<string>();
    let cur: TreeNode | undefined = family.nodes.find(n => n.id === viewRootId);
    while (cur && !seen.has(cur.id)) {
      out.push(cur);
      seen.add(cur.id);
      const pid = cur.parentId || '';
      cur = pid ? family.nodes.find(n => n.id === pid) : undefined;
    }
    return out; // [current, parent, grandparent, …, original]
  }, [family, viewRootId]);

  // apple tap → re-root the window at THAT version (recursive navigation):
  // its tree becomes the first slide and the chain above it rebuilds.
  const navigate = useCallback((id: string) => {
    if (id === viewRootId) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setViewRootId(id);
  }, [viewRootId]);

  const onSlideChange = useCallback((sw: SwiperClass) => {
    const i = sw.activeIndex;
    setActiveIdx(i);
    if (i >= chain.length) {
      // The exit slide: one beat so the panel is seen, then back to the
      // tests. Swiping back down before the beat cancels the exit.
      if (!closeTimerRef.current) {
        closeTimerRef.current = setTimeout(() => {
          closeTimerRef.current = null;
          onCloseRef.current();
        }, 600);
      }
    } else if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, [chain.length]);

  // ---- rendering -----------------------------------------------------------

  if (loading && !family) {
    return (
      <div className={`w-full ${variant === 'feed' ? 'h-full max-w-md lg:max-w-3xl mx-auto flex flex-col gap-3' : ''}`}>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="flex-1 w-full rounded-3xl min-h-64" />
      </div>
    );
  }

  if (error && !family) {
    return (
      <div className={`w-full flex flex-col items-center justify-center gap-3 text-center ${variant === 'feed' ? 'h-full' : 'py-10'}`}>
        <TreeDeciduous className="w-10 h-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground px-6">{error}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-full border-black h-9" onClick={() => fetchFamily(viewRootId)}>
            <RotateCcw className="w-4 h-4 mr-1.5" /> {t('restart')}
          </Button>
          <Button size="sm" variant="outline" className="rounded-full border-black h-9" onClick={onClose}>
            <LayoutGrid className="w-4 h-4 mr-1.5" /> {t('treeToTests')}
          </Button>
        </div>
      </div>
    );
  }

  const safeIdx = Math.min(activeIdx, Math.max(0, chain.length - 1));
  const activeNode = chain[safeIdx] || null;
  const activeApples = activeNode ? (applesByParent.get(activeNode.id) || EMPTY_APPLES) : EMPTY_APPLES;

  const header = (
    <div className="shrink-0 rounded-2xl bg-white/85 border border-black/10 px-3 py-2.5 flex items-center gap-2">
      {/* Universal top-panel back button — one tap returns to the page the
      tree was opened from (the test cards). The vertical swipe still walks
      the ancestor trees; the button is the universal way OUT. */}
      <Button
        variant="outline"
        size="icon"
        onClick={onClose}
        className="rounded-full shrink-0 border-black w-8 h-8"
        title={t('back')}
        aria-label={t('back')}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-sm font-bold leading-tight truncate">{t('versionTree')}</p>
        {activeNode && (
          <p className="text-[11px] text-muted-foreground truncate">{activeNode.title}</p>
        )}
      </div>
      <span className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full bg-[#FFF0D9] text-cta whitespace-nowrap">
        {t('treeVersionsCount', { n: activeApples.length })}
      </span>
    </div>
  );

  // The slide ABOVE the family trunk: swiping up here returns to the tests —
  // the vertical window never dead-ends.
  const exitSlide = (
    <div className="h-full w-full flex items-center justify-center p-3 sm:p-4">
      <div
        className="w-full h-full rounded-3xl border border-black/10 flex flex-col items-center justify-center gap-3 text-center"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(250,253,246,0.55) 0%, rgba(244,250,239,0.35) 55%, rgba(237,246,230,0.8) 100%), url(/textures/sky.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span className="w-16 h-16 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center">
          <LayoutGrid className="w-7 h-7 text-[#40634D]" />
        </span>
        <p className="text-base font-bold">{t('treeToTests')}</p>
        <p className="text-xs text-muted-foreground px-8">{t('treeToTestsHint')}</p>
      </div>
    </div>
  );

  return (
    <div className={`w-full flex flex-col gap-2.5 min-h-0 ${variant === 'feed' ? 'h-full max-w-md lg:max-w-3xl mx-auto' : 'h-full max-h-[560px]'}`}>
      {header}
      {/*
        The infinite vertical window. key={viewRootId}: an apple tap re-roots
        the chain and the window restarts on the tapped version's tree — its
        parent (the tree the user came from) is now one swipe above.
      */}
      <Swiper
        key={viewRootId}
        direction="vertical"
        modules={[Mousewheel]}
        slidesPerView={1}
        spaceBetween={0}
        speed={320}
        resistanceRatio={0}
        touchReleaseOnEdges
        longSwipesRatio={0.35}
        mousewheel={{ forceToAxis: true, sensitivity: 1, thresholdDelta: 12, thresholdTime: 250, releaseOnEdges: false }}
        className="flex-1 min-h-0 w-full"
        onSwiper={sw => setActiveIdx(sw.activeIndex)}
        onSlideChange={onSlideChange}
      >
        {chain.map(node => (
          <SwiperSlide key={node.id} className="!h-full">
            <TreeCanvas
              node={node}
              apples={applesByParent.get(node.id) || EMPTY_APPLES}
              t={t}
              onApple={navigate}
            />
          </SwiperSlide>
        ))}
        <SwiperSlide className="!h-full">{exitSlide}</SwiperSlide>
      </Swiper>
      <p className="shrink-0 text-center text-[11px] text-foreground/70 -mt-1">{t('treeSwipeUp')}</p>
      <style>{`
        .vt-apple { cursor: pointer; transition: transform .15s ease; transform-box: fill-box; transform-origin: center; outline: none; }
        .vt-apple:hover { transform: scale(1.14); }
        .vt-apple:active { transform: scale(.94); }
      `}</style>
    </div>
  );
}
