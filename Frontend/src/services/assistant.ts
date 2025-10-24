import api from './api';

export type AssistantIntent = {
  query: string;
  category?: string | null;
  level?: string | null;
  freeOnly?: boolean | null;
};

export type AssistantResponse = {
  intent: AssistantIntent;
  result?: any;
};

export type ChatTurn = { role: 'user' | 'assistant'; text: string };

export async function askAssistant(text: string): Promise<AssistantResponse> {
  const res = await api.post('/api/assistant/query', { text });
  return res.data;
}

// Fast path: call AIService directly for recommendations (faster round trip)
const AI_BASE = (import.meta as any).env?.VITE_AI_BASE_URL || 'http://127.0.0.1:8081';

export async function askRecommend(text: string, limit = 5): Promise<{ data: Array<{ CourseId: number; Title: string; ShortDescription?: string }> }> {
  const url = `${AI_BASE}/health/recommend`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, limit })
  });
  if (!res.ok) throw new Error('AI recommend failed');
  return await res.json();
}

export async function chat(text: string, history: ChatTurn[] = []): Promise<{ text: string }> {
  const url = `${AI_BASE}/chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, history })
  });
  if (!res.ok) throw new Error('AI chat failed');
  return await res.json();
}


