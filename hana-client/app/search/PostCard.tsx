'use client';

interface Post {
  id: string; // ✅ string으로 변경
  title: string;
  category: string;
  date: string;
  liked: boolean;
  url?: string;
}

interface PostCardProps {
  post?: Post;
  onToggleLike: (id: string) => void; // ✅ string으로 변경
  showLink?: boolean;
}

export default function PostCard({ post, onToggleLike, showLink = false }: PostCardProps) {
  if (!post) return null;

  return (
    <div className="bg-white rounded-xl shadow px-4 py-3">
      <p className="text-xs text-gray-400 mb-1">{post.category}</p>
      <h3 className="text-sm font-semibold mb-2 leading-snug">{post.title}</h3>
      <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
        <span>{post.date}</span>
        <button onClick={() => onToggleLike(post.id)}>
          {post.liked ? '❤️' : '🤍'}
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
