'use client';

// ---------------------------------------------------------------------------
// VERSION TREE — the "beautiful tree" view of a test's version family.
//
//   trunk (bottom)  = the original test
//   branch          = a version created by changing the test (a copy)
//   branch-on-branch= a version made FROM a version
//   apple           = the photo of the user who grew that branch — tapping an
//                     apple re-roots the whole view at THAT version, so its
//                     own branches/apples become visible ("who took this
//                     version as a basis").
//
// The view is self-contained: it fetches the family (GET /api/tests/[id]/tree)
// and the notes (GET /api/tests/[id]/notes), renders trunk → branches →
// apples, and carries the notes panel (the "small contribution" path).
//
// Layout contract mirrors the attached-files modes: `variant="feed"` renders
// full-height inside the TikTok feed, `variant="grid"` renders inside the
// library/shelf grid. Both scroll internally (data-inner-scroll +
// swiper-no-swiping) so feed gestures never fight the tree canvas.
// ---------------------------------------------------------------------------

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type { TestNote, TreeNode } from '@/lib/app-types';
import { useSessionStore } from '@/stores/session-store';
import { tUI } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { ArrowLeft, Loader2, RotateCcw, StickyNote, TreeDeciduous } from 'lucide-react';

// ---- layout constants -------------------------------------------------------
const CARD_W = 150;   // branch mini-card width (px)
const CARD_H = 86;    // uniform node-card height
const GAP_X = 34;     // horizontal gap between leaf slots
const ROW_H = 112;    // vertical distance between levels
const PAD_X = 26;     // canvas side padding
const PAD_TOP = 30;
const PAD_BOTTOM = 34;

// Avatar resolver — tg: refs go through the same-origin avatar route
// (same rule as CreatorStrip in shared-bits).
function avatarSrc(image: string | null | undefined, userId?: string): string {
  if (!image) return '';
  if (image.startsWith('tg:') && userId) return `/api/users/${userId}/avatar`;
  if (image.startsWith('data:') || image.startsWith('http')) return image;
  return '';
}

function Avatar({ image, userId, name, className }: { image?: string | null; userId?: string; name?: string; className?: string }) {
  const src = avatarSrc(image, userId);
  const initial = (name || '?').trim().slice(0, 1).toUpperCase() || '?';
  return (
    <span className={`overflow-hidden rounded-full bg-cta text-white flex items-center justify-center font-bold shrink-0 ${className || ''}`}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : initial}
    </span>
  );
}

interface PlacedNode {
  node: TreeNode;
  level: number;
  x: number; // center x
  y: number; // TOP y of the card
  parent: { x: number; y: number } | null; // parent card's top-center (branch start)
  childBottom: { x: number; y: number } | null; // this card's bottom-center (branch end for its kids)
}

/**
 * Tidy-tree layout: leaves get sequential slots, parents center over their
 * children. The trunk sits at the BOTTOM (a tree grows upward): level 0 is
 * the deepest row on screen.
 */
function layoutTree(viewRoot: TreeNode, byParent: Map<string, TreeNode[]>) {
  let slotCounter = 0;
  let maxLevel = 0;
  const slots = new Map<string, { node: TreeNode; level: number; slot: number }>();

  const walk = (node: TreeNode, level: number): number => {
    maxLevel = Math.max(maxLevel, level);
    const kids = (byParent.get(node.id) || [])
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (kids.length === 0) {
      const slot = slotCounter++;
      slots.set(node.id, { node, level, slot });
      return slot;
    }
    const kidSlots = kids.map(k => walk(k, level + 1));
    const slot = (kidSlots[0] + kidSlots[kidSlots.length - 1]) / 2;
    slots.set(node.id, { node, level, slot });
    return slot;
  };
  walk(viewRoot, 0);

  const totalSlots = Math.max(1, slotCounter);
  const contentW = totalSlots * (CARD_W + GAP_X) - GAP_X + PAD_X * 2;
  const contentH = PAD_TOP + (maxLevel + 1) * ROW_H + PAD_BOTTOM;

  const xOf = (slot: number) => PAD_X + slot * (CARD_W + GAP_X) + CARD_W / 2;
  // root (level 0) at the BOTTOM; deeper levels stack upward
  const yOf = (level: number) => PAD_TOP + (maxLevel - level) * ROW_H;

  const placed: PlacedNode[] = [];
  for (const { node, level, slot } of slots.values()) {
    const top = { x: xOf(slot), y: yOf(level) };
    const parentNode = node.parentId ? slots.get(node.parentId) : null;
    placed.push({
      node,
      level,
      x: top.x,
      y: top.y,
      parent: parentNode ? { x: xOf(parentNode.slot), y: yOf(parentNode.level) } : null,
      childBottom: { x: top.x, y: top.y + CARD_H },
    });
  }
  return { placed, contentW, contentH, maxLevel };
}

