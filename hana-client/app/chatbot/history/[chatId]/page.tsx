'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authFetch } from '@/lib/api/authFetch';

interface ChatEntry {
  message: string;
  answer: string;
  createdAt: string;
}

export default function ChatHistoryPage() {
  const params = useParams();
  const chatId = Number(params.chatId);

  const [entry, setEntry] = useState<ChatEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authFetch('/chatbot/history');
        const data = await res.json();
        if (!data.success || !Array.isArray(data.history)) throw new Error('불러오기 실패');

        if (chatId < 0 || chatId >= data.history.length) {
          setEntry(null); // 범위 벗어난 경우
        } else {
          setEntry(data.history[chatId]);
        }
      } catch (err) {
        console.error('❌ 대화 이력 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [chatId]);

  if (loading) return <p className="p-4">로딩 중...</p>;
  if (!entry) return <p className="p-4 text-gray-500">해당 대화 내역이 없습니다.</p>;

  return (
    <div className="p-4 space-y-3 font-pretendard">
      <p className="text-gray-500 text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
      <div className="p-3 bg-gray-100 rounded-md">
        <strong>나:</strong> {entry.message}
      </div>
      <div className="p-3 bg-blue-100 rounded-md">
        <strong>챗봇:</strong> {entry.answer}
      </div>
    </div>
  );
}
