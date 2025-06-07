'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { getFaculties } from '@/lib/api/getfaculty';
import { USER_ME_ENDPOINT, SEARCH_FEED_ENDPOINT } from '@/lib/constants';

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

interface DefaultFeedProps {
  toggleLike: (id: string) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export default function DefaultFeed({ toggleLike, posts, setPosts }: DefaultFeedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [allFaculties, setAllFaculties] = useState<string[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
  const fetchInitial = async () => {
    if (!token) {
      alert('다시 로그인해주세요!');
      window.location.href = '/login';
      return;
    }

    try {
      const facultyList = await getFaculties();
      setAllFaculties(facultyList);

      const resUser = await fetch(USER_ME_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resUser.status === 403 || resUser.status === 401) {
        alert('다시 로그인해주세요!');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const userData = await resUser.json();
      setSelectedFaculties(userData.data_sources || []);
    } catch (err) {
      alert('다시 로그인해주세요!');
      window.location.href = '/login';
    }
  };

  fetchInitial();
}, []);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        const resFeed = await fetch(SEARCH_FEED_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ keyword: '', faculty: selectedFaculties, sort: '최신순' }),
        });

        const data = await resFeed.json();
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
        console.error('기본 피드 불러오기 실패', err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedFaculties.length > 0) {
      fetchFeed();
    }
  }, [selectedFaculties]);

  const handleFacultyToggle = (faculty: string) => {
    const updated = selectedFaculties.includes(faculty)
      ? selectedFaculties.filter((f) => f !== faculty)
      : [...selectedFaculties, faculty];
    setSelectedFaculties(updated);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-2 space-y-4">
      {/* 필터 버튼 영역 */}
      <div className="flex flex-wrap gap-2 mt-1 mb-2">
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

      {/* 게시글 렌더링 */}
      <div className="flex flex-col space-y-4 min-h-[300px]">
        {isLoading ? (
          <p className="text-center text-sm text-gray-400">피드를 불러오는 중...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onToggleLike={() => toggleLike(post.id)} showLink />
          ))
        ) : (
          <div className="text-center text-sm text-gray-400 pt-10">
            아직 구독한 학부의 게시글이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
