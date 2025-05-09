'use client';

import { useEffect, useState } from 'react';
import PostCard from '../search/PostCard';

interface Post {
  id: number;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

export default function LikePage() {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);

  // 백엔드와 연동 시 fetch로 교체 가능
  useEffect(() => {
    // 더미 데이터를 fetch 시뮬레이션
    const fetchLikedPosts = async () => {
      const data: Post[] = [
        {
          id: 1,
          title: '2025 ICT 인턴십 모집',
          category: '소프트웨어학부',
          date: '2025.03.18',
          liked: true,
          url: 'https://example.com/post1',
        },
        {
          id: 2,
          title: 'AI 연구소 채용 공고',
          category: 'AI학부',
          date: '2025.03.21',
          liked: true,
          url: 'https://example.com/post2',
        },
      ];
      setLikedPosts(data);
    };
    fetchLikedPosts();
  }, []);

  const toggleLike = (id: number) => {
    // 이 함수는 백엔드에 DELETE 요청을 보내는 용도로 대체 가능
    setLikedPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#F2F4FF] font-pretendard pb-24">
      <div className="w-[390px] mx-auto px-6 pt-6">
        <h1 className="text-xl font-bold mb-4">찜한 게시글</h1>

        {likedPosts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center pt-20">아직 찜한 게시글이 없어요.</p>
        ) : (
          <div className="space-y-4">
            {likedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={toggleLike}
                showLink
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
