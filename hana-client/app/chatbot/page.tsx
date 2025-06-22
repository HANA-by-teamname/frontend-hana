'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInput from '@/components/chat/ChatInput';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatSuggestions from '@/components/chat/ChatSuggestion';
import FooterNav from '@/components/FooterNav';
import ChatHeader from '@/components/headers/ChatHeader';
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
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

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
    <main className="min-h-screen bg-[#F9FAFB] font-pretendard pb-24">
      <div className="w-full max-w-md mx-auto px-4 pt-6 space-y-4">
        <ChatHeader />
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <ChatBubble role="bot" content="답변을 생성 중이에요..." />
          )}
          <div ref={bottomRef} />
        </div>
        {messages.length === 1 && (
          <div className="mt-2">
            <ChatSuggestions onSelect={handleSuggestion} />
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full px-4">
        <div className="max-w-md mx-auto w-full">
          <ChatInput value={input} onChange={setInput} onSend={handleSend} />
        </div>
      </div>

      <div className="fixed bottom-0 w-full">
        <FooterNav />
      </div>

      <SessionExpiredModal
        visible={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />
    </main>
  );
}
