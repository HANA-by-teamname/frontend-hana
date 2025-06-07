'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LikeHeader() {
  const router = useRouter();

  return (
    <div className="w-full px-1 py-4 shadow-sm flex items-center justify-between">
      <button
        onClick={() => router.push('/search')}
        aria-label="뒤로가기"
        className="flex items-center justify-center w-8 h-8"
      >
        <Image
          src="/icons/Arrow Left.svg"
          alt="뒤로가기"
          width={18}
          height={18}
        />
      </button>

      <div className="flex-1 ml-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">좋아요</h2>
        <p className="text-sm text-gray-500">내가 좋아요 누른 게시글을 확인해보세요</p>
      </div>

    </div>
  );
}
