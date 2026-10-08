'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Music,
  Video,
  FileText,
  Link as LinkIcon,
  ImageIcon,
  Upload,
  Trash2,
  Pencil,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
  Paperclip,
  Check,
  MonitorPlay,
} from 'lucide-react';
import { PdfCanvasViewer } from '@/components/pdf-canvas-viewer';
import { SheetHeaderSwitcher, SheetSwitcher } from '@/components/sheet-switcher';

export interface AttachmentItem {
  id?: string; // present only after the test is saved
  title: string;
  type: 'audio' | 'video' | 'pdf' | 'image' | 'embed' | 'link';
  url: string; // external URL or data: URL for small uploads
  size?: number | null;
  orderNum?: number;
  // client-only helpers for unsaved uploads
  blobUrl?: string; // preview URL for just-picked files
}

export const ATTACHMENT_TYPES: AttachmentItem['type'][] = ['audio', 'video', 'pdf', 'image', 'embed', 'link'];

export function typeIcon(type: AttachmentItem['type'], className = 'w-4 h-4') {
  switch (type) {
    case 'audio': return <Music className={className} />;
    case 'video': return <Video className={className} />;
    case 'pdf': return <FileText className={className} />;
    case 'image': return <ImageIcon className={className} />;
    case 'embed': return <MonitorPlay className={className} />;
    default: return <LinkIcon className={className} />;
  }
}

// Upload limit: keeps the JSON payload under Vercel's request size cap
export const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

function formatSize(bytes?: number | null) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Same-origin streaming URL for a saved attachment (PDF framing, audio seeking). */
export function attachmentFileUrl(a: AttachmentItem): string {
  if (a.blobUrl) return a.blobUrl;
  if (a.id) return `/api/attachments/${a.id}/file`;
  return a.url; // fallback: external URL opened directly
}

/** Direct open URL (new tab). For unsaved data: URL items we cannot stream yet. */
function attachmentOpenUrl(a: AttachmentItem): string {
  if (a.blobUrl || a.id) return attachmentFileUrl(a);
  return a.url;
}

/* ------------------------------------------------------------------ */
/* Inline media preview (audio player / video player / PDF modal)      */
/* ------------------------------------------------------------------ */

function AudioPreview({ item }: { item: AttachmentItem }) {
  return (
    <div className="mt-2">
      <audio
        controls
        preload="metadata"
        src={attachmentFileUrl(item)}
        className="w-full h-10"
      />
    </div>
  );
}

function VideoPreview({ item }: { item: AttachmentItem }) {
  return (
    <video
      controls
      preload="metadata"
      src={attachmentFileUrl(item)}
      className="mt-2 w-full max-h-64 rounded-lg bg-black"
    />
  );
}

/** Embedded external player (TED, YouTube, SoundCloud, VK ... via their official embed URL). */
function EmbedPreview({ item }: { item: AttachmentItem }) {
  return (
    <div className="mt-2">
      <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={item.url}
          title={item.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="flex justify-end mt-1">
        <button
          onClick={() => window.open(item.url, '_blank')}
          className="text-[11px] text-muted-foreground hover:text-foreground underline flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> Player not loading? Open externally
        </button>
      </div>
    </div>
  );
}

/**
 * True native inline PDF rendering via PDF.js canvas — works on every browser,
 * including Android Chrome where <iframe> PDFs are not supported (they render
 * as an "Open" placeholder and navigate away).
 */
function PdfInline({ item }: { item: AttachmentItem }) {
  return <PdfCanvasViewer url={attachmentFileUrl(item)} heightClass="h-[560px]" />;
}

export function PdfViewerModal({ item, onClose }: { item: AttachmentItem | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-2 sm:p-6" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-4xl h-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {typeIcon(item.type)}
            <span className="text-sm font-medium truncate">{item.title}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => window.open(attachmentOpenUrl(item), '_blank')}>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 px-2 pb-2">
          <PdfCanvasViewer url={attachmentFileUrl(item)} heightClass="h-full" />
        </div>
      </div>
    </div>
  );
}

