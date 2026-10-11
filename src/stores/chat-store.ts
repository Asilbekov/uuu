import { makeStore } from '@/stores/make-store';
import type { Question, GroupMessage } from '@/lib/app-types';

// ---------------------------------------------------------------------------
// CHAT store — the per-test AI tutor conversation (threads persisted per user
// in localStorage) and the per-test group chat panel. Previously ~15 loose
// useState hooks inside app-root.tsx.
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatThread {
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

interface ChatData {
  // AI tutor sheet
  chatMessages: ChatMessage[];
  chatInput: string;
  chatLoading: boolean;
  // The question the chat was opened on ('' = free-form tutor chat)
  chatQuestionId: string;
  chatUserAnswer: string;
  chatQuestionObj: Question | null;
  // test id whose thread is in chatMessages
  chatThreadId: string;
  chatThreads: Record<string, ChatThread>;
  // AI tutor sheet
  groupMessages: GroupMessage[];
  groupInput: string;
  groupSending: boolean;
}

const INITIAL: ChatData = {
  chatMessages: [],
  chatInput: '',
  chatLoading: false,
  chatQuestionId: '',
  chatUserAnswer: '',
  chatQuestionObj: null,
  chatThreadId: '',
  chatThreads: {},
  groupMessages: [],
  groupInput: '',
  groupSending: false,
};

export const useChatStore = makeStore(INITIAL);

// Fresh, hook-free read for the async send flows
export const chatNow = () => useChatStore.getState();

/** Close the AI tutor sheet and drop the visible conversation (scope switch). */
export function clearAiChat() {
  useChatStore.setState({
    chatMessages: [],
    chatQuestionId: '',
    chatQuestionObj: null,
    chatThreadId: '',
  });
}
