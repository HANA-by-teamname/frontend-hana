// lib/api/chatbot.ts
import { authFetch } from './authFetch';

export async function sendChatbotMessage(message: string): Promise<string> {
  const res = await authFetch('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || '챗봇 응답 실패');
  return data.answer;
}

export async function fetchChatHistory() {
  const res = await authFetch('/chatbot/history');
  const data = await res.json();
  if (!data.success) throw new Error('대화 이력 조회 실패');
  return data.history; // [{ message, answer, createdAt }]
}
