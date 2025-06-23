'use client';

import Image from 'next/image';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearchConfirm?: (value: string) => void;
  onFocus?: () => void;
}

export default function SearchBar({ query, setQuery, onSearchConfirm, onFocus }: SearchBarProps) {
  return (
    <div className="relative mb-4 py-4">
      <input
        type="text"
        placeholder="검색어를 입력하세요!"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && query.trim()) {
            onSearchConfirm?.(query.trim());
          }
        }}
        onBlur={() => {
          if (query.trim()) {
            onSearchConfirm?.(query.trim());
          }
        }}
        onFocus={onFocus}
        className="w-full px-5 py-3 pl-10 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
      />
      <Image
        src="/icons/Dotbogi.svg"
        alt="검색"
        width={16}
        height={16}
        className="absolute left-3 top-1/2 -translate-y-1/2"
      />
    </div>
  );
}
