'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/api/authFetch';

interface ChatLog {
  message: string;
  answer: string;
  createdAt: string;
}

interface ChatHistoryModalProps {
  onClose: () => void;
}

export default function ChatHistoryModal({ onClose }: ChatHistoryModalProps) {
  const [sessions, setSessions] = useState<ChatLog[][]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authFetch('/chatbot/history');
        const data = await res.json();
        if (!data.success) throw new Error('이력 조회 실패');

        const messages: ChatLog[] = data.history;
        const grouped = splitIntoSessions(messages);
        setSessions(grouped);
      } catch (err) {
        console.error('❌ 이력 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const splitIntoSessions = (messages: ChatLog[], gapMinutes = 30) => {
    const sessions: ChatLog[][] = [];
    let current: ChatLog[] = [];
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

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4">이전 채팅 목록</h3>
        {loading ? (
          <p>불러오는 중...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">저장된 대화가 없습니다.</p>
        ) : (
          sessions.map((session, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 mb-3 bg-[#F4F6F8] hover:bg-[#e4e6e8] cursor-pointer"
              onClick={() => router.push(`/chat/history/${idx}`)}
            >
              <p className="text-xs text-gray-500">
                {new Date(session[0].createdAt).toLocaleString()}
              </p>
              <p className="font-medium text-gray-800 truncate">
                {session[0].message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
