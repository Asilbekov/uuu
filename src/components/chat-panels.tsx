'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, ChevronDown, Send, Users, X } from 'lucide-react';
import MathText from '@/components/math-text';
import { SheetHeaderSwitcher, SheetSwitcher } from '@/components/sheet-switcher';

/**
 * Chat panels (AI Tutor + per-test group chat).
 *
 * Mirrors the "Attached Files" behaviour:
 *  - Mobile / tablet (< lg): slides up from the bottom as a bottom sheet
 *    with a dimmed backdrop (same look as AttachmentsBottomSheet).
 *  - Desktop (>= lg): stays as the side panel card next to the question.
 */

/* true when viewport >= lg (1024px). Panels only mount after a user click,
   so the lazy initializer is hydration-safe. */
function useIsDesktopLg() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

export interface GroupChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

/* Typing indicator (three bouncing dots) */
function TypingBubble() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 bg-cta rounded-lg flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-[#F4F4F5] border border-black/10 rounded-2xl rounded-tl-sm px-3.5 py-3">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/* Bottom sheet chrome — identical styling to AttachmentsBottomSheet */
function MobileChatSheet({
  onClose,
  icon,
  title,
  subtitle,
  body,
  footer,
  switcher,
}: {
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
  switcher?: SheetSwitcher;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t border-black/10 flex flex-col h-[78vh] animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          {switcher ? (
            <SheetHeaderSwitcher
              icon={icon}
              title={title}
              subtitle={subtitle}
              options={switcher.options}
              onSelect={switcher.onSelect}
            />
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-cta rounded-lg flex items-center justify-center shrink-0">{icon}</div>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight">{title}</p>
                {subtitle ? <p className="text-xs text-muted-foreground leading-tight truncate">{subtitle}</p> : null}
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 min-h-0">{body}</div>
        <div
          className="border-t shrink-0 bg-white px-3 py-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Tutor chat                                                       */
/* ------------------------------------------------------------------ */

export function AiChatPanel({
  open,
  onClose,
  subtitle,
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  endRef,
  switcher,
}: {
  open: boolean;
  onClose: () => void;
  subtitle?: React.ReactNode;
  messages: { role: 'user' | 'assistant'; content: string }[];
  loading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  endRef: React.RefObject<HTMLDivElement | null>;
  switcher?: SheetSwitcher;
}) {
  const isDesktop = useIsDesktopLg();
  if (!open) return null;

  const icon = <Bot className="w-4 h-4 text-white" />;

  const body = (
    <ScrollArea className="h-full px-4">
      <div className="space-y-3 py-2">
        {messages.length === 0 && loading && <TypingBubble />}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-cta rounded-lg flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-[#F4F4F5] border border-black/10 rounded-tl-sm'
            }`}>
              <MathText text={msg.content} />
            </div>
          </div>
        ))}
        {loading && messages.length > 0 && <TypingBubble />}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );

  const footer = (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Ask a follow-up..."
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={loading}
        className="flex-1 text-sm"
      />
      <Button
        size="sm"
        onClick={onSend}
        disabled={loading || !input.trim()}
        className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="w-[420px] shrink-0">
        <Card className="rounded-4xl border border-black bg-white flex flex-col h-[680px]">
          <CardHeader className="pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cta rounded-lg flex items-center justify-center">{icon}</div>
                <div>
                  <CardTitle className="text-sm">AI Tutor</CardTitle>
                  {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">{body}</CardContent>
          <CardFooter className="pt-3 pb-4 shrink-0">{footer}</CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <MobileChatSheet
      onClose={onClose}
      icon={icon}
      title="AI Tutor"
      subtitle={subtitle}
      body={body}
      footer={footer}
      switcher={switcher}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Per-test group chat                                                 */
/* ------------------------------------------------------------------ */

export function GroupChatPanel({
  open,
  onClose,
  subtitle,
  messages,
  currentUserId,
  input,
  onInputChange,
  onSend,
  sending,
  endRef,
  switcher,
}: {
  open: boolean;
  onClose: () => void;
  subtitle?: React.ReactNode;
  messages: GroupChatMessage[];
  currentUserId?: string;
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  sending: boolean;
  endRef: React.RefObject<HTMLDivElement | null>;
  switcher?: SheetSwitcher;
}) {
  const isDesktop = useIsDesktopLg();
  if (!open) return null;

  const icon = <Users className="w-4 h-4 text-white" />;

  const body = (
    <ScrollArea className="h-full px-4">
      <div className="space-y-3 py-2">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No messages yet — say hi to your group!
          </p>
        )}
        {messages.map(msg => {
          const own = msg.userId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                own
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-[#F4F4F5] border border-black/10 rounded-tl-sm'
              }`}>
                {!own && <p className="text-[11px] font-semibold text-primary mb-0.5">{msg.userName}</p>}
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${own ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );

  const footer = (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Message the group..."
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        maxLength={2000}
        className="flex-1 text-sm"
      />
      <Button
        size="sm"
        onClick={onSend}
        disabled={sending || !input.trim()}
        className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="w-[420px] shrink-0">
        <Card className="rounded-4xl border border-black bg-white flex flex-col h-[680px]">
          <CardHeader className="pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cta rounded-lg flex items-center justify-center">{icon}</div>
                <div>
                  <CardTitle className="text-sm">Test Chat</CardTitle>
                  {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">{body}</CardContent>
          <CardFooter className="pt-3 pb-4 shrink-0">{footer}</CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <MobileChatSheet
      onClose={onClose}
      icon={icon}
      title="Test Chat"
      subtitle={subtitle}
      body={body}
      footer={footer}
      switcher={switcher}
    />
  );
}
