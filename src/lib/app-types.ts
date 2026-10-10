/**
 * Shared app-wide domain types — moved out of src/app/page.tsx so the
 * extracted page-view components (src/components/pages/*) can import them
 * without circular imports. Runtime-free (types only).
 */

export type Page = 'auth' | 'dashboard' | 'create-test' | 'edit-test' | 'start-test' | 'take-test' | 'history' | 'profile';

export interface Question {
  id?: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string | null;
  correctAnswer: string;
  explanation?: string | null;
  translations?: Record<string, { text?: string; options?: Record<string, string>; explanation?: string }> | null;
  // Question photo — lives in the Telegram channel as tg:<file_id> (or a small
  // data: URL when the bot is not connected); imageMsgId tracks the channel post
  imageUrl?: string | null;
  imageMsgId?: number | null;
  // Per-option photos: { A: { u: 'tg:...', m: 123 }, C: {...} }
  optionImages?: Record<string, { u: string; m?: number | null }> | null;
  orderNum?: number;
}

export interface Attachment {
  id: string;
  testId: string;
  title: string;
  type: 'audio' | 'video' | 'pdf' | 'image' | 'embed' | 'link';
  url: string;
  size?: number | null;
  orderNum: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  topic: string;
  creatorId: string;
  creator?: { id: string; name: string };
  isPublic: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  tags?: string[];
  coverIcon?: string | null;
  coverColor?: string | null;
  hasCoverImage?: boolean;
  questions: Question[];
  attachments?: Attachment[];
  _count?: { questions: number; attempts: number; attachments?: number };
  createdAt: string;
}

// Per-test group chat message (see /api/tests/[id]/chat)
export interface GroupMessage {
  id: string;
  testId: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  text: string;
  createdAt: string;
}

export interface Attempt {
  id: string;
  testId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  test?: { id: string; title: string; topic: string };
}