export interface VersionTreeProps {
  /** The test whose tree is shown (the starting root of the view). */
  testId: string;
  /** Back to the test cards (label/icon handled by the caller's context). */
  onClose: () => void;
  /** feed = full-height TikTok slide; grid = card inside library/shelf. */
  variant?: 'feed' | 'grid';
}

export default function VersionTreeView({ testId, onClose, variant = 'feed' }: VersionTreeProps) {
  const lang = useSessionStore(s => s.lang);
  const sessionUser = useSessionStore(s => s.user);
  const t = useCallback((key: string, vars?: Record<string, string | number>) => tUI(lang, key, vars), [lang]);

  // family data + navigation history (apple taps re-root the view)
  const [family, setFamily] = useState<{ rootId: string; nodes: TreeNode[] } | null>(null);
  const [viewRootId, setViewRootId] = useState<string>(testId);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // notes for the CURRENT root (they belong to the test being viewed)
  const [notes, setNotes] = useState<TestNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteBusy, setNoteBusy] = useState(false);

  const fetchFamily = useCallback((id: string) => {
    setLoading(true);
    setError(null);
    api.getTestTree(id)
      .then(data => {
        setFamily(data);
        // The requested test must be part of the family — it always is
        // (the endpoint roots the family at it when orphaned).
        if (!data.nodes.some(n => n.id === id)) {
          setError(t('noResults'));
        }
      })
      .catch(e => setError(e?.message || 'Error'))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    fetchFamily(viewRootId);
  }, [viewRootId, fetchFamily]);

  useEffect(() => {
    setNotesLoading(true);
    api.getNotes(viewRootId)
      .then(r => setNotes(r.notes || []))
      .catch(() => setNotes([]))
      .finally(() => setNotesLoading(false));
  }, [viewRootId]);

  const byParent = useMemo(() => {
    const m = new Map<string, TreeNode[]>();
    if (!family) return m;
    for (const n of family.nodes) {
      const key = n.parentId || '';
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(n);
    }
    return m;
  }, [family]);

  const viewRoot = useMemo(
    () => family?.nodes.find(n => n.id === viewRootId) || null,
    [family, viewRootId]
  );

  const layout = useMemo(() => {
    if (!viewRoot) return null;
    return layoutTree(viewRoot, byParent);
  }, [viewRoot, byParent]);

  // apple tap → re-root at that version
  const navigate = useCallback((id: string) => {
    if (id === viewRootId) return;
    setHistory(h => [...h, viewRootId]);
    setViewRootId(id);
  }, [viewRootId]);

  const goBack = useCallback(() => {
    setHistory(h => {
      if (h.length > 0) {
        const prev = h[h.length - 1];
        setViewRootId(prev);
        return h.slice(0, -1);
      }
      // no history (opened a version straight from a link) → the family trunk
      if (family && family.rootId !== viewRootId) setViewRootId(family.rootId);
      return h;
    });
  }, [family, viewRootId]);

  const submitNote = useCallback(async () => {
    const text = noteText.trim();
    if (!text || noteBusy) return;
    setNoteBusy(true);
    try {
      const note = await api.createNote(viewRootId, text);
      setNotes(prev => [note, ...prev]);
      setNoteText('');
      // notes panel is the feedback surface — a quiet toast-less confirm keeps
      // the tree view calm; the note appears instantly in the list
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setNoteBusy(false);
    }
  }, [noteText, noteBusy, viewRootId]);

  // ---- rendering -----------------------------------------------------------

  const canGoBack = history.length > 0 || (!!family && family.rootId !== viewRootId);
  const versionsCount = (family?.nodes.length || 1) - 1;

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
            <ArrowLeft className="w-4 h-4 mr-1.5" /> {t(variant === 'feed' ? 'backToTest' : 'backToTests')}
          </Button>
        </div>
      </div>
    );
  }

  const header = (
    <div className="shrink-0 rounded-2xl bg-white/85 border border-black/10 px-3 py-2.5 flex items-center gap-2">
      <Button
        size="sm" variant="outline"
        onClick={onClose}
        title={t(variant === 'feed' ? 'backToTest' : 'backToTests')}
        aria-label={t(variant === 'feed' ? 'backToTest' : 'backToTests')}
        className="h-8 rounded-full border-black text-xs px-2.5 shrink-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
        <span className="truncate">{t(variant === 'feed' ? 'backToTest' : 'backToTests')}</span>
      </Button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-sm font-bold leading-tight truncate">{t('versionTree')}</p>
        {viewRoot && (
          <p className="text-[11px] text-muted-foreground truncate">{viewRoot.title}</p>
        )}
      </div>
      <span className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full bg-[#FFF0D9] text-cta whitespace-nowrap">
        {t('treeVersionsCount', { n: Math.max(0, versionsCount) })}
      </span>
      {canGoBack && (
        <Button
          size="sm" variant="outline"
          onClick={goBack}
          title={t('treeBackToTree')}
          className="h-8 rounded-full border-black text-xs px-2.5 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="truncate">{t('treeBackToTree')}</span>
        </Button>
      )}
    </div>
  );

  const canvas = layout ? (
    <div
      data-inner-scroll
      className="swiper-no-swiping flex-1 min-h-0 overflow-auto rounded-3xl border border-black/10 [scrollbar-width:thin]"
      style={{ background: 'linear-gradient(180deg, #EAF6FF 0%, #F4FBF1 55%, #E8F5E0 100%)' }}
    >
      <div className="relative mx-auto" style={{ width: Math.max(layout.contentW, 320), height: layout.contentH }}>
        {/* ground */}
        <div
          className="absolute left-0 right-0 rounded-[100%] bg-[#BFE3AC]/80"
          style={{ height: 18, bottom: 6 }}
        />
        {/* branches */}
        <svg className="absolute inset-0 pointer-events-none" width={Math.max(layout.contentW, 320)} height={layout.contentH}>
          {layout.placed.map(p => {
            if (!p.parent) return null;
            const px = p.parent.x;
            const py = p.parent.y; // parent card TOP (branches grow upward)
            const cx = p.childBottom!.x;
            const cy = p.childBottom!.y;
            const dy = Math.max(24, (py - cy) * 0.55);
            const d = `M ${px} ${py} C ${px} ${py - dy}, ${cx} ${cy + dy}, ${cx} ${cy}`;
            return (
              <path
                key={`edge-${p.node.id}`}
                d={d}
                fill="none"
                stroke={p.level === 1 ? '#8B6748' : '#A08966'}
                strokeWidth={p.level === 1 ? 4 : 2.5}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* apples (on the branches, above the child's bottom edge) */}
        {layout.placed.map(p => {
          if (!p.parent) return null;
          const ax = (p.parent.x + p.childBottom!.x) / 2;
          const ay = (p.parent.y + p.childBottom!.y) / 2;
          const author = p.node.creator;
          return (
            <button
              key={`apple-${p.node.id}`}
              type="button"
              onClick={() => navigate(p.node.id)}
              title={`${author?.name || ''} — ${t('treeHint')}`}
              aria-label={`${author?.name || ''} — ${t('treeVersionLabel')}`}
              className="absolute z-20 w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E23B2E] ring-2 ring-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              style={{ left: ax, top: ay }}
            >
              <Avatar image={author?.image} userId={author?.id} name={author?.name} className="w-7 h-7 text-[11px]" />
              {/* leaf */}
              <span className="absolute -top-1 right-0 w-2.5 h-1.5 bg-[#4C9A46] rounded-full rotate-[-30deg]" />
            </button>
          );
        })}
        {/* node cards */}
        {layout.placed.map(p => {
          const isCurrent = p.node.id === viewRootId;
          const isTrunk = !p.node.parentId;
          const author = p.node.creator;
          const bandStyle = p.node.coverColor ? { backgroundColor: p.node.coverColor } : undefined;
          const bandClass = p.node.coverColor ? '' : 'bg-gradient-to-br from-[#B7E4C7] to-[#95D5B2]';
          return (
            <button
              key={`card-${p.node.id}`}
              type="button"
              onClick={() => navigate(p.node.id)}
              className={`absolute z-10 text-left rounded-2xl border-2 bg-white overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] ${
                isCurrent ? 'border-primary shadow-lg ring-2 ring-primary/30' : 'border-black/15 hover:border-black/40'
              }`}
              style={{
                left: p.x - CARD_W / 2,
                top: p.y,
                width: CARD_W,
                height: CARD_H,
                transform: isCurrent ? 'scale(1.04)' : undefined,
              }}
              title={p.node.title}
            >
              <div style={bandStyle} className={`${bandClass} h-9 px-2 flex items-center`}>
                <p className="text-[11px] font-bold text-[#1B4332] leading-tight line-clamp-2">{p.node.title}</p>
              </div>
              <div className="px-2 py-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-1 min-w-0">
                  <Avatar image={author?.image} userId={author?.id} name={author?.name} className="w-3.5 h-3.5 text-[8px]" />
                  <span className="text-[9px] text-muted-foreground truncate">
                    {isTrunk ? t('treeOriginalBy', { name: author?.name || '' }) : t('treeVersionBy', { name: author?.name || '' })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[8px] font-bold px-1.5 py-px rounded-full ${isCurrent ? 'bg-primary text-white' : isTrunk ? 'bg-[#FFF0D9] text-cta' : 'bg-muted text-muted-foreground'}`}>
                    {isCurrent ? t('treeThisVersion') : isTrunk ? t('treeTrunk') : t('treeVersionLabel')}
                  </span>
                  {!!p.node._count?.questions && (
                    <span className="text-[8px] text-muted-foreground">{p.node._count.questions}Q</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {/* empty family: hint above the lone trunk */}
        {layout.placed.length === 1 && (
          <p className="absolute left-1/2 -translate-x-1/2 text-[11px] text-[#40634D] bg-white/80 rounded-full px-3 py-1 shadow-sm whitespace-nowrap"
             style={{ top: 4 }}>
            {t('treeEmpty')}
          </p>
        )}
      </div>
    </div>
  ) : null;

  const notesPanel = (
    <div className="shrink-0 rounded-2xl bg-white/85 border border-black/10 p-3" data-inner-scroll>
      <p className="text-xs font-bold flex items-center gap-1.5 mb-2">
        <StickyNote className="w-3.5 h-3.5 text-cta" /> {t('notesTitle')}
      </p>
      <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {notesLoading ? (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> {t('loading')}</p>
        ) : notes.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">{t('notesEmpty')}</p>
        ) : (
          notes.map(n => (
            <div key={n.id} className="flex gap-2 items-start bg-muted/40 rounded-xl px-2 py-1.5">
              <Avatar image={n.user?.image} userId={n.user?.id} name={n.user?.name} className="w-5 h-5 text-[9px] mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground truncate">{n.user?.name}</p>
                <p className="text-xs leading-snug break-words">{n.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {sessionUser && (
        <div className="mt-2 flex flex-col gap-1.5">
          <Textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder={t('notePlaceholder')}
            rows={2}
            className="text-xs rounded-xl bg-white border-black/15 min-h-0"
          />
          <Button
            size="sm"
            onClick={submitNote}
            disabled={noteBusy || !noteText.trim()}
            className="h-8 rounded-full self-end bg-primary hover:bg-primary/90 text-xs"
          >
            {noteBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
            {t('noteCreate')}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full flex flex-col gap-2.5 min-h-0 ${variant === 'feed' ? 'h-full max-w-md lg:max-w-3xl mx-auto' : 'h-full max-h-[560px]'}`}>
      {header}
      {canvas}
      <p className="shrink-0 text-center text-[11px] text-foreground/70 -mt-1">{t('treeHint')}</p>
      {notesPanel}
    </div>
  );
}
