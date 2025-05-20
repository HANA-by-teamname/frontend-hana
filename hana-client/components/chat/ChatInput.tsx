'use client';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSend();
  };

  return (
    <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="질문을 입력하세요"
        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
      />
      <button
        onClick={onSend}
        className="text-sm font-semibold text-sky-600 hover:text-sky-700 ml-2"
      >
        전송
      </button>
    </div>
  );
}