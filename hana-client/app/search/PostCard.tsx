'use client';

import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

interface PostCardProps {
  post?: Post;
  onToggleLike: (id: string) => void;
  showLink?: boolean;
}

export default function PostCard({ post, onToggleLike, showLink = false }: PostCardProps) {
  if (!post) return null;

  return (
    <div className="bg-white rounded-xl shadow px-4 py-4 space-y-2">
      <p className="text-xs text-gray-400">{post.category}</p>
      <h3 className="text-sm font-semibold leading-snug text-gray-900">{post.title}</h3>
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>{post.date}</span>
        <button
          onClick={() => onToggleLike(post.id)}
          aria-label="좋아요 버튼"
          className="transition-transform hover:scale-110"
        >
          <Image
            src={post.liked ? '/icons/Heart Filled.svg' : '/icons/Heart Outlined.svg'}
            alt={post.liked ? '좋아요됨' : '좋아요 안됨'}
            width={20}
            height={20}
          />
        </button>
      </div>

      {showLink && post.url && (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-sky-500 font-semibold mt-1"
        >
          홈페이지 보러가기 →
        </a>
      )}
    </div>
  );
}
