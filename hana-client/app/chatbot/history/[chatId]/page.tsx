'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatBubble from '@/components/chat/ChatBubble';
import { ChevronLeft } from 'lucide-react';

interface ChatEntry {
  message: string;
  answer: string;
  createdAt: string;
}

export default function ChatHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
  const chatId = rawId ? parseInt(rawId, 10) : -1;

  const [session, setSession] = useState<ChatEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId < 0) return;

    const raw = localStorage.getItem(`chatSession-${chatId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSession(parsed);
        }
      } catch (err) {
        console.error('❌ 세션 파싱 실패:', err);
      }
    }
    setLoading(false);
  }, [chatId]);

  if (loading) return <p className="p-4">로딩 중...</p>;
  if (!session) return <p className="p-4 text-gray-500">해당 대화 내역을 찾을 수 없습니다.</p>;

  return (
    <div className="p-4 space-y-4 font-pretendard max-w-md mx-auto min-h-screen bg-[#F9FAFB]">
      <div className="flex items-center space-x-2">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">이전 대화</h1>
      </div>

      {session.map((entry, i) => (
        <div key={i}>
          <ChatBubble role="user" content={entry.message} />
          <ChatBubble role="bot" content={entry.answer} />
        </div>
      ))}
    </div>
  );
}
