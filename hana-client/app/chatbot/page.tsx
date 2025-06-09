'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInput from '@/components/chat/ChatInput';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatSuggestions from '@/components/chat/ChatSuggestion';
import FooterNav from '@/components/FooterNav';
import ChatHeader from '@/components/headers/ChatHeader';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal';
import { authFetch } from '@/lib/api/authFetch';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await authFetch('/users/me');
        if (!res.ok) throw new Error('세션 없음');
      } catch (err) {
        console.error('❌ 인증 실패:', err);
        setShowSessionExpired(true);
      }
    };
    checkToken();
    setMessages([{ role: 'bot', content: '반가워요!' }]);
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const botReply: Message = {
      role: 'bot',
      content: `"${trimmed}"에 대한 답변은 준비 중이에요.`,
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    sendMessage(trimmed);
  };

  const handleSuggestion = (text: string) => {
    setInput('');
    sendMessage(text);
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
