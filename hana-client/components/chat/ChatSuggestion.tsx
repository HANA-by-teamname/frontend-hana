'use client';

interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  '장학금 신청은 어떻게 하나요?',
  '졸업 요건이 궁금해요.',
  '교양 필수 과목 알려줘.',
  '수강 정정 기간은 언제인가요?',
];

export default function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-2">
      <h4 className="text-sm font-semibold mb-2 text-gray-700">추천 질문</h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((text, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(text)}
            className="border border-sky-300 text-sky-600 bg-white px-3 py-1 rounded-full text-xs shadow-sm hover:bg-sky-50"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
