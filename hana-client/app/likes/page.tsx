'use client';

import { useEffect, useState } from 'react';
import LikeHeader from '@/components/headers/LikeHeader';
import LikeSearchBar from '@/app/likes/LikeSearchBar';
import PostCard from '@/app/search/PostCard';
import { addFavorite, deleteFavorite, getFavoriteList } from '@/lib/api/favorite';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal';
import { authFetch } from '@/lib/api/authFetch';

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

export default function LikesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // ✅ 세션 유효성 검사
        const res = await authFetch('/users/me');
        if (!res.ok) throw new Error('Unauthorized');

        // ✅ 관심 게시글 가져오기
        const feeds = await getFavoriteList(token);
        setPosts(feeds);
      } catch (err) {
        console.error('❌ 인증 또는 관심 목록 불러오기 실패:', err);
        setShowSessionExpired(true);
      }
    };

    if (token) fetchFavorites();
    else setShowSessionExpired(true);
  }, [token]);

  const toggleLike = async (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;

    try {
      if (target.liked) {
        await deleteFavorite(id, token);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        await addFavorite(id, token);
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, liked: true } : p))
        );
      }
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
    }
  };

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <main className="min-h-screen bg-gray-50 font-pretendard pb-24 px-4 pt-6 w-full max-w-md mx-auto">
        <LikeHeader />
        <LikeSearchBar query={query} setQuery={setQuery} />

        <div className="space-y-4 min-h-[300px] mt-2">
          {filtered.length > 0 ? (
            filtered.map((post) => (
              <PostCard key={post.id} post={post} onToggleLike={toggleLike} showLink />
            ))
          ) : (
            <p className="text-center text-sm text-gray-400 pt-10">
              관심 목록에 해당하는 게시글이 없어요.
            </p>
          )}
        </div>
      </main>

      <SessionExpiredModal
        visible={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />
    </>
  );
}