/** One attachment row with preview, used in start / take / results panels. */
function ViewerRow({ item }: { item: AttachmentItem }) {
  const [pdfExpanded, setPdfExpanded] = useState(false);
  return (
    <div className="py-2.5 border-b last:border-b-0">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {typeIcon(item.type)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug break-words">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-[10px] uppercase rounded-full px-1.5 py-0">{item.type}</Badge>
            {item.size ? <span className="text-[11px] text-muted-foreground">{formatSize(item.size)}</span> : null}
          </div>
          {item.type === 'audio' && <AudioPreview item={item} />}
          {item.type === 'video' && <VideoPreview item={item} />}
          {item.type === 'embed' && <EmbedPreview item={item} />}
          {item.type === 'pdf' && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => setPdfExpanded(v => !v)}>
                  {pdfExpanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {pdfExpanded ? 'Hide PDF' : 'Show PDF'}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full" onClick={() => window.open(attachmentOpenUrl(item), '_blank')}>
                  <ExternalLink className="w-3 h-3 mr-1" /> New tab
                </Button>
              </div>
              {pdfExpanded && <PdfInline item={item} />}
            </div>
          )}
          {item.type === 'image' && (
            <img src={attachmentFileUrl(item)} alt={item.title} className="mt-2 max-h-48 rounded-lg" />
          )}
          {item.type === 'link' && (
            <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs rounded-full" onClick={() => window.open(item.url, '_blank')}>
              <ExternalLink className="w-3 h-3 mr-1" /> Open link
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Scrollable list of attachments with inline players (no outer chrome). */
export function AttachmentsList({ items, emptyText }: { items: AttachmentItem[]; emptyText?: string }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground py-4 text-center">{emptyText || 'No attached files yet.'}</p>;
  }
  return (
    <div className="divide-y">
      {items.map((item, idx) => <ViewerRow key={item.id || `idx-${idx}`} item={item} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile bottom sheet: fixed up-arrow button + sliding panel          */
/* ------------------------------------------------------------------ */

export function AttachmentsBottomSheet({
  items,
  open: openProp,
  onOpenChange,
  switcher,
  hideLauncher = false,
  title,
}: {
  items: AttachmentItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When provided, the header arrow merges with the title and opens a window switcher */
  switcher?: SheetSwitcher;
  /** Hide the floating bottom launcher button (window still opens via header / switcher) */
  hideLauncher?: boolean;
  /** Localized header label, defaults to "Attached Files (N)" */
  title?: string;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = (v: boolean) => {
    setOpenState(v);
    onOpenChange?.(v);
  };
  if (!items.length) return null;

  return (
    <>
      {/* Floating up-arrow button (mobile / tablet) */}
      {!hideLauncher && !open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open attached files"
          className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-cta text-white pl-3 pr-4 py-3 shadow-xl border border-black/10 active:scale-95 transition-transform"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="text-sm font-semibold">{title || `Attached Files (${items.length})`}</span>
        </button>
      )}

      {/* Bottom sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t border-black/10 flex flex-col max-h-[78vh] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              {switcher ? (
                <SheetHeaderSwitcher
                  icon={<Paperclip className="w-4 h-4" />}
                  title={title || `Attached Files (${items.length})`}
                  options={switcher.options}
                  onSelect={switcher.onSelect}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close attached files"
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-sm flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4" /> {title || `Attached Files (${items.length})`}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 overflow-y-auto max-h-[66vh]">
              <div className="px-4 pb-8">
                <AttachmentsList items={items} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}

/** Desktop side panel version (paired with the flex layout of take-test). */
export function AttachmentsSidePanel({ items, onClose, title }: { items: AttachmentItem[]; onClose: () => void; title?: string }) {
  return (
    <div className="w-full lg:w-[400px] shrink-0">
      <div className="rounded-4xl border border-black bg-white flex flex-col h-[calc(100vh-160px)] lg:h-[680px] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <span className="font-semibold text-sm flex items-center gap-1.5">
            <Paperclip className="w-4 h-4" /> {title || `Attached Files (${items.length})`}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 pb-6">
            <AttachmentsList items={items} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editor (create / edit test) — view, add, edit, delete, reorder      */
/* ------------------------------------------------------------------ */

interface EditorRowProps {
  item: AttachmentItem;
  index: number;
  count: number;
  onUpdate: (patch: Partial<AttachmentItem>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}

function EditorRow({ item, index, count, onUpdate, onRemove, onMove }: EditorRowProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-2xl border border-black/15 bg-white p-3">
      <div className="flex items-start gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {typeIcon(item.type)}
        </div>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={e => onUpdate({ title: e.target.value })}
                  placeholder="File title"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL</Label>
                <Input
                  value={item.blobUrl ? '(uploaded file)' : item.url}
                  onChange={e => onUpdate({ url: e.target.value })}
                  placeholder="https://..."
                  className="h-8 text-sm"
                  disabled={!!item.blobUrl}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <div className="flex flex-wrap gap-1.5">
                  {ATTACHMENT_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => onUpdate({ type: t })}
                      className={`px-2.5 h-7 rounded-full text-xs border flex items-center gap-1 transition-colors ${
                        item.type === t ? 'bg-cta text-white border-cta' : 'bg-white border-black/15 hover:bg-muted'
                      }`}
                    >
                      {typeIcon(t, 'w-3 h-3')} {t}
                    </button>
                  ))}
                </div>
              </div>
              <Button size="sm" className="h-7 rounded-full text-xs" onClick={() => setEditing(false)}>
                <Check className="w-3 h-3 mr-1" /> Done
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium leading-snug break-words">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <Badge variant="outline" className="text-[10px] uppercase rounded-full px-1.5 py-0">{item.type}</Badge>
                {item.size ? <span className="text-[11px] text-muted-foreground">{formatSize(item.size)}</span> : null}
                {!item.blobUrl && (
                  <span className="text-[11px] text-muted-foreground truncate max-w-[240px]">{item.url}</span>
                )}
                {item.blobUrl && <span className="text-[11px] text-emerald-600">uploaded (saved with the test)</span>}
              </div>
              {item.type === 'audio' && <AudioPreview item={item} />}
              {item.type === 'video' && <VideoPreview item={item} />}
              {item.type === 'embed' && <EmbedPreview item={item} />}
              {item.type === 'pdf' && item.id && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1.5 h-7 text-xs rounded-full"
                  onClick={() => window.open(attachmentFileUrl(item), '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" /> Open
                </Button>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-0.5 shrink-0">
          <div className="flex gap-0.5">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={index === 0} onClick={() => onMove(-1)} title="Move up">
              <ChevronUp className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={index === count - 1} onClick={() => onMove(1)} title="Move down">
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex gap-0.5">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(e => !e)} title="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onRemove} title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AttachmentsEditor({
  items,
  onChange,
}: {
  items: AttachmentItem[];
  onChange: (items: AttachmentItem[]) => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<AttachmentItem['type']>('link');
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const add = () => {
    if (!url.trim()) {
      toast({ title: 'Error', description: 'Paste a file URL first', variant: 'destructive' });
      return;
    }
    const next = [...items, { title: title.trim() || 'Attachment', type, url: url.trim() }];
    onChange(next);
    setTitle(''); setUrl(''); setShowAdd(false);
  };

  const onPickFile = async (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      toast({
        title: 'File is too large',
        description: `Max ${formatSize(MAX_UPLOAD_BYTES)} per upload. For bigger files host them online and paste the link.`,
        variant: 'destructive',
      });
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const guessed = file.type.startsWith('audio/') ? 'audio'
      : file.type.startsWith('video/') ? 'video'
      : file.type === 'application/pdf' ? 'pdf'
      : file.type.startsWith('image/') ? 'image' : 'link';
    const blobUrl = URL.createObjectURL(file);
    onChange([...items, {
      title: file.name.replace(/\.[^.]+$/, ''),
      type: guessed as AttachmentItem['type'],
      url: dataUrl,
      size: file.size,
      blobUrl,
    }]);
  };

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <EditorRow
              key={item.id || `new-${idx}`}
              item={item}
              index={idx}
              count={items.length}
              onUpdate={patch => onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)))}
              onRemove={() => onChange(items.filter((_, i) => i !== idx))}
              onMove={dir => {
                const next = [...items];
                const j = idx + dir;
                [next[idx], next[j]] = [next[j], next[idx]];
                onChange(next);
              }}
            />
          ))}
        </div>
      )}

      {showAdd ? (
        <div className="rounded-2xl border border-dashed border-black/25 p-3 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Week 3 Audio" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {ATTACHMENT_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-2.5 h-8 rounded-full text-xs border flex items-center gap-1 transition-colors ${
                      type === t ? 'bg-cta text-white border-cta' : 'bg-white border-black/15 hover:bg-muted'
                    }`}
                  >
                    {typeIcon(t, 'w-3 h-3')} {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">File URL</Label>
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://... (mp3, mp4, pdf)" className="h-8 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 rounded-full text-xs" onClick={add}>
              <Check className="w-3 h-3 mr-1" /> Add file
            </Button>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="rounded-full text-xs border-black" onClick={() => setShowAdd(true)}>
            <LinkIcon className="w-3 h-3 mr-1" /> Add by link
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-xs border-black" onClick={() => fileRef.current?.click()}>
            <Upload className="w-3 h-3 mr-1" /> Upload file
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,video/*,application/pdf,image/*"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) onPickFile(f);
              e.target.value = '';
            }}
          />
        </div>
      )}
    </div>
  );
}
