'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearchConfirm?: (value: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  recommendedKeywords?: string[];
  recent?: string[];
  setRecent?: (keywords: string[]) => void;
}

export default function SearchBar({
  query,
  setQuery,
  onSearchConfirm,
  onFocus,
  onClear,
  recommendedKeywords = [],
  recent = [],
  setRecent,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (keyword: string) => {
    setQuery(keyword);
    onSearchConfirm?.(keyword);
    setShowDropdown(false);
    if (keyword && !recent.includes(keyword)) {
      setRecent?.([keyword, ...recent.slice(0, 4)]);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleDeleteRecent = (keyword: string) => {
    setRecent?.(recent.filter((k) => k !== keyword));
  };

  return (
    <div className="relative mb-4">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="소프트웨어학부 졸업사정, 검색해보세요!"
        onChange={(e) => {
          const v = e.target.value;
          const transformed = v.charAt(0).toUpperCase() + v.slice(1);
          setQuery(transformed);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && query.trim()) {
            handleSubmit(query.trim());
          }
        }}
        onFocus={() => {
          setShowDropdown(true);
          onFocus?.();
        }}
        className="w-full px-5 py-3 pl-10 pr-10 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
      />
      {/* ✅ Search icon */}
      <Image
        src="/icons/Search.svg"
        alt="검색"
        width={16}
        height={16}
        className="absolute left-3 top-1/2 -translate-y-1/2"
      />

      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <Image src="/icons/Delete.svg" alt="Clear" width={16} height={16} />
        </button>
      )}

      {showDropdown && query === '' && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-10 p-4 space-y-3 text-sm">
          {recommendedKeywords.length > 0 && (
            <div>
              <p className="text-gray-600 font-semibold mb-1">추천 검색어</p>
              <div className="flex flex-wrap gap-2">
                {recommendedKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleSubmit(kw)}
                    className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
          {recent.length > 0 && (
            <div>
              <p className="text-gray-600 font-semibold mb-1">최근 검색어</p>
              <ul className="space-y-1">
                {recent.map((kw) => (
                  <li key={kw} className="flex justify-between items-center">
                    <button
                      onClick={() => handleSubmit(kw)}
                      className="text-gray-700 hover:underline truncate max-w-[80%] text-left"
                    >
                      {kw}
                    </button>
                    <button onClick={() => handleDeleteRecent(kw)}>
                      <Image src="/icons/Close.svg" alt="삭제" width={12} height={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
