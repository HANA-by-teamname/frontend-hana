'use client';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearchConfirm?: (value: string) => void;
}

export default function SearchBar({ query, setQuery, onSearchConfirm }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="어떤 정보가 궁금하신가요?"
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
        className="w-full px-5 py-3 pl-10 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
    </div>
  );
}
