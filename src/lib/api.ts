// API helper with auth
const API_BASE = '/api';

let currentUser: { id: string; email: string; name: string } | null = null;

export function setUser(user: { id: string; email: string; name: string } | null) {
  currentUser = user;
  if (user) {
    localStorage.setItem('chemtest_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('chemtest_user');
  }
}

export function getUser() {
  if (currentUser) return currentUser;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('chemtest_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
  }
  return null;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const user = getUser();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (user) {
    headers['x-user-id'] = user.id;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    // For rate limit responses, return the body so callers can handle it
    if (res.status === 429) {
      return { ...error, rateLimited: true };
    }
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data: { email: string; name: string; password: string }) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Tests
  getTests: (creatorId?: string) =>
    apiFetch(`/tests${creatorId ? `?creatorId=${creatorId}` : ''}`),
  getTest: (id: string) => apiFetch(`/tests/${id}`),
  createTest: (data: any) => apiFetch('/tests', { method: 'POST', body: JSON.stringify(data) }),
  updateTest: (id: string, data: any) => apiFetch(`/tests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTest: (id: string) => apiFetch(`/tests/${id}`, { method: 'DELETE' }),

  // Personalized feed (keyset-paginated, tag-affinity ranked)
  getFeed: (params: { tab?: string; cursor?: string | null; limit?: number; tag?: string | null; q?: string | null; creatorId?: string | null; scope?: 'all' | 'mine' | 'discover' }) => {
    const sp = new URLSearchParams();
    if (params.tab) sp.set('tab', params.tab);
    if (params.cursor) sp.set('cursor', params.cursor);
    if (params.limit) sp.set('limit', String(params.limit));
    if (params.tag) sp.set('tag', params.tag);
    if (params.q) sp.set('q', params.q);
    if (params.creatorId) sp.set('creatorId', params.creatorId);
    if (params.scope && params.scope !== 'all') sp.set('scope', params.scope);
    return apiFetch(`/feed?${sp.toString()}`);
  },
  // Engagement signal: the current feed card stayed on screen
  feedSignal: (testId: string, kind: 'view') =>
    apiFetch('/feed', { method: 'POST', body: JSON.stringify({ testId, kind }) }),

  // Sharing: make the user's own test public ("whole community" option)
  shareTest: (id: string, scope: 'link' | 'community') =>
    apiFetch(`/tests/${id}/share`, { method: 'POST', body: JSON.stringify({ scope }) }),

  // Personal-library bookmarks (the bookmark button lives on the cards in the
  // Discover mode; bookmarked tests appear in the user's library)
  getBookmarks: () => apiFetch('/bookmarks') as Promise<{ ids: string[] }>,
  addBookmark: (testId: string) =>
    apiFetch('/bookmarks', { method: 'POST', body: JSON.stringify({ testId }) }),
  removeBookmark: (testId: string) =>
    apiFetch(`/bookmarks?testId=${encodeURIComponent(testId)}`, { method: 'DELETE' }),

  // "Edit" on somebody else's test: copies it into the requester's library
  // (private, unique name) and returns the full copy to open in the editor
  copyTest: (id: string) =>
    apiFetch(`/tests/${id}/copy`, { method: 'POST' }),

  // Interests (onboarding + settings) — seeds the For You feed
  getInterests: () => apiFetch('/me/interests'),
  saveInterests: (interests: string[]) =>
    apiFetch('/me/interests', { method: 'PUT', body: JSON.stringify({ interests }) }),

  // Profile photo — raw fetch (FormData must not carry the JSON Content-Type);
  // the picture is stored IN THE TELEGRAM CHANNEL by /api/me/avatar
  uploadAvatar: async (file: Blob) => {
    const user = getUser();
    if (!user) throw new Error('Not authenticated');
    const fd = new FormData();
    fd.append('file', file, 'avatar.jpg');
    const res = await fetch(`${API_BASE}/me/avatar`, {
      method: 'POST',
      headers: { 'x-user-id': user.id },
      body: fd,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    return res.json();
  },

  // Popular tags across public tests (feed filter chips)
  getPopularTags: async (): Promise<{ tag: string; count: number }[]> => {
    const res = await apiFetch('/tags/popular');
    return Array.isArray(res?.tags) ? res.tags : [];
  },

  // Global tag dictionary (autocomplete in the test editor)
  getTags: async (): Promise<string[]> => {
    const res = await apiFetch('/tags');
    return Array.isArray(res?.tags) ? res.tags : [];
  },

  // Per-test group chat (user ↔ user, polled)
  getGroupMessages: (testId: string, after?: string) =>
    apiFetch(`/tests/${testId}/chat${after ? `?after=${encodeURIComponent(after)}` : ''}`),
  sendGroupMessage: (testId: string, text: string) =>
    apiFetch(`/tests/${testId}/chat`, { method: 'POST', body: JSON.stringify({ text }) }),

  // Attempts
  getAttempts: () => apiFetch('/attempts'),
  createAttempt: (testId: string, totalQuestions?: number) => apiFetch('/attempts', { method: 'POST', body: JSON.stringify({ testId, totalQuestions }) }),
  updateAttempt: (id: string, data: any) => apiFetch(`/attempts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Explanations
  generateExplanations: (questionIds: string[], lang?: string) =>
    apiFetch('/explain', { method: 'POST', body: JSON.stringify({ questionIds, lang }) }),

  // AI Chat
  // questionContext carries the question EXACTLY as displayed to the student
  // (options may have been shuffled client-side, so DB labels are not enough)
  chat: (
    questionId: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    userAnswer?: string,
    questionContext?: { text: string; options: Record<string, string>; correctAnswer: string; topic: string }
  ) =>
    apiFetch('/chat', { method: 'POST', body: JSON.stringify({ questionId, messages, userAnswer, questionContext }) }),

  // Attachments (files attached to a test)
  getAttachments: (testId: string) => apiFetch(`/tests/${testId}/attachments`),
  addAttachment: (testId: string, data: { title: string; type: string; url: string; size?: number | null }) =>
    apiFetch(`/tests/${testId}/attachments`, { method: 'POST', body: JSON.stringify(data) }),
  updateAttachment: (id: string, data: { title?: string; type?: string; url?: string; orderNum?: number }) =>
    apiFetch(`/attachments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAttachment: (id: string) => apiFetch(`/attachments/${id}`, { method: 'DELETE' }),

  // Persist on-the-fly question translations (machine-translated in the browser)
  saveTranslations: (testId: string, lang: string, items: { id: string; text?: string; options?: Record<string, string>; explanation?: string }[]) =>
    apiFetch(`/tests/${testId}/translations`, { method: 'POST', body: JSON.stringify({ lang, items }) }),
};
