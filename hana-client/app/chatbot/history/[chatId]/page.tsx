'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authFetch } from '@/lib/api/authFetch';
import ChatBubble from '@/components/chat/ChatBubble';
import { ArrowLeftCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  createdAt?: string;
}

export default function ChatHistoryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { chatId } = useParams();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authFetch('/chatbot/history');
        const data = await res.json();
        if (!data.success) throw new Error('이력 조회 실패');

        const all = data.history;
        const sessions = splitIntoSessions(all);
        const sessionIndex = parseInt(chatId as string);
        if (isNaN(sessionIndex) || sessionIndex < 0 || sessionIndex >= sessions.length) {
          throw new Error('유효하지 않은 세션 인덱스');
        }
        const session = sessions[sessionIndex];

        const formatted: Message[] = session.flatMap((h: any) => [
          { role: 'user', content: h.message, createdAt: h.createdAt },
          { role: 'bot', content: h.answer, createdAt: h.createdAt },
        ]);

        setMessages(formatted);
      } catch (err) {
        console.error('❌ 채팅 세션 로딩 실패:', err);
        router.push('/chat');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [chatId]);

  const splitIntoSessions = (messages: any[], gapMinutes = 30) => {
    const sessions: any[][] = [];
    let current: any[] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const prev = messages[i - 1];
      if (
        i === 0 ||
        new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < gapMinutes * 60 * 1000
      ) {
        current.push(msg);
      } else {
        sessions.push(current);
        current = [msg];
      }
    }
    if (current.length > 0) sessions.push(current);
    return sessions;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <main className="min-h-screen bg-[#EEF0F3] font-pretendard pb-20">
      <div className="w-full max-w-md mx-auto px-4 pt-6 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <ArrowLeftCircle
            onClick={() => router.push('/chat')}
            className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800"
          />
          <h2 className="text-lg font-semibold text-gray-800">이전 대화 보기</h2>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </main>
  );
}
