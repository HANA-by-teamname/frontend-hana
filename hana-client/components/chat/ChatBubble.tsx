import Image from 'next/image';

export default function ChatBubble({
  role,
  content,
}: {
  role: 'user' | 'bot';
  content: string;
}) {
  const isBot = role === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex items-start gap-2">
          <Image
            src="/images/puang.jpg"
            alt="하나봇"
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 text-sm rounded-2xl rounded-bl-none shadow-sm max-w-[70%]">
            {content}
          </div>
        </div>
      )}
      {!isBot && (
        <div className="bg-sky-500 text-white px-4 py-2 text-sm rounded-2xl rounded-br-none shadow-sm max-w-[70%]">
          {content}
        </div>
      )}
    </div>
  );
}
