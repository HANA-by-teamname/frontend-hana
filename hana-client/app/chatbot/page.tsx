'use client';

import { useState, useRef, useEffect } from 'react';

const recommendedQuestions = [
  '학교 근처 맛집 알려줘',
  '졸업 요건 뭐야?',
  '복수전공 신청 어떻게 해?',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '안녕하세요! 무엇이 궁금하신가요?' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `"${text}"에 대한 답변은 준비 중이에요.` },
      ]);
    }, 800);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="min-h-screen bg-[#F2F4FF] flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col justify-between px-4 pt-6 pb-24">
        <h1 className="text-xl font-bold mb-4">무엇이 궁금하신가요?</h1>

        {/* 메시지 리스트 */}
        <div className="space-y-3">
          {messages.map((msg, index) => {
            const isBot = msg.role === 'bot';
            const isFirstBotInSequence =
              isBot && (index === 0 || messages[index - 1].role !== 'bot');

            return (
              <div key={index} className="flex flex-col">
                {isFirstBotInSequence && (
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src="/images/puang.jpg"
                      alt="하나봇"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500 font-semibold">하나봇</span>
                  </div>
                )}
                <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                      isBot
                        ? 'bg-white text-gray-800 rounded-bl-none shadow'
                        : 'bg-sky-500 text-white rounded-br-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />

          {/* 추천 질문은 인삿말만 있을 때만 표시 */}
          {messages.length === 1 && (
            <div className="mt-4 space-y-2">
              {recommendedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-fit px-4 py-2 bg-white rounded-full shadow text-sm text-gray-900"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-[#F2F4FF] pb-4">
          <div className="w-full max-w-[390px] px-4">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="질문을 입력하세요"
                className="flex-1 py-2 px-4 rounded-full text-sm bg-white shadow outline-none"
              />
              <button onClick={() => sendMessage(input)} className="text-sm font-semibold text-sky-600">
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
