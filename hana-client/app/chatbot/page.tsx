'use client';

import { useState, useRef, useEffect } from 'react';
import ChatInput from '@/components/chat/ChatInput';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatSuggestions from '@/components/chat/ChatSuggestion';
import FooterNav from '@/components/FooterNav';
import ChatHeader from '@/components/headers/ChatHeader';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: '안녕하세요! 무엇이 궁금하신가요?' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const botReply: Message = {
      role: 'bot',
      content: `"${input}"에 대한 답변은 준비 중이에요.`,
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput('');
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="min-h-screen bg-white font-pretendard flex justify-center px-4 pb-36">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md flex flex-col h-screen relative">
        {/* Header - 항상 상단에 */}
        <div className="px-4 pt-6 pb-2">
          <ChatHeader />
        </div>

        {/* 메시지 영역 (스크롤 지원) */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          <div ref={bottomRef} />
          {messages.length === 1 && (
            <div className="mt-2">
              <ChatSuggestions onSelect={handleSuggestion} />
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <ChatInput value={input} onChange={setInput} onSend={handleSend} />
        </div>

        {/* FooterNav */}
        <div className="absolute bottom-0 w-full">
          <FooterNav />
        </div>
      </div>
    </main>
  );
}
