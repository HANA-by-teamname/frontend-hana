'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import SearchBar from './SearchBar';

interface Post {
  id: number;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

const recommendedKeywords = ['최소학점', '복수전공', '김영빈 교수님', '소프트웨어 전공', '중앙사랑 장학금'];

const dummyPosts: Post[] = [
  {
    id: 1,
    title: '2025년 하반기 ICT 인턴십 모집',
    category: '소프트웨어학부',
    date: '2025.03.18',
    liked: false,
    url: 'https://example.com/post1',
  },
  {
    id: 2,
    title: '2025 AI연구소 채용',
    category: 'AI학부',
    date: '2025.03.21',
    liked: false,
    url: 'https://example.com/post2',
  },
];

export default function Page() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [sortType, setSortType] = useState<'정확도순' | '최신순'>('최신순');
  const [recent, setRecent] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, liked: !post.liked } : post))
    );
  };

  useEffect(() => {
    if (query && !recent.includes(query)) {
      setRecent((prev) => [query, ...prev.slice(0, 4)]);
    }
  }, [query]);

  const filteredPosts = query
    ? posts
        .filter((post) => post.title.includes(query))
        .sort((a, b) => (sortType === '최신순' ? b.date.localeCompare(a.date) : 0))
    : posts.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="min-h-screen bg-[#F2F4FF] font-pretendard pb-24">
      <div className="w-[390px] mx-auto px-6 pt-6">
        <h1 className="text-xl font-bold mb-4">중앙대 통합 검색</h1>

        <div onClick={() => setIsSearching(true)}>
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        {/* 1. 기본 피드만 보이는 경우 */}
        {!isSearching && query === '' && (
          <div className="space-y-4 mt-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={toggleLike}
                showLink={true}
              />
            ))}
          </div>
        )}

        {/* 2. 검색창 누른 직후 (입력 없음) → 추천/최근 검색어 */}
        {isSearching && query === '' && (
          <>
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">추천 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {recommendedKeywords.map((word) => (
                  <button
                    key={word}
                    onClick={() => setQuery(word)}
                    className="bg-white px-3 py-1 rounded-full shadow text-xs text-gray-700"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3">최근 검색항목</h3>
              {recent.length > 0 ? (
                <div className="space-y-3">
                  {recent.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white rounded-xl shadow px-4 py-3 text-sm"
                    >
                      <span className="flex items-center gap-2">🔍<span>{item}</span></span>
                      <button
                        onClick={() => setRecent((prev) => prev.filter((q) => q !== item))}
                        className="text-gray-400 hover:text-red-400"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center pt-10">
                  <p className="text-base font-semibold mb-1">아직 찾으신 내용이 없네요.</p>
                  <p className="text-xs text-gray-400">어떤 내용이 궁금하신가요?</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* 3. 검색어 입력됨 → 결과 + 정렬 */}
        {query !== '' && (
          <>
            <div className="flex justify-between items-center mt-4 mb-2">
              <p className="text-xs text-gray-500">총 {filteredPosts.length}건</p>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as '정확도순' | '최신순')}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
              >
                <option value="정확도순">정확도순</option>
                <option value="최신순">최신순</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={toggleLike}
                  showLink={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
