'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchHeader from '@/components/headers/SearchHeader';
import FooterNav from '@/components/FooterNav';
import DefaultFeed from './DefaultFeed';
import SearchView from './SearchView';
import { getFaculties } from '@/lib/api/getfaculty';
import { USER_ME_ENDPOINT } from '@/lib/constants';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal';
import { addFavorite, deleteFavorite } from '@/lib/api/favorite';

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
  const [allFaculties, setAllFaculties] = useState<string[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const facultyList = await getFaculties();
        setAllFaculties(facultyList);

        const resUser = await fetch(USER_ME_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resUser.status === 401 || resUser.status === 403) {
          setShowSessionExpired(true);
          return;
        }

        const userData = await resUser.json();
        setSelectedFaculties(userData.data_sources || []);
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
        setShowSessionExpired(true);
      }
    };

    fetchInitialData();
  }, []);

  const fetchPostsFromAPI = async (keyword: string, sort: '정확도순' | '최신순' | '인기순') => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:4000/feeds/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keyword, faculty: selectedFaculties, sort }),
      });

      if (res.status === 401 || res.status === 403) {
        setShowSessionExpired(true);
        return;
      }

      const data = await res.json();
      const result = data.feeds || data.result || [];
      setPosts(
        result.map((item: any) => ({
          id: item.feed_id || item._id,
          title: item.title,
          category: item.faculty,
          date: item.date?.slice(0, 10) || '',
          liked: item.favorite || false,
          url: item.link || item.url,
        }))
      );
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const targetPost = posts.find((post) => post.id === id);
    if (!token || !targetPost) return;

    // 1. 프론트 상태 먼저 바꿈 (optimistic UI)
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, liked: !post.liked } : post))
    );

    // 2. 서버에 좋아요 상태 저장
    try {
      if (targetPost.liked) {
        await deleteFavorite(id, token); // 기존에 true → 해제
      } else {
        await addFavorite(id, token); // 기존에 false → 추가
      }
    } catch (err) {
      console.error('좋아요 API 호출 실패:', err);
      // 3. 실패 시 프론트 상태 되돌리기
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, liked: targetPost.liked } : post))
      );
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 font-pretendard pb-24 px-4 pt-6 w-full max-w-md mx-auto">
        <SearchHeader />

        <div className="mt-2">
          <SearchBar
            query={query}
            setQuery={(value) => {
              setQuery(value);
              if (!isSearching && value.trim() !== '') setIsSearching(true);
            }}
            onSearchConfirm={(value) => {
              if (value && !recent.includes(value)) {
                setRecent((prev) => [value, ...prev.slice(0, 4)]);
              }
              fetchPostsFromAPI(value, sortType);
            }}
            onFocus={() => setIsSearching(true)}
            onClear={() => setIsSearching(false)}
            recommendedKeywords={recommendedKeywords}
            recent={recent}
            setRecent={setRecent}
          />
        </div>

        <div className="mt-2">
          {isSearching ? (
            <SearchView
              query={query}
              setQuery={setQuery}
              setIsSearching={setIsSearching}
              sortType={sortType}
              setSortType={setSortType}
              toggleLike={toggleLike}
              recommendedKeywords={recommendedKeywords}
              recent={recent}
              setRecent={setRecent}
              token={token}
              selectedFaculties={selectedFaculties}
              setPosts={setPosts}
              posts={posts}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fetchPostsFromAPI={fetchPostsFromAPI}
            />
          ) : (
            <DefaultFeed toggleLike={toggleLike} posts={posts} setPosts={setPosts} />
          )}
        </div>
      </main>

      {/* ✅ 검색 중이 아닐 때만 FooterNav 표시 */}
      {!isSearching && <FooterNav />}

      <SessionExpiredModal
        visible={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />
    </>
  );
}
