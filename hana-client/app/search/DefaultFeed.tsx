'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { getFaculties } from '@/lib/api/getfaculty';
import { authFetch } from '@/lib/api/authFetch';
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

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const facultyList = await getFaculties(); // 공개 API라 authFetch 안 써도 됨
        setAllFaculties(facultyList);

        const resUser = await authFetch(USER_ME_ENDPOINT); // ✅ 모달 처리 포함
        const userData = await resUser.json();
        setSelectedFaculties(userData.data_sources || []);
      } catch (err) {
        console.error('❌ 사용자 정보 로딩 실패:', err);
        setSelectedFaculties([]); // fallback
      }
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        const resFeed = await authFetch(SEARCH_FEED_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: '',
            faculty: selectedFaculties,
            sort: '최신순',
          }),
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
        console.error('기본 피드 불러오기 실패:', err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedFaculties.length > 0) {
      fetchFeed();
    }
  }, [selectedFaculties]);

  const handleFacultyToggle = async (faculty: string) => {
    const updated = selectedFaculties.includes(faculty)
      ? selectedFaculties.filter((f) => f !== faculty)
      : [...selectedFaculties, faculty];

    setSelectedFaculties(updated);

    try {
      await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-faculty`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data_sources: updated }),
      });
    } catch (err) {
      console.error('❌ 필터 DB 업데이트 실패:', err);
      // 이 경우는 모달까지 띄우는 건 과한 경우라 alert 유지 가능
      alert('서버에 필터 설정 저장 중 오류가 발생했어요.');
    }
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
