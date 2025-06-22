'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatBubble from '@/components/chat/ChatBubble';
import { authFetch } from '@/lib/api/authFetch';

interface ChatLog {
  message: string;
  answer: string;
  createdAt: string;
}

export default function ChatHistoryDetailPage() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const chatid = parseInt(params.chatid as string);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await authFetch('/chatbot/history');
        const data = await res.json();
        if (!data.success) throw new Error('이력 조회 실패');

        const allLogs: ChatLog[] = data.history;
        const grouped = splitIntoSessions(allLogs);
        setLogs(grouped[chatid] || []);
      } catch (err) {
        console.error('❌ 기록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [chatid]);

  const splitIntoSessions = (messages: ChatLog[], gapMinutes = 30) => {
    const sessions: ChatLog[][] = [];
    let current: ChatLog[] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const prev = messages[i - 1];
      if (
        i === 0 ||
        new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() <
          gapMinutes * 60 * 1000
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

  return (
    <main className="min-h-screen bg-[#F9FAFB] font-pretendard pb-20 px-4 pt-6 max-w-md mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-500 mb-4 hover:underline"
      >
        ← 뒤로가기
      </button>

      <h2 className="text-lg font-semibold mb-4">이전 채팅 보기</h2>

      {loading ? (
        <p>불러오는 중...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">기록이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={index} className="space-y-2">
              <ChatBubble role="user" content={log.message} />
              <ChatBubble role="bot" content={log.answer} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
