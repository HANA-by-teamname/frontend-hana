'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

interface SearchViewProps {
  query: string;
  setQuery: (val: string) => void;
  setIsSearching: (val: boolean) => void;
  sortType: '정확도순' | '최신순' | '인기순';
  setSortType: (value: '정확도순' | '최신순' | '인기순') => void;
  toggleLike: (id: string) => void;
  recommendedKeywords: string[];
  recent: string[];
  setRecent: (prev: string[]) => void;
  token: string;
  selectedFaculties: string[];
  setSelectedFaculties?: (list: string[]) => void; // ✅ 추가
  setPosts: (posts: Post[]) => void;
  posts: Post[];
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  fetchPostsFromAPI: (query: string, sort: '정확도순' | '최신순' | '인기순') => void;
}

export default function SearchView({
  query,
  setQuery,
  setIsSearching,
  sortType,
  setSortType,
  toggleLike,
  recommendedKeywords,
  recent,
  setRecent,
  token,
  selectedFaculties,
  setSelectedFaculties,
  setPosts,
  posts,
  isLoading,
  setIsLoading,
  fetchPostsFromAPI,
}: SearchViewProps) {
  const [allFaculties, setAllFaculties] = useState<string[]>([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      const res = await fetch('/api/faculties');
      const list = await res.json();
      setAllFaculties(list);
    };
    fetchFaculties();
  }, []);

  const updateUserFaculties = async (newList: string[]) => {
    try {
      await fetch('/users/update-faculty', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data_sources: newList }),
      });
    } catch (err) {
      console.error('❌ 필터 업데이트 실패:', err);
    }
  };

  const handleFacultyToggle = (faculty: string) => {
    const updated = selectedFaculties.includes(faculty)
      ? selectedFaculties.filter((f) => f !== faculty)
      : [...selectedFaculties, faculty];

    setSelectedFaculties?.(updated);
    updateUserFaculties(updated);
    fetchPostsFromAPI(query, sortType);
  };

  return (
    <div className="transition-all pt-4 px-4">
      {/* 🔙 뒤로가기 버튼 */}
      <button
        onClick={() => {
          setIsSearching(false);
          setQuery('');
        }}
        className="flex items-center gap-2 mb-4 text-sm text-gray-600"
      >
        <Image
          src="/icons/Arrow Left.svg"
          alt="뒤로가기"
          width={18}
          height={18}
        />
        <span>뒤로가기</span>
      </button>

      {/* ✅ 필터 선택 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allFaculties.map((fac) => {
          const selected = selectedFaculties.includes(fac);
          return (
            <button
              key={fac}
              onClick={() => handleFacultyToggle(fac)}
              className={`px-3 py-1 rounded-full border text-xs ${
                selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {fac}
            </button>
          );
        })}
      </div>

      {/* ✅ 정렬 및 결과 */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-gray-500">총 {posts.length}건</p>
        <select
          value={sortType}
          onChange={(e) => {
            setSortType(e.target.value as any);
            fetchPostsFromAPI(query, e.target.value as any);
          }}
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="정확도순">정확도순</option>
          <option value="최신순">최신순</option>
          <option value="인기순">인기순</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-gray-400">검색 중...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onToggleLike={toggleLike} showLink />
          ))}
        </div>
      )}
    </div>
  );
}
