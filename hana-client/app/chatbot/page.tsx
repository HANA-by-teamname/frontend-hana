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
    { role: 'bot', content: '반가워요!' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user' && lastMessage.content === trimmed) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const isPrepared = true; // ✅ 답변 준비 상태

    if (isPrepared) {
      const botReply: Message = {
        role: 'bot',
        content: `"${trimmed}"에 대한 답변은 준비됐어요!`, // ✅ 절대 undefined 없음
      };
      setMessages((prev) => [...prev, userMessage, botReply]);
    } else {
      setMessages((prev) => [...prev, userMessage]);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');           // ✅ 2. 먼저 입력창 초기화
    sendMessage(trimmed);   // ✅ 2. 그 다음 메시지 처리
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
        <div className="space-y-2">
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
    </main>
  );
}
