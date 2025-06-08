'use client';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim().length >= 2) onSend();
  };

  const isSendable = value.trim().length >= 2;

  return (
    <div className="max-w-md w-full mx-auto flex items-center bg-white rounded-full border border-gray-300 px-5 py-3 shadow-md"><input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="질문을 입력하세요"
        className="flex-1 bg-transparent outline-none text-base placeholder-gray-400"
      />
      <button
        onClick={onSend}
        className="text-base font-semibold text-sky-600 hover:text-sky-700 ml-2 disabled:opacity-30"
        disabled={!isSendable}
      >
        전송
      </button>
    </div>
  );
}
