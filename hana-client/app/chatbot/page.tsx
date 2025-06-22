'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInput from '@/components/chat/ChatInput';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatSuggestions from '@/components/chat/ChatSuggestion';
import FooterNav from '@/components/FooterNav';
import ChatHeader from '@/components/headers/ChatHeader';
import ChatHistoryModal from '@/components/modals/ChatHistoryModal';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal';
import { sendChatbotMessage, fetchChatHistory } from '@/lib/api/chatbot';

interface Message {
  role: 'user' | 'bot';
  content: string;
  createdAt?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const init = async () => {
      try {
        const history = await fetchChatHistory();
        const formatted = history.flatMap((h: any) => [
          { role: 'user', content: h.message, createdAt: h.createdAt },
          { role: 'bot', content: h.answer, createdAt: h.createdAt },
        ]);
        setMessages([{ role: 'bot', content: '반가워요!' }, ...formatted]);
      } catch (err) {
        console.error('❌ 인증 실패:', err);
        setShowSessionExpired(true);
        setMessages([{ role: 'bot', content: '반가워요!' }]);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= 10 * 60 * 1000) {
        setMessages([
          {
            role: 'bot',
            content: '⏰ 10분 이상 대화가 없어 자동 종료되었어요. 히스토리에서 다시 확인해 보세요!',
          },
        ]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    lastActivityRef.current = Date.now();
    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatbotMessage(trimmed);
      const botMessage: Message = { role: 'bot', content: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('❌ 챗봇 응답 실패:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '⚠️ 답변을 불러오지 못했습니다.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = async (text: string) => {
    lastActivityRef.current = Date.now();
    setInput('');
    setLoading(true);
    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendChatbotMessage(text);
      const botMessage: Message = { role: 'bot', content: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '⚠️ 답변을 불러오지 못했습니다.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] font-pretendard pb-[120px]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB] max-w-md mx-auto px-4 pt-4">
        <ChatHeader onHistoryClick={() => setShowHistoryModal(true)} />
      </div>

      {/* Content */}
      <div className="w-full max-w-md mx-auto px-4 pt-2 space-y-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && <ChatBubble role="bot" content="답변을 생성 중이에요..." />}
          <div ref={bottomRef} />
        </div>

        {/* 종료 안내 버튼 */}
        {messages.length === 1 &&
          messages[0].content.includes('자동 종료') && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                대화 이력 보기
              </button>
            </div>
          )}

        {/* 추천 질문 */}
        {messages.length === 1 && !loading && (
          <div className="mt-2">
            <ChatSuggestions onSelect={handleSuggestion} />
          </div>
        )}
      </div>

      {/* 입력창 - safe area 반영 */}
      {!(messages.length === 1 && messages[0].content.includes('자동 종료')) && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] left-1/2 -translate-x-1/2 w-full px-4 z-20">
          <div className="max-w-md mx-auto w-full">
            <ChatInput value={input} onChange={setInput} onSend={handleSend} />
          </div>
        </div>
      )}

      {/* Footer Nav */}
      <div className="fixed bottom-0 w-full z-10">
        <FooterNav />
      </div>

      {/* 모달 */}
      <SessionExpiredModal
        visible={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />
      {showHistoryModal && (
        <ChatHistoryModal onClose={() => setShowHistoryModal(false)} />
      )}
    </main>
  );
}
