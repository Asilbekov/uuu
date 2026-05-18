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

  // Attempts
  getAttempts: () => apiFetch('/attempts'),
  createAttempt: (testId: string, totalQuestions?: number) => apiFetch('/attempts', { method: 'POST', body: JSON.stringify({ testId, totalQuestions }) }),
  updateAttempt: (id: string, data: any) => apiFetch(`/attempts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Explanations
  generateExplanations: (questionIds: string[]) =>
    apiFetch('/explain', { method: 'POST', body: JSON.stringify({ questionIds }) }),

  // AI Chat
  chat: (questionId: string, messages: { role: 'user' | 'assistant'; content: string }[], userAnswer?: string) =>
    apiFetch('/chat', { method: 'POST', body: JSON.stringify({ questionId, messages, userAnswer }) }),

  // Generate Cover Image
  generateCover: (testId: string) =>
    apiFetch('/generate-cover', { method: 'POST', body: JSON.stringify({ testId }) }),

};
