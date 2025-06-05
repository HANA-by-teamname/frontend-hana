'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import SearchBar from './SearchBar';
import SearchHeader from '@/components/headers/SearchHeader';
import FooterNav from '@/components/FooterNav';

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

const recommendedKeywords = ['최소학점', '복수전공', '김영빈 교수님', '소프트웨어 전공', '중앙사랑 장학금'];

export default function Page() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortType, setSortType] = useState<'정확도순' | '최신순' | '인기순'>('최신순');
  const [recent, setRecent] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = ''; // TODO: 실제 로그인 토큰 적용

  const fetchPostsFromAPI = async (keyword: string, sort: '정확도순' | '최신순' | '인기순') => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:4000/feeds/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          keyword,
          faculty: ['중앙대학교 NOTICE', '소프트웨어학부'],
          sort,
        }),
      });

      if (!res.ok) throw new Error('검색 실패');

      const data = await res.json();
      const result = data.feeds || data.result || [];

      const posts: Post[] = result.map((item: any) => ({
        id: item._id,
        title: item.title,
        category: item.faculty,
        date: item.date?.slice(0, 10) || '',
        liked: false,
        url: item.url,
      }));

      setPosts(posts);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, liked: !post.liked } : post))
    );
  };

  const handleSearchConfirm = (value: string) => {
    if (value && !recent.includes(value)) {
      setRecent((prev) => [value, ...prev.slice(0, 4)]);
    }
    setQuery(value);
    fetchPostsFromAPI(value, sortType);
  };

  useEffect(() => {
    if (query !== '') {
      fetchPostsFromAPI(query, sortType);
    }
  }, [sortType]);

  return (
    <>
      <main className="min-h-screen bg-gray-50 font-pretendard pb-24">
        {/* ✅ 평상시 화면 */}
        {!isSearching && (
          <>
            <SearchHeader />
            <div className="w-full max-w-md mx-auto px-4 pt-6">
              <h2 className="text-base font-semibold text-gray-900">검색 기능입니다.</h2>
              <p className="text-sm text-gray-400 mb-4">궁금한 정보를 빠르게 찾아보세요.</p>

              <div onClick={() => setIsSearching(true)}>
                <SearchBar query={query} setQuery={setQuery} onSearchConfirm={handleSearchConfirm} />
              </div>

              <div className="mt-6 text-center text-sm text-gray-400">
                궁금해할만한 게시글이 없어요.
              </div>
            </div>
          </>
        )}

        {/* ✅ 검색 오버레이 화면 */}
        {isSearching && (
          <div className="fixed inset-0 z-50 bg-white px-4 pt-6 pb-24 overflow-y-auto">
            <div className="max-w-md mx-auto">
              <button
                onClick={() => setIsSearching(false)}
                className="text-sm text-gray-500 hover:text-black flex items-center mb-4"
              >
                <span className="mr-1">←</span> 뒤로가기
              </button>

              <SearchBar query={query} setQuery={setQuery} onSearchConfirm={handleSearchConfirm} />

              {query === '' ? (
                <>
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2">추천 검색어</h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendedKeywords.map((word) => (
                        <button
                          key={word}
                          onClick={() => handleSearchConfirm(word)}
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
                            <span className="text-gray-800 text-sm">{item}</span>
                            <button
                              onClick={() => setRecent((prev) => prev.filter((q) => q !== item))}
                              className="text-gray-400 hover:text-red-400 text-sm"
                            >
                              삭제
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
              ) : (
                <>
                  <div className="flex justify-between items-center mt-4 mb-2">
                    <p className="text-xs text-gray-500">총 {posts.length}건</p>
                    <select
                      value={sortType}
                      onChange={(e) =>
                        setSortType(e.target.value as '정확도순' | '최신순' | '인기순')
                      }
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
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {!isSearching && <FooterNav />}
    </>
  );
}
