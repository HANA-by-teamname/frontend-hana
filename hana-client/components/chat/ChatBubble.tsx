'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ChatBubbleProps {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isBot = role === 'bot';
  const [displayedText, setDisplayedText] = useState(isBot ? '' : content);

  useEffect(() => {
    if (!isBot || !content || typeof content !== 'string') return;

    setDisplayedText('');
    let i = 0;

    const interval = setInterval(() => {
      if (i < content.length) {
        setDisplayedText((prev) => prev + content.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [content, isBot]);

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} px-2`}>
      {isBot ? (
        <div className="flex items-start gap-2 max-w-[80%]">
          <Image
            src="/images/puang.jpg"
            alt="하나봇"
            width={28}
            height={28}
            className="rounded-full object-cover mt-1"
          />
          <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 text-sm rounded-2xl rounded-bl-none shadow-sm whitespace-pre-wrap break-words">
            {displayedText}
          </div>
        </div>
      ) : (
        <div className="bg-sky-500 text-white px-4 py-2 text-sm rounded-2xl rounded-br-none shadow-sm max-w-[80%] whitespace-pre-wrap break-words">
          {content}
        </div>
      )}
    </div>
  );
}
